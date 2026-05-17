/*:
 * @target MZ
 * @plugindesc Region-comment based dynamic light and shadow overlay.
 * @author Safmica
 *
 * @param Default Shadow Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 160
 *
 * @param Default Light Opacity
 * @type number
 * @min 0
 * @max 255
 * @default 180
 *
 * @param Ground Scan Radius
 * @type number
 * @min 1
 * @default 8
 *
 * @param Ground Fade Tiles
 * @type number
 * @min 1
 * @default 3
 *
 * @param Natural Fade Radius
 * @type number
 * @decimals 2
 * @min 0.5
 * @max 4
 * @default 1.15
 *
 * @param Natural Core Radius
 * @type number
 * @decimals 2
 * @min 0
 * @max 3
 * @default 0.35
 *
 * @param Default Player Light Radius
 * @type number
 * @decimals 2
 * @min 0.5
 * @max 8
 * @default 1.5
 *
 * @command Refresh
 * @text Refresh Light Shadow
 * @desc Force this plugin to reread event comments on the current map.
 *
 * @help DynamicLightShadow.js
 *
 * Add these comments to an active map event page. A parallel hub event is a
 * good place to collect them:
 *
 *   <IsGround: 2>
 *   <IsGround: 10, Fade>
 *   <IsShadow: "", 180>
 *   <IsShadow: 3, 160>
 *   <IsLight: 4, "", 180>
 *   <IsLight: 5, #F54927, 210>
 *   <IsPlayer: "", 180, 1.5>
 *
 * Tags:
 *   <IsGround: region, mode>
 *     Marks ground/reference regions. Light and shadow regions close to these
 *     regions fade away from the ground side. Mode can be NoFade or Fade.
 *     NoFade is the default and keeps the ground clear. Fade lets light/shadow
 *     bleed softly into the ground without fully filling the ground center.
 *
 *   <IsShadow: region, opacity>
 *     Draws darkness on a region. Leave region empty or use "" to darken the
 *     whole map except IsLight regions.
 *
 *   <IsLight: region, color, opacity>
 *     Draws colored light on a region. The color can be "" for white or a hex
 *     color like #F54927.
 *
 *   <IsPlayer: color, opacity, radius>
 *     Draws a round light around the player. The color can be "" for white or a
 *     hex color like #F54927. Radius is measured in tiles.
 *
 * Opacity uses RPG Maker's 0 to 255 range.
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "DynamicLightShadow";
    const params = PluginManager.parameters(PLUGIN_NAME);

    const COMMENT_TAG_REGEX =
        /<(IsGround|IsShadow|IsLight|IsPlayer)(?:\s*:\s*([^>]*))?>/gi;
    const COMMENT_CODES = [108, 408];

    const SHADOW_RGB = { r: 0, g: 0, b: 0 };
    const WHITE_RGB = { r: 255, g: 255, b: 255 };

    const readNumberParam = (name, fallback, min, max) => {
        const value = Number(params[name]);
        if (!Number.isFinite(value)) return fallback;
        return clamp(value, min, max);
    };

    const DEFAULT_SHADOW_OPACITY = readNumberParam(
        "Default Shadow Opacity",
        160,
        0,
        255
    );
    const DEFAULT_LIGHT_OPACITY = readNumberParam(
        "Default Light Opacity",
        180,
        0,
        255
    );
    const GROUND_SCAN_RADIUS = readNumberParam("Ground Scan Radius", 8, 1, 64);
    const GROUND_FADE_TILES = readNumberParam("Ground Fade Tiles", 3, 1, 64);
    const GROUND_FADE_BLEED_STRENGTH = 1;
    const NATURAL_EFFECT_RADIUS = readNumberParam(
        "Natural Fade Radius",
        1.15,
        0.5,
        4
    );
    const NATURAL_EFFECT_CORE = Math.min(
        readNumberParam("Natural Core Radius", 0.35, 0, 3),
        NATURAL_EFFECT_RADIUS - 0.05
    );
    const NATURAL_SCAN_RADIUS = Math.ceil(NATURAL_EFFECT_RADIUS);
    const DEFAULT_PLAYER_LIGHT_RADIUS = readNumberParam(
        "Default Player Light Radius",
        1.5,
        0.5,
        8
    );
    const OVERLAY_Z = 5.5;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function normalize(value) {
        if (value === undefined || value === null) return "";
        return String(value).trim();
    }

    function cleanValue(value) {
        let text = normalize(value);
        let changed = true;
        while (changed && text.length >= 2) {
            changed = false;
            if (text.startsWith("[") && text.endsWith("]")) {
                text = text.slice(1, -1).trim();
                changed = true;
            }
            if (
                (text.startsWith('"') && text.endsWith('"')) ||
                (text.startsWith("'") && text.endsWith("'"))
            ) {
                text = text.slice(1, -1).trim();
                changed = true;
            }
        }
        return text;
    }

    function splitArgs(rawText) {
        const text = normalize(rawText);
        const args = [];
        let current = "";
        let quote = "";
        let bracketDepth = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (quote) {
                current += char;
                if (char === quote) quote = "";
                continue;
            }

            if (char === '"' || char === "'") {
                quote = char;
                current += char;
                continue;
            }

            if (char === "[") {
                bracketDepth++;
                current += char;
                continue;
            }

            if (char === "]") {
                bracketDepth = Math.max(0, bracketDepth - 1);
                current += char;
                continue;
            }

            if (char === "," && bracketDepth === 0) {
                args.push(current.trim());
                current = "";
                continue;
            }

            current += char;
        }

        args.push(current.trim());
        return args;
    }

    function parseRegionSet(value) {
        const text = cleanValue(value);
        const regions = new Set();
        if (!text) return regions;

        const tokens = text
            .split(/[\s,;|/]+/)
            .map(token => cleanValue(token))
            .filter(Boolean);

        for (const token of tokens) {
            const number = Number(token);
            if (Number.isInteger(number) && number >= 0) {
                regions.add(number);
            }
        }

        return regions;
    }

    function parseOpacity(value, fallback) {
        const text = cleanValue(value);
        if (!text) return fallback;

        let number = Number(text);
        if (!Number.isFinite(number)) return fallback;
        if (number > 0 && number <= 1 && text.includes(".")) {
            number *= 255;
        }
        return clamp(Math.round(number), 0, 255);
    }

    function parseRadius(value, fallback) {
        const text = cleanValue(value);
        if (!text) return fallback;

        const number = Number(text);
        if (!Number.isFinite(number)) return fallback;
        return clamp(number, 0.5, 8);
    }

    function parseColor(value) {
        const text = cleanValue(value);
        if (!text) return { color: "#ffffff", rgb: WHITE_RGB };

        const match = text.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (!match) return { color: "#ffffff", rgb: WHITE_RGB };

        let hex = match[1].toLowerCase();
        if (hex.length === 3) {
            hex = hex
                .split("")
                .map(char => char + char)
                .join("");
        }

        return {
            color: "#" + hex,
            rgb: {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16)
            }
        };
    }

    function parseGroundMode(value) {
        const text = cleanValue(value).toLowerCase();
        return text === "fade" ? "fade" : "nofade";
    }

    function smoothStep(edge0, edge1, value) {
        if (edge0 === edge1) {
            return value < edge0 ? 0 : 1;
        }
        const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
        return t * t * (3 - 2 * t);
    }

    function activeCommentText(event) {
        if (!event || !event.page || !event.page()) return "";

        const list = event.list ? event.list() : null;
        if (!list) return "";

        const lines = [];
        for (const command of list) {
            if (command && COMMENT_CODES.includes(command.code)) {
                lines.push(String(command.parameters[0] || ""));
            }
        }
        return lines.join("\n");
    }

    const DynamicLightShadow = {
        _version: 1,
        _settingsKey: "",
        _settings: null,
        _patternCache: new Map(),

        requestRefresh() {
            this._version++;
            this._settingsKey = "";
        },

        version() {
            return this._version;
        },

        settings() {
            if (!$gameMap) return this.emptySettings();

            const key = $gameMap.mapId() + ":" + this._version;
            if (this._settings && this._settingsKey === key) {
                return this._settings;
            }

            this._settings = this.readSettingsFromMap();
            this._settingsKey = key;
            return this._settings;
        },

        emptySettings() {
            return {
                groundRegions: new Set(),
                groundFadeRegions: new Set(),
                lightRegions: new Set(),
                shadows: [],
                lights: [],
                playerLights: [],
                hasEffects: false
            };
        },

        readSettingsFromMap() {
            const settings = this.emptySettings();
            const events = $gameMap && $gameMap.events ? $gameMap.events() : [];

            for (const event of events) {
                this.readTagsFromText(activeCommentText(event), settings);
            }

            settings.hasEffects =
                settings.shadows.length > 0 ||
                settings.lights.length > 0 ||
                settings.playerLights.length > 0;
            return settings;
        },

        readTagsFromText(text, settings) {
            COMMENT_TAG_REGEX.lastIndex = 0;
            let match;

            while ((match = COMMENT_TAG_REGEX.exec(text)) !== null) {
                const tagName = match[1].toLowerCase();
                const args = splitArgs(match[2]);

                if (tagName === "isground") {
                    const mode = parseGroundMode(args[1]);
                    for (const regionId of parseRegionSet(args[0])) {
                        settings.groundRegions.add(regionId);
                        if (mode === "fade") {
                            settings.groundFadeRegions.add(regionId);
                        } else {
                            settings.groundFadeRegions.delete(regionId);
                        }
                    }
                } else if (tagName === "isshadow") {
                    const regionIds = parseRegionSet(args[0]);
                    settings.shadows.push({
                        allRegions: regionIds.size === 0,
                        regionIds,
                        color: "#000000",
                        rgb: SHADOW_RGB,
                        opacity: parseOpacity(args[1], DEFAULT_SHADOW_OPACITY)
                    });
                } else if (tagName === "islight") {
                    const regionIds = parseRegionSet(args[0]);
                    if (regionIds.size === 0) continue;

                    const color = parseColor(args[1]);
                    const entry = {
                        allRegions: false,
                        regionIds,
                        color: color.color,
                        rgb: color.rgb,
                        opacity: parseOpacity(args[2], DEFAULT_LIGHT_OPACITY)
                    };
                    settings.lights.push(entry);

                    for (const regionId of regionIds) {
                        settings.lightRegions.add(regionId);
                    }
                } else if (tagName === "isplayer") {
                    const color = parseColor(args[0]);
                    settings.playerLights.push({
                        color: color.color,
                        rgb: color.rgb,
                        opacity: parseOpacity(args[1], DEFAULT_LIGHT_OPACITY),
                        radius: parseRadius(args[2], DEFAULT_PLAYER_LIGHT_RADIUS)
                    });
                }
            }
        },

        matchesEntry(entry, regionId, settings) {
            if (entry.allRegions) {
                return !settings.lightRegions.has(regionId);
            }
            return entry.regionIds.has(regionId);
        },

        patternFor(effect, mask, tileWidth, tileHeight) {
            const key = [
                tileWidth,
                tileHeight,
                effect.color,
                effect.opacity,
                mask.key
            ].join(":");

            if (this._patternCache.has(key)) {
                return this._patternCache.get(key);
            }

            const canvas = document.createElement("canvas");
            canvas.width = tileWidth;
            canvas.height = tileHeight;

            const context = canvas.getContext("2d");
            const image = context.createImageData(tileWidth, tileHeight);
            const data = image.data;
            const rgb = effect.rgb;

            for (let py = 0; py < tileHeight; py++) {
                const v = (py + 0.5) / tileHeight;
                for (let px = 0; px < tileWidth; px++) {
                    const u = (px + 0.5) / tileWidth;
                    const alpha = Math.round(effect.opacity * mask.factor(u, v));
                    const index = (py * tileWidth + px) * 4;
                    data[index] = rgb.r;
                    data[index + 1] = rgb.g;
                    data[index + 2] = rgb.b;
                    data[index + 3] = alpha;
                }
            }

            context.putImageData(image, 0, 0);
            this._patternCache.set(key, canvas);
            return canvas;
        }
    };

    window.DynamicLightShadow = DynamicLightShadow;

    function mapCoordinate(rawX, rawY) {
        const x = $gameMap.roundX(rawX);
        const y = $gameMap.roundY(rawY);

        if (!$gameMap.isLoopHorizontal() && (x < 0 || x >= $gameMap.width())) {
            return null;
        }
        if (!$gameMap.isLoopVertical() && (y < 0 || y >= $gameMap.height())) {
            return null;
        }

        return { x, y };
    }

    function sourceInfluence(distance) {
        return smoothStep(NATURAL_EFFECT_RADIUS, NATURAL_EFFECT_CORE, distance);
    }

    function playerLightCoreRadius(radius) {
        return Math.min(NATURAL_EFFECT_CORE, radius - 0.05);
    }

    function playerLightInfluence(distance, radius) {
        return smoothStep(radius, playerLightCoreRadius(radius), distance);
    }

    function playerRealPosition() {
        if (!$gamePlayer) return null;

        const x = Number.isFinite($gamePlayer._realX) ?
            $gamePlayer._realX :
            $gamePlayer.x;
        const y = Number.isFinite($gamePlayer._realY) ?
            $gamePlayer._realY :
            $gamePlayer.y;

        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        return { x, y };
    }

    function playerPositionKey() {
        const position = playerRealPosition();
        if (!position) return "";
        return position.x.toFixed(2) + "," + position.y.toFixed(2);
    }

    function distanceToCell(u, v, dx, dy) {
        const nearestX = clamp(u, dx, dx + 1);
        const nearestY = clamp(v, dy, dy + 1);
        return Math.hypot(u - nearestX, v - nearestY);
    }

    function distanceToCellCenter(u, v, dx, dy) {
        return Math.hypot(u - (dx + 0.5), v - (dy + 0.5));
    }

    function cellKey(cell) {
        return cell.dx + "," + cell.dy;
    }

    function effectCoverage(cells, u, v) {
        let clearRate = 1;

        for (const cell of cells) {
            const distance = distanceToCellCenter(u, v, cell.dx, cell.dy);
            clearRate *= 1 - sourceInfluence(distance);
        }

        return clamp(1 - clearRate, 0, 1);
    }

    function groundBleedCoverage(cells, u, v) {
        return clamp(
            effectCoverage(cells, u, v) * GROUND_FADE_BLEED_STRENGTH,
            0,
            1
        );
    }

    function groundDistanceFactor(cells, u, v) {
        if (cells.length === 0) return 1;

        let nearestDistance = Infinity;
        for (const cell of cells) {
            nearestDistance = Math.min(
                nearestDistance,
                distanceToCell(u, v, cell.dx, cell.dy)
            );
        }

        const raw = 1 - nearestDistance / GROUND_FADE_TILES;
        return smoothStep(0, 1, clamp(raw, 0, 1));
    }

    function naturalMaskFor(entry, mapX, mapY, settings) {
        const effectCells = [];
        const groundCells = [];
        const currentCoordinate = mapCoordinate(mapX, mapY);
        let currentRegionId = 0;
        let isFadeGroundOnly = false;

        if (currentCoordinate) {
            currentRegionId = $gameMap.regionId(
                currentCoordinate.x,
                currentCoordinate.y
            );
            isFadeGroundOnly =
                settings.groundFadeRegions.has(currentRegionId) &&
                !DynamicLightShadow.matchesEntry(entry, currentRegionId, settings);
            if (
                settings.groundRegions.has(currentRegionId) &&
                !settings.groundFadeRegions.has(currentRegionId) &&
                !DynamicLightShadow.matchesEntry(entry, currentRegionId, settings)
            ) {
                return null;
            }
        }

        for (let dy = -NATURAL_SCAN_RADIUS; dy <= NATURAL_SCAN_RADIUS; dy++) {
            for (let dx = -NATURAL_SCAN_RADIUS; dx <= NATURAL_SCAN_RADIUS; dx++) {
                const coordinate = mapCoordinate(mapX + dx, mapY + dy);
                if (!coordinate) continue;

                const regionId = $gameMap.regionId(coordinate.x, coordinate.y);
                if (!DynamicLightShadow.matchesEntry(entry, regionId, settings)) {
                    continue;
                }

                effectCells.push({ dx, dy });
            }
        }

        if (effectCells.length === 0) return null;

        if (settings.groundRegions.size > 0) {
            for (let dy = -GROUND_SCAN_RADIUS; dy <= GROUND_SCAN_RADIUS; dy++) {
                for (let dx = -GROUND_SCAN_RADIUS; dx <= GROUND_SCAN_RADIUS; dx++) {
                    const distance = Math.abs(dx) + Math.abs(dy);
                    if (distance > GROUND_SCAN_RADIUS) continue;

                    const coordinate = mapCoordinate(mapX + dx, mapY + dy);
                    if (!coordinate) continue;

                    const regionId = $gameMap.regionId(coordinate.x, coordinate.y);
                    if (settings.groundRegions.has(regionId)) {
                        groundCells.push({ dx, dy });
                    }
                }
            }
        }

        const key = [
            "natural",
            isFadeGroundOnly ? "ground-fade" : "normal",
            effectCells.map(cellKey).join("|"),
            groundCells.map(cellKey).join("|")
        ].join(":");

        return {
            key,
            factor(u, v) {
                const coverage = isFadeGroundOnly ?
                    groundBleedCoverage(effectCells, u, v) :
                    effectCoverage(effectCells, u, v);
                if (coverage <= 0) return 0;
                return clamp(coverage * groundDistanceFactor(groundCells, u, v), 0, 1);
            }
        };
    }

    function playerLightMaskFor(mapX, mapY, playerX, playerY, radius) {
        const coordinate = mapCoordinate(mapX, mapY);
        if (!coordinate) return null;

        const centerX = playerX + 0.5;
        const centerY = playerY + 0.5;
        const nearestX = clamp(centerX, mapX, mapX + 1);
        const nearestY = clamp(centerY, mapY, mapY + 1);
        const nearestDistance = Math.hypot(centerX - nearestX, centerY - nearestY);
        if (nearestDistance > radius) return null;

        const relativeX = mapX - centerX;
        const relativeY = mapY - centerY;
        const key = [
            "player",
            radius.toFixed(2),
            relativeX.toFixed(2),
            relativeY.toFixed(2)
        ].join(":");

        return {
            key,
            factor(u, v) {
                const distance = Math.hypot(
                    mapX + u - centerX,
                    mapY + v - centerY
                );
                return playerLightInfluence(distance, radius);
            }
        };
    }

    function mergedEntries(entries) {
        const groups = new Map();

        for (const entry of entries) {
            const key = entry.color + ":" + entry.opacity;
            if (!groups.has(key)) {
                groups.set(key, {
                    allRegions: false,
                    regionIds: new Set(),
                    color: entry.color,
                    rgb: entry.rgb,
                    opacity: entry.opacity
                });
            }

            const group = groups.get(key);
            group.allRegions = group.allRegions || entry.allRegions;
            for (const regionId of entry.regionIds) {
                group.regionIds.add(regionId);
            }
        }

        return Array.from(groups.values());
    }

    function mergedPlayerEntries(entries) {
        const groups = new Map();

        for (const entry of entries) {
            const key = entry.color + ":" + entry.opacity + ":" + entry.radius;
            if (!groups.has(key)) {
                groups.set(key, {
                    color: entry.color,
                    rgb: entry.rgb,
                    opacity: entry.opacity,
                    radius: entry.radius
                });
            }
        }

        return Array.from(groups.values());
    }

    function Sprite_DynamicLightShadow() {
        this.initialize(...arguments);
    }

    Sprite_DynamicLightShadow.prototype = Object.create(Sprite.prototype);
    Sprite_DynamicLightShadow.prototype.constructor = Sprite_DynamicLightShadow;

    Sprite_DynamicLightShadow.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._lastRenderKey = "";
    };

    Sprite_DynamicLightShadow.prototype.update = function() {
        Sprite.prototype.update.call(this);
        this.updateBitmapSize();

        const settings = DynamicLightShadow.settings();
        if (!settings.hasEffects) {
            this.clearIfNeeded();
            this.visible = false;
            return;
        }

        this.visible = true;
        const renderKey = this.renderKey(settings);
        if (renderKey === this._lastRenderKey) return;

        this._lastRenderKey = renderKey;
        this.redraw(settings);
    };

    Sprite_DynamicLightShadow.prototype.updateBitmapSize = function() {
        if (
            this.bitmap.width !== Graphics.width ||
            this.bitmap.height !== Graphics.height
        ) {
            this.bitmap.resize(Graphics.width, Graphics.height);
            this._lastRenderKey = "";
        }
    };

    Sprite_DynamicLightShadow.prototype.renderKey = function(settings) {
        const playerKey =
            settings.playerLights.length > 0 ? playerPositionKey() : "";

        return [
            $gameMap.mapId(),
            DynamicLightShadow.version(),
            $gameMap.displayX(),
            $gameMap.displayY(),
            Graphics.width,
            Graphics.height,
            $gameMap.tileWidth(),
            $gameMap.tileHeight(),
            settings.shadows.length,
            settings.lights.length,
            settings.playerLights.length,
            playerKey,
            this.playerSpriteKey()
        ].join(":");
    };

    Sprite_DynamicLightShadow.prototype.clearIfNeeded = function() {
        if (!this._lastRenderKey) return;
        this.bitmap.context.clearRect(0, 0, this.bitmap.width, this.bitmap.height);
        this.bitmap._baseTexture.update();
        this._lastRenderKey = "";
    };

    Sprite_DynamicLightShadow.prototype.redraw = function(settings) {
        const bitmap = this.bitmap;
        const context = bitmap.context;

        context.save();
        context.clearRect(0, 0, bitmap.width, bitmap.height);
        context.globalCompositeOperation = "source-over";
        this.drawEffects(context, settings.shadows, settings);
        this.drawEffects(context, settings.lights, settings);
        this.drawPlayerEffects(context, settings.playerLights);
        this.erasePlayerSprite(context);
        context.restore();

        bitmap._baseTexture.update();
    };

    Sprite_DynamicLightShadow.prototype.drawEffects = function(
        context,
        entries,
        settings
    ) {
        if (entries.length === 0) return;

        const groups = mergedEntries(entries);
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const displayX = $gameMap.displayX();
        const displayY = $gameMap.displayY();
        const padding = NATURAL_SCAN_RADIUS + 1;
        const startX = Math.floor(displayX) - padding;
        const startY = Math.floor(displayY) - padding;
        const endX = Math.ceil(displayX + Graphics.width / tileWidth) + padding;
        const endY = Math.ceil(displayY + Graphics.height / tileHeight) + padding;

        for (let rawY = startY; rawY <= endY; rawY++) {
            for (let rawX = startX; rawX <= endX; rawX++) {
                const screenX = Math.floor((rawX - displayX) * tileWidth);
                const screenY = Math.floor((rawY - displayY) * tileHeight);

                for (const entry of groups) {
                    const mask = naturalMaskFor(entry, rawX, rawY, settings);
                    if (!mask) continue;

                    const pattern = DynamicLightShadow.patternFor(
                        entry,
                        mask,
                        tileWidth,
                        tileHeight
                    );
                    context.drawImage(pattern, screenX, screenY);
                }
            }
        }
    };

    Sprite_DynamicLightShadow.prototype.drawPlayerEffects = function(
        context,
        entries
    ) {
        if (entries.length === 0) return;

        const playerPosition = playerRealPosition();
        if (!playerPosition) return;

        const groups = mergedPlayerEntries(entries);
        const tileWidth = $gameMap.tileWidth();
        const tileHeight = $gameMap.tileHeight();
        const displayX = $gameMap.displayX();
        const displayY = $gameMap.displayY();
        const maxRadius = groups.reduce(
            (max, entry) => Math.max(max, entry.radius),
            DEFAULT_PLAYER_LIGHT_RADIUS
        );
        const padding = Math.ceil(maxRadius) + 1;
        const startX = Math.floor(playerPosition.x) - padding;
        const startY = Math.floor(playerPosition.y) - padding;
        const endX = Math.ceil(playerPosition.x) + padding;
        const endY = Math.ceil(playerPosition.y) + padding;

        for (let rawY = startY; rawY <= endY; rawY++) {
            for (let rawX = startX; rawX <= endX; rawX++) {
                const screenX = Math.floor((rawX - displayX) * tileWidth);
                const screenY = Math.floor((rawY - displayY) * tileHeight);

                for (const entry of groups) {
                    const mask = playerLightMaskFor(
                        rawX,
                        rawY,
                        playerPosition.x,
                        playerPosition.y,
                        entry.radius
                    );
                    if (!mask) continue;

                    const pattern = DynamicLightShadow.patternFor(
                        entry,
                        mask,
                        tileWidth,
                        tileHeight
                    );
                    context.drawImage(pattern, screenX, screenY);
                }
            }
        }
    };

    Sprite_DynamicLightShadow.prototype.playerCharacterSprite = function() {
        const spriteset = this._spriteset;
        const sprites = spriteset && spriteset._characterSprites;
        if (!sprites) return null;
        return sprites.find(sprite => sprite && sprite._character === $gamePlayer);
    };

    Sprite_DynamicLightShadow.prototype.playerSpriteKey = function() {
        const sprite = this.playerCharacterSprite();
        if (!sprite || !sprite.visible || !sprite.bitmap || !sprite.bitmap.isReady()) {
            return "no-player-sprite";
        }

        const frame = sprite._frame;
        return [
            Math.round(sprite.x),
            Math.round(sprite.y),
            sprite.alpha.toFixed(2),
            sprite.scale.x.toFixed(2),
            sprite.scale.y.toFixed(2),
            frame.x,
            frame.y,
            frame.width,
            frame.height
        ].join(",");
    };

    Sprite_DynamicLightShadow.prototype.erasePlayerSprite = function(context) {
        const sprite = this.playerCharacterSprite();
        if (!sprite || !sprite.visible || sprite.alpha <= 0) return;

        context.save();
        context.globalCompositeOperation = "destination-out";
        this.eraseSpriteFrame(context, sprite, sprite.x, sprite.y, sprite.alpha);

        if (sprite._upperBody && sprite._upperBody.visible) {
            this.eraseSpriteFrame(
                context,
                sprite._upperBody,
                sprite.x + sprite._upperBody.x,
                sprite.y + sprite._upperBody.y,
                sprite.alpha * sprite._upperBody.alpha
            );
        }
        if (sprite._lowerBody && sprite._lowerBody.visible) {
            this.eraseSpriteFrame(
                context,
                sprite._lowerBody,
                sprite.x + sprite._lowerBody.x,
                sprite.y + sprite._lowerBody.y,
                sprite.alpha * sprite._lowerBody.alpha
            );
        }
        context.restore();
    };

    Sprite_DynamicLightShadow.prototype.eraseSpriteFrame = function(
        context,
        sprite,
        x,
        y,
        alpha
    ) {
        const bitmap = sprite.bitmap;
        if (!bitmap || !bitmap.isReady()) return;

        const source = bitmap._canvas || bitmap._image;
        const frame = sprite._frame;
        if (!source || !frame || frame.width <= 0 || frame.height <= 0) return;

        const width = frame.width * Math.abs(sprite.scale.x);
        const height = frame.height * Math.abs(sprite.scale.y);
        const drawX = Math.round(x - sprite.anchor.x * width);
        const drawY = Math.round(y - sprite.anchor.y * height);

        context.globalAlpha = clamp(alpha, 0, 1);
        context.drawImage(
            source,
            frame.x,
            frame.y,
            frame.width,
            frame.height,
            drawX,
            drawY,
            Math.round(width),
            Math.round(height)
        );
    };

    PluginManager.registerCommand(PLUGIN_NAME, "Refresh", () => {
        DynamicLightShadow.requestRefresh();
    });

    const _Game_Map_setup = Game_Map.prototype.setup;
    Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId);
        DynamicLightShadow.requestRefresh();
    };

    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.call(this);
        DynamicLightShadow.requestRefresh();
    };

    const _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
    Spriteset_Map.prototype.createCharacters = function() {
        this.createDynamicLightShadow();
        _Spriteset_Map_createCharacters.call(this);
    };

    Spriteset_Map.prototype.createDynamicLightShadow = function() {
        this._dynamicLightShadowSprite = new Sprite_DynamicLightShadow();
        this._dynamicLightShadowSprite._spriteset = this;
        this._dynamicLightShadowSprite.z = OVERLAY_Z;
        if (this._tilemap) {
            this._tilemap.addChild(this._dynamicLightShadowSprite);
        } else {
            this.addChild(this._dynamicLightShadowSprite);
        }
    };
})();