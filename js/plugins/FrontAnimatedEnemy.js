/*:
 * @target MZ
 * @plugindesc Front Facing Animated Enemy Plugin
 * @author Safmica
 * 
 * @help FrontAnimatedEnemy.js
 * 
 * This plugin allows you to animate your front-view enemies by specifying
 * different frames in the enemy's note box.
 * 
 * ============================================================================
 * Notetags
 * ============================================================================
 * Add these tags to an enemy's note box:
 * 
 * <Frame 1: filename>
 * <Frame 2: filename>
 * <Frame 3: filename>
 * ...
 * <Frame Speed: X>
 * <Position X: X>
 * <Position Y: Y>
 * <Upscale: X></Upscale:>
 * 
 * Example:
 * <Frame 1: Slime-Idle-1>
 * <Frame 2: Slime-Idle-2>
 * <Frame 3: Slime-Idle-3>
 * <Frame Speed: 10>
 * <Position X: 500>
 * <Position Y: 300>
 * 
 * The images MUST be placed in your img/enemies/ folder.
 */

(() => {
    const SCALE_EPSILON = 0.001;
    const scaledEnemyBitmapCache = new Map();

    function frontScaleKey(filename, scale) {
        return filename + ":" + scale.toFixed(3);
    }

    function bakeScaledEnemyBitmap(sourceBitmap, scale) {
        const width = Math.max(1, Math.round(sourceBitmap.width * scale));
        const height = Math.max(1, Math.round(sourceBitmap.height * scale));
        const scaledBitmap = new Bitmap(width, height);

        scaledBitmap.smooth = sourceBitmap.smooth;
        scaledBitmap.blt(
            sourceBitmap,
            0,
            0,
            sourceBitmap.width,
            sourceBitmap.height,
            0,
            0,
            width,
            height
        );
        return scaledBitmap;
    }

    function scaledEnemyBitmap(filename, sourceBitmap, scale) {
        const key = frontScaleKey(filename, scale);
        if (scaledEnemyBitmapCache.has(key)) {
            return scaledEnemyBitmapCache.get(key);
        }

        const scaledBitmap = new Bitmap(1, 1);
        scaledEnemyBitmapCache.set(key, scaledBitmap);

        sourceBitmap.addLoadListener(() => {
            const bakedBitmap = bakeScaledEnemyBitmap(sourceBitmap, scale);
            scaledBitmap.resize(bakedBitmap.width, bakedBitmap.height);
            scaledBitmap.blt(
                bakedBitmap,
                0,
                0,
                bakedBitmap.width,
                bakedBitmap.height,
                0,
                0,
                bakedBitmap.width,
                bakedBitmap.height
            );
        });

        return scaledEnemyBitmapCache.get(key);
    }

    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function () {
        _Sprite_Enemy_initMembers.call(this);
        this._animFrames = [];
        this._animSpeed = 10;
        this._animIndex = 0;
        this._animTimer = 0;
        this._customX = null;
        this._customY = null;
        this._isAnimatedFront = false;
        this._frontAnimScale = 1.0;
        this._frontAnimHasScale = false;
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function (battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        if (this._enemy) {
            this.setupAnimatedEnemy();
        }
    };

    Sprite_Enemy.prototype.setupAnimatedEnemy = function () {
        const enemy = this._enemy.enemy();
        if (!enemy) return;
        const note = enemy.note;

        this._animFrames = [];
        this._animSpeed = 10;
        this._animIndex = 0;
        this._animTimer = 0;
        this._customX = null;
        this._customY = null;
        this._isAnimatedFront = false;
        this._frontAnimScale = 1.0;
        this._frontAnimHasScale = false;

        // Read animation frames
        const frameRegex = /<Frame\s+(\d+):\s*(.+)>/gi;
        let match;
        const frames = [];
        while ((match = frameRegex.exec(note)) !== null) {
            const index = parseInt(match[1], 10);
            const filename = match[2].trim();
            frames[index] = filename;
        }

        // Safely filter out undefined items from skipped index numbers
        this._animFrames = frames.filter(Boolean);

        if (this._animFrames.length > 0) {
            this._isAnimatedFront = true;
            for (const filename of this._animFrames) {
                // Preload all the frames so they stream instantly inside battle
                ImageManager.loadEnemy(filename);
            }
        }

        // Read frame speed
        const speedMatch = note.match(/<Frame Speed:\s*(\d+)>/i);
        if (speedMatch) {
            this._animSpeed = parseInt(speedMatch[1], 10);
        }

        // Read custom positions
        const posXMatch = note.match(/<Position X:\s*(-?\d+)>/i);
        if (posXMatch) {
            this._customX = parseInt(posXMatch[1], 10);
        }

        const posYMatch = note.match(/<Position Y:\s*(-?\d+)>/i);
        if (posYMatch) {
            this._customY = parseInt(posYMatch[1], 10);
        }

        const scaleMatch = note.match(/<Upscale:\s*([\d.]+)>/i);
        if (scaleMatch) {
            this._frontAnimScale = Math.max(0.1, parseFloat(scaleMatch[1]));
            this._frontAnimHasScale =
                Math.abs(this._frontAnimScale - 1.0) > SCALE_EPSILON;
            this.applyFrontAnimatedScale();
        }

        // Apply custom position immediately if defined
        if (this._customX !== null || this._customY !== null) {
            const targetX = this._customX !== null ? this._customX : this._enemy.screenX();
            const targetY = this._customY !== null ? this._customY : this._enemy.screenY();
            this.setHome(targetX, targetY);
        }
    };

    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function () {
        _Sprite_Enemy_update.call(this);
        if (this._enemy && this._isAnimatedFront) {
            this.updateFrontAnimation();
            if (this._frontAnimHasScale) {
                this.applyFrontAnimatedScale();
            }
        }
    };

    Sprite_Enemy.prototype.applyFrontAnimatedScale = function () {
        const signX = this.scale.x < 0 ? -1 : 1;
        const signY = this.scale.y < 0 ? -1 : 1;

        this.scale.x = signX;
        this.scale.y = signY;
    };

    Sprite_Enemy.prototype.loadFrontAnimatedBitmap = function (filename) {
        const sourceBitmap = ImageManager.loadEnemy(filename);
        if (this._frontAnimHasScale) {
            this.bitmap = scaledEnemyBitmap(
                filename,
                sourceBitmap,
                this._frontAnimScale
            );
        } else {
            this.bitmap = sourceBitmap;
        }
    };

    Sprite_Enemy.prototype.updateFrontAnimation = function () {
        if (this._animFrames.length === 0) return;

        this._animTimer++;
        if (this._animTimer >= this._animSpeed) {
            this._animTimer = 0;
            this._animIndex++;
            if (this._animIndex >= this._animFrames.length) {
                this._animIndex = 0;
            }
        }
    };

    const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
    Sprite_Enemy.prototype.updateBitmap = function () {
        if (this._isAnimatedFront && this._animFrames.length > 0) {
            const currentName = this._animFrames[this._animIndex];
            if (this._battlerName !== currentName || this._battlerHue !== this._enemy.battlerHue()) {
                this._battlerName = currentName;
                this._battlerHue = this._enemy.battlerHue();
                this.loadFrontAnimatedBitmap(currentName);
                this.setHue(this._battlerHue);
                if (this._frontAnimHasScale) {
                    this.applyFrontAnimatedScale();
                }
                this.initVisibility();
            }
        } else {
            _Sprite_Enemy_updateBitmap.call(this);
        }
    };
})();
