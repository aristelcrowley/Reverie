/*:
 * @target MZ
 * @plugindesc Reverie - Menampilkan dua gambar credit sebelum title screen.
 * @author Safmica
 *
 * @param Image1
 * @text Credit Image 1
 * @type file
 * @dir img/pictures/
 * @default Beginning1_1
 * @desc Gambar pertama dari folder img/pictures. Isi tanpa ekstensi .png.
 *
 * @param Image2
 * @text Credit Image 2
 * @type file
 * @dir img/pictures/
 * @default Beginning1_2
 * @desc Gambar kedua dari folder img/pictures. Isi tanpa ekstensi .png.
 *
 * @param DisplayFrames
 * @text Durasi Tampil
 * @type number
 * @min 1
 * @default 120
 * @desc Lama tiap gambar diam di layar, dalam frame. 60 frame kira-kira 1 detik.
 *
 * @param FadeFrames
 * @text Durasi Fade
 * @type number
 * @min 0
 * @default 30
 * @desc Lama fade in dan fade out, dalam frame.
 *
 * @param FitMode
 * @text Mode Ukuran
 * @type select
 * @option Fit
 * @value fit
 * @option Cover
 * @value cover
 * @option Original
 * @value original
 * @default fit
 * @desc Fit menampilkan seluruh gambar, Cover memenuhi layar, Original tanpa resize.
 *
 * @param BackgroundColor
 * @text Warna Background
 * @type string
 * @default #000000
 * @desc Warna belakang selama credit tampil.
 *
 * @param AllowSkip
 * @text Bisa Diskip
 * @type boolean
 * @on Ya
 * @off Tidak
 * @default true
 * @desc Jika aktif, OK/Cancel/click/tap akan langsung lanjut ke gambar berikutnya.
 *
 * @help
 * Plugin ini menampilkan dua gambar dari img/pictures sebelum masuk ke
 * title screen / homepage.
 *
 * Cara pakai:
 * 1. Letakkan file PNG credit di folder img/pictures.
 * 2. Aktifkan plugin ini di Plugin Manager.
 * 3. Pilih file untuk parameter Credit Image 1 dan Credit Image 2.
 *
 * Catatan:
 * - Gambar hanya muncul saat game pertama kali dibuka.
 * - Battle Test dan Event Test tidak akan menampilkan credit ini.
 * - Nama file pada parameter tidak perlu memakai ekstensi .png.
 */

(() => {
    "use strict";

    const pluginName = "PreTitleCredits";
    const params = PluginManager.parameters(pluginName);

    const config = {
        images: [
            normalizePictureName(params.Image1),
            normalizePictureName(params.Image2)
        ].filter(Boolean),
        displayFrames: Math.max(1, Number(params.DisplayFrames || 120)),
        fadeFrames: Math.max(0, Number(params.FadeFrames || 30)),
        fitMode: String(params.FitMode || "fit").toLowerCase(),
        backgroundColor: String(params.BackgroundColor || "#000000"),
        allowSkip: String(params.AllowSkip || "true") === "true"
    };

    function normalizePictureName(value) {
        return String(value || "")
            .trim()
            .replace(/\\/g, "/")
            .replace(/^img\/pictures\//i, "")
            .replace(/\.png$/i, "");
    }

    function shouldShowCredits() {
        return config.images.length > 0 && !DataManager.isBattleTest() && !DataManager.isEventTest();
    }

    function Scene_PreTitleCredits() {
        this.initialize(...arguments);
    }

    Scene_PreTitleCredits.prototype = Object.create(Scene_Base.prototype);
    Scene_PreTitleCredits.prototype.constructor = Scene_PreTitleCredits;

    Scene_PreTitleCredits.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this._index = 0;
        this._phase = "fadeIn";
        this._timer = 0;
        this._currentSprite = null;
        this._creditBitmaps = [];
    };

    Scene_PreTitleCredits.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        this.createBackground();
        this.preloadCredits();
    };

    Scene_PreTitleCredits.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        this._backgroundSprite.bitmap.fillAll(config.backgroundColor);
        this.addChild(this._backgroundSprite);
    };

    Scene_PreTitleCredits.prototype.preloadCredits = function() {
        this._creditBitmaps = config.images.map(name => ImageManager.loadPicture(name));
    };

    Scene_PreTitleCredits.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this.showCurrentCredit();
    };

    Scene_PreTitleCredits.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (!this._currentSprite) return;
        if (this.isSkipTriggered()) {
            this.advanceCredit();
            return;
        }
        this.updateCreditPhase();
    };

    Scene_PreTitleCredits.prototype.isSkipTriggered = function() {
        if (!config.allowSkip) return false;
        return Input.isTriggered("ok") || Input.isTriggered("cancel") || TouchInput.isTriggered();
    };

    Scene_PreTitleCredits.prototype.updateCreditPhase = function() {
        this._timer++;
        if (this._phase === "fadeIn") {
            this._currentSprite.opacity = this.fadeOpacity(this._timer);
            if (this._timer >= config.fadeFrames) {
                this.startPhase("display");
            }
        } else if (this._phase === "display") {
            this._currentSprite.opacity = 255;
            if (this._timer >= config.displayFrames) {
                this.startPhase("fadeOut");
            }
        } else if (this._phase === "fadeOut") {
            this._currentSprite.opacity = 255 - this.fadeOpacity(this._timer);
            if (this._timer >= config.fadeFrames) {
                this.advanceCredit();
            }
        }
    };

    Scene_PreTitleCredits.prototype.fadeOpacity = function(frame) {
        if (config.fadeFrames <= 0) return 255;
        return Math.round(255 * Math.min(frame / config.fadeFrames, 1));
    };

    Scene_PreTitleCredits.prototype.startPhase = function(phase) {
        this._phase = phase;
        this._timer = 0;
        if (phase === "fadeOut" && config.fadeFrames <= 0) {
            this.advanceCredit();
        }
    };

    Scene_PreTitleCredits.prototype.showCurrentCredit = function() {
        this.removeCurrentCredit();
        const bitmap = this._creditBitmaps[this._index];
        if (!bitmap) {
            this.gotoTitle();
            return;
        }

        this._currentSprite = new Sprite(bitmap);
        this._currentSprite.anchor.set(0.5, 0.5);
        this._currentSprite.x = Graphics.width / 2;
        this._currentSprite.y = Graphics.height / 2;
        this._currentSprite.opacity = config.fadeFrames <= 0 ? 255 : 0;
        this.fitCreditSprite(this._currentSprite);
        this.addChild(this._currentSprite);
        this.startPhase(config.fadeFrames <= 0 ? "display" : "fadeIn");
    };

    Scene_PreTitleCredits.prototype.fitCreditSprite = function(sprite) {
        if (!sprite.bitmap || !sprite.bitmap.width || !sprite.bitmap.height) return;
        if (config.fitMode === "original") return;

        const ratioX = Graphics.width / sprite.bitmap.width;
        const ratioY = Graphics.height / sprite.bitmap.height;
        const scale = config.fitMode === "cover" ? Math.max(ratioX, ratioY) : Math.min(ratioX, ratioY);
        sprite.scale.set(scale, scale);
    };

    Scene_PreTitleCredits.prototype.advanceCredit = function() {
        this._index++;
        if (this._index >= this._creditBitmaps.length) {
            this.gotoTitle();
        } else {
            this.showCurrentCredit();
        }
    };

    Scene_PreTitleCredits.prototype.removeCurrentCredit = function() {
        if (!this._currentSprite) return;
        this.removeChild(this._currentSprite);
        this._currentSprite = null;
    };

    Scene_PreTitleCredits.prototype.gotoTitle = function() {
        this.removeCurrentCredit();
        SceneManager.goto(Scene_Title);
    };

    Scene_PreTitleCredits.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        this.removeCurrentCredit();
        if (this._backgroundSprite && this._backgroundSprite.bitmap) {
            this._backgroundSprite.bitmap.destroy();
        }
    };

    const _Scene_Boot_startNormalGame = Scene_Boot.prototype.startNormalGame;
    Scene_Boot.prototype.startNormalGame = function() {
        if (!shouldShowCredits()) {
            _Scene_Boot_startNormalGame.call(this);
            return;
        }

        this.checkPlayerLocation();
        DataManager.setupNewGame();
        Window_TitleCommand.initCommandPosition();
        SceneManager.goto(Scene_PreTitleCredits);
    };
})();
