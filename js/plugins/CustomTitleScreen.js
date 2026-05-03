/*:

* @target MZ
* @plugindesc Custom Cinematic Title Screen (Sprite-Based, No Window UI)
* @author Safmica
*
* @param BackgroundImage
* @type file
* @dir img/titles1/
* @default Ruins
*
* @param MenuX
* @type number
* @default 100
*
* @param MenuY
* @type number
* @default 100
*
* @param Spacing
* @type number
* @default 60
*
* @param FontSize
* @type number
* @default 36
  */

FontManager.load("ReverieFont", "AmaticSC-Regular.ttf");
FontManager.load("ReverieFontBold", "AmaticSC-Bold.ttf");

(() => {

    const pluginName = "CustomTitleScreen";
    const params = PluginManager.parameters(pluginName);

    const bgImage = String(params["BackgroundImage"] || "Ruins");
    const menuX = Number(params["MenuX"] || 100);
    const menuY = Number(params["MenuY"] || 50);
    const spacing = Number(params["Spacing"] || 60);
    const fontSize = Number(params["FontSize"] || 36);

    // ==============================
    // SPRITE COMMAND
    // ==============================
    class Sprite_Command extends Sprite {
        constructor(text, symbol, x, y) {
            super();
            this._text = text;
            this._symbol = symbol;
            this._selected = false;

            this.x = x;
            this.y = y;
            this.anchor.y = 0.5;

            this.bitmap = new Bitmap(300, fontSize + 20);
            this.bitmap.fontFace = "ReverieFont";
            this.bitmap.fontSize = fontSize;

            this._targetOpacity = 160;
            this.opacity = 160;

            this._targetScale = 1.0;
            this.scale.set(1);

            this.refresh();
            this.setSelected(false);
        }

        refresh() {
            this.bitmap.clear();
            this.bitmap.textColor = this._selected ? "#ffffff" : "#aaaaaa";
            this.bitmap.outlineColor = "rgba(0,0,0,0.8)";
            this.bitmap.outlineWidth = 4;
            this.bitmap.drawText(this._text, 5, 0, 300, this.bitmap.height, "left");
        }

        setSelected(v) {
            if (this._selected !== v) {
                this._selected = v;
                this._targetOpacity = v ? 255 : 160;
                this._targetScale = v ? 1.1 : 1.0;
                this.refresh();
            }
        }

        update() {
            super.update();

            this.opacity += (this._targetOpacity - this.opacity) * 0.15;

            const diff = (this._targetScale - this.scale.x) * 0.2;
            this.scale.x += diff;
            this.scale.y += diff;
        }

        isHovered() {
            const x = TouchInput.x;
            const y = TouchInput.y;

            const left = this.x;
            const right = this.x + this.bitmap.width;
            const top = this.y - this.bitmap.height / 2;
            const bottom = this.y + this.bitmap.height / 2;

            return x >= left && x <= right && y >= top && y <= bottom;
        }

        get symbol() {
            return this._symbol;
        }

    }

    // ==============================
    // SCENE TITLE OVERRIDE
    // ==============================

    Scene_Title.prototype.create = function () {
        Scene_Base.prototype.create.call(this);

        this.removeChildren();

        this.createBackground();
        this.createCommandWindow();
        this.createTitle();
        this.createCommands();

        this._index = 0;
        this.updateSelection();


    };

    // ===== BACKGROUND =====
    Scene_Title.prototype.createBackground = function () {
        this._bg = new Sprite(ImageManager.loadTitle1(bgImage));
        this._bg.opacity = 0;
        this.addChild(this._bg);
    };

    // ===== DUMMY WINDOW (ANTI CRASH) =====
    Scene_Title.prototype.createCommandWindow = function () {
        this._commandWindow = {
            isClosing: () => false,
            close: () => { },
            open: () => { },
            activate: () => { },
            deactivate: () => { }
        };
    };

    // ===== COMMANDS =====
    Scene_Title.prototype.createCommands = function () {
        this._commands = [];


        const list = [
            { name: "New Game", symbol: "newGame", enabled: true },
            { name: "Continue", symbol: "continue", enabled: DataManager.isAnySavefileExists() },
            { name: "Options", symbol: "options", enabled: true }
        ];

        let y = menuY;

        for (const cmd of list) {
            const s = new Sprite_Command(cmd.name, cmd.symbol, menuX, y);

            if (!cmd.enabled) {
                s.opacity = 80;
            }

            this.addChild(s);
            this._commands.push({ sprite: s, enabled: cmd.enabled });

            y += spacing;
        }


    };

    // ===== START =====
    Scene_Title.prototype.start = function () {
        Scene_Base.prototype.start.call(this);
        SceneManager.clearStack();
        this.playTitleMusic();
        this.startFadeIn(this.fadeSpeed(), false);
    };

    // ===== UPDATE =====
    Scene_Title.prototype.update = function () {
        Scene_Base.prototype.update.call(this);


        // background fade
        if (this._bg.opacity < 255) {
            this._bg.opacity += 3;
        }

        for (const cmd of this._commands) {
            cmd.sprite.update();
        }

        if (!this.isBusy()) {
            this.updateInput();
            this.updateMouse();
        }


    };

    // ===== INPUT =====
    Scene_Title.prototype.updateInput = function () {


        if (Input.isRepeated("down")) {
            SoundManager.playCursor();
            this._index = (this._index + 1) % this._commands.length;
            this.updateSelection();
        }

        if (Input.isRepeated("up")) {
            SoundManager.playCursor();
            this._index = (this._index - 1 + this._commands.length) % this._commands.length;
            this.updateSelection();
        }

        if (Input.isTriggered("ok")) {
            this.execute();
        }


    };

    // ===== MOUSE =====
    Scene_Title.prototype.updateMouse = function () {
        for (let i = 0; i < this._commands.length; i++) {
            const cmd = this._commands[i];


            if (cmd.sprite.isHovered()) {
                if (this._index !== i) {
                    SoundManager.playCursor();
                    this._index = i;
                    this.updateSelection();
                }

                if (TouchInput.isTriggered()) {
                    this.execute();
                }
            }
        }

    };

    // ===== SELECTION =====
    Scene_Title.prototype.updateSelection = function () {
        for (let i = 0; i < this._commands.length; i++) {
            this._commands[i].sprite.setSelected(i === this._index);
        }
    };

    // ===== EXECUTE =====
    Scene_Title.prototype.execute = function () {
        const cmd = this._commands[this._index];


        if (!cmd.enabled) {
            SoundManager.playBuzzer();
            return;
        }

        SoundManager.playOk();

        switch (cmd.sprite.symbol) {
            case "newGame":
                DataManager.setupNewGame();
                this.fadeOutAll();
                SceneManager.goto(Scene_Map);
                break;

            case "continue":
                SceneManager.push(Scene_Load);
                break;

            case "options":
                SceneManager.push(Scene_ReverieTitleOptions);
                break;
        }

    };

    Scene_Title.prototype.createTitle = function () {
        this._title = new Sprite(new Bitmap(800, 120));

        this._title.bitmap.fontFace = "ReverieFont";
        this._title.bitmap.textColor = "#000000"; 
        this._title.bitmap.fontSize = 100;
        // this._title.bitmap.outlineWidth = 6;
        // this._title.bitmap.outlineColor = "rgba(0,0,0,0.5)";

        this._title.bitmap.drawText("Reverie", 0, 0, 800, 120, "left");

        this._title.x = 50;
        this._title.y = 100;

        this.addChild(this._title);
    };

})();
