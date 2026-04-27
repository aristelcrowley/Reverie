/*:
 * @target MZ
 * @plugindesc Debug warp antar map per chapter lewat F10 untuk RPG Maker MZ.
 * @author Aristel & Safmica
 *
 * @help
 * Plugin debug untuk mempermudah pindah map saat testing.
 *
 * Cara pakai:
 * 1. Aktifkan plugin ini di Plugin Manager.
 * 2. Isi daftar map untuk Chapter 0 sampai Chapter 5.
 * 3. Jalankan game, lalu tekan F10 di map.
 * 4. Pilih chapter, lalu pilih map tujuan.
 *
 * Catatan:
 * - Secara default plugin ini hanya aktif saat playtest.
 * - Nama map di menu akan memakai nama dari parameter. Jika kosong,
 *   plugin akan mencoba memakai nama map dari database.
 * - Transfer dilakukan memakai Reserve Transfer bawaan engine.
 *
 * @command OpenDebugMapMenu
 * @text Buka Debug Map Menu
 * @desc Membuka menu debug warp chapter secara manual.
 *
 * @param playtestOnly
 * @text Hanya Saat Playtest
 * @type boolean
 * @on Ya
 * @off Tidak
 * @default true
 * @desc Jika aktif, F10 dan plugin command hanya bekerja saat playtest.
 *
 * @param chapter0Name
 * @text Nama Chapter 0
 * @type string
 * @default CH 0
 *
 * @param chapter0Maps
 * @text Map Chapter 0
 * @type struct<DebugMapEntry>[]
 * @default []
 *
 * @param chapter1Name
 * @text Nama Chapter 1
 * @type string
 * @default CH 1
 *
 * @param chapter1Maps
 * @text Map Chapter 1
 * @type struct<DebugMapEntry>[]
 * @default []
 *
 * @param chapter2Name
 * @text Nama Chapter 2
 * @type string
 * @default CH 2
 *
 * @param chapter2Maps
 * @text Map Chapter 2
 * @type struct<DebugMapEntry>[]
 * @default []
 *
 * @param chapter3Name
 * @text Nama Chapter 3
 * @type string
 * @default CH 3
 *
 * @param chapter3Maps
 * @text Map Chapter 3
 * @type struct<DebugMapEntry>[]
 * @default []
 *
 * @param chapter4Name
 * @text Nama Chapter 4
 * @type string
 * @default CH 4
 *
 * @param chapter4Maps
 * @text Map Chapter 4
 * @type struct<DebugMapEntry>[]
 * @default []
 *
 * @param chapter5Name
 * @text Nama Chapter 5
 * @type string
 * @default CH 5
 *
 * @param chapter5Maps
 * @text Map Chapter 5
 * @type struct<DebugMapEntry>[]
 * @default []
 */

/*~struct~DebugMapEntry:
 * @param name
 * @text Nama Map di Menu
 * @type string
 * @default
 * @desc Kosongkan untuk memakai nama map dari database.
 *
 * @param mapId
 * @text Map ID
 * @type number
 * @min 1
 * @default 1
 *
 * @param x
 * @text Transfer X
 * @type number
 * @min 0
 * @default 0
 *
 * @param y
 * @text Transfer Y
 * @type number
 * @min 0
 * @default 0
 *
 * @param direction
 * @text Arah Hadap
 * @type select
 * @option Tetap
 * @value 0
 * @option Bawah
 * @value 2
 * @option Kiri
 * @value 4
 * @option Kanan
 * @value 6
 * @option Atas
 * @value 8
 * @default 0
 *
 * @param fadeType
 * @text Fade
 * @type select
 * @option Hitam
 * @value 0
 * @option Putih
 * @value 1
 * @option Tanpa Fade
 * @value 2
 * @default 0
 */

(() => {
    "use strict";

    const script = document.currentScript;
    const pluginName = script
        ? script.src.split("/").pop().replace(/\.js$/, "")
        : "Reverie_DebugChapterWarp";
    const parameters = PluginManager.parameters(pluginName);
    const chapterCount = 6;
    const debugInputSymbol = "reverieDebugChapterWarp";
    const debugKeyCode = 121; // F10
    const emptyMapLabel = "- Belum ada map -";

    const playtestOnly = parameters.playtestOnly !== "false";
    const previousF10Symbol = Input.keyMapper[debugKeyCode];
    if (previousF10Symbol && previousF10Symbol !== debugInputSymbol) {
        console.warn(
            `[${pluginName}] F10 sebelumnya memakai simbol '${previousF10Symbol}' dan sekarang dioverride.`
        );
    }
    Input.keyMapper[debugKeyCode] = debugInputSymbol;

    function parseStructArray(rawValue) {
        if (!rawValue) {
            return [];
        }
        try {
            const list = JSON.parse(rawValue);
            return Array.isArray(list)
                ? list.map(item => JSON.parse(item || "{}"))
                : [];
        } catch (error) {
            console.error(`[${pluginName}] Gagal membaca parameter array.`, error);
            return [];
        }
    }

    function toNumber(value, defaultValue) {
        const numberValue = Number(value);
        return Number.isFinite(numberValue) ? numberValue : defaultValue;
    }

    function chapterLabel(index) {
        return String(parameters[`chapter${index}Name`] || `CH ${index}`).trim() || `CH ${index}`;
    }

    function mapDatabaseName(mapId) {
        if ($dataMapInfos && $dataMapInfos[mapId]) {
            return String($dataMapInfos[mapId].name || "").trim();
        }
        return "";
    }

    function mapDisplayName(entry) {
        return entry.name || mapDatabaseName(entry.mapId) || `Map ${entry.mapId}`;
    }

    function chapterMaps(index) {
        const rawMaps = parseStructArray(parameters[`chapter${index}Maps`]);
        return rawMaps.map((entry, mapIndex) => {
            const mapId = toNumber(entry.mapId, 0);
            return {
                id: mapIndex,
                name: String(entry.name || "").trim(),
                mapId: mapId,
                x: Math.max(0, toNumber(entry.x, 0)),
                y: Math.max(0, toNumber(entry.y, 0)),
                direction: toNumber(entry.direction, 0),
                fadeType: toNumber(entry.fadeType, 0)
            };
        });
    }

    function buildChapters() {
        const chapters = [];
        for (let index = 0; index < chapterCount; index++) {
            chapters.push({
                id: index,
                name: chapterLabel(index),
                maps: chapterMaps(index)
            });
        }
        return chapters;
    }

    function currentChapters() {
        return buildChapters();
    }

    function isPlaytest() {
        return !!($gameTemp && $gameTemp.isPlaytest && $gameTemp.isPlaytest());
    }

    function isDebugMenuEnabled() {
        return !playtestOnly || isPlaytest();
    }

    function isMapEntryValid(entry) {
        return !!(entry && entry.mapId > 0 && $dataMapInfos && $dataMapInfos[entry.mapId]);
    }

    function directionLabel(direction) {
        switch (direction) {
            case 2:
                return "Bawah";
            case 4:
                return "Kiri";
            case 6:
                return "Kanan";
            case 8:
                return "Atas";
            default:
                return "Tetap";
        }
    }

    function fadeLabel(fadeType) {
        switch (fadeType) {
            case 1:
                return "Putih";
            case 2:
                return "Tanpa";
            default:
                return "Hitam";
        }
    }

    function canOpenDebugMenuFromMap(scene) {
        return (
            isDebugMenuEnabled() &&
            scene instanceof Scene_Map &&
            scene.isActive() &&
            !scene.isBusy() &&
            !SceneManager.isSceneChanging() &&
            !$gameMap.isEventRunning() &&
            !$gameMessage.isBusy() &&
            !$gamePlayer.isTransferring()
        );
    }

    function canOpenDebugMenuFromCurrentScene() {
        const scene = SceneManager._scene;
        if (!isDebugMenuEnabled() || !scene || SceneManager.isSceneChanging()) {
            return false;
        }
        return !(scene instanceof Scene_Title || scene instanceof Scene_Battle);
    }

    function openDebugMenuScene() {
        SceneManager.push(Scene_DebugChapterWarp);
    }

    PluginManager.registerCommand(pluginName, "OpenDebugMapMenu", () => {
        if (canOpenDebugMenuFromCurrentScene()) {
            openDebugMenuScene();
        }
    });

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (Input.isTriggered(debugInputSymbol) && canOpenDebugMenuFromMap(this)) {
            SoundManager.playOk();
            openDebugMenuScene();
        }
    };

    function Scene_DebugChapterWarp() {
        this.initialize(...arguments);
    }

    Scene_DebugChapterWarp.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugChapterWarp.prototype.constructor = Scene_DebugChapterWarp;

    Scene_DebugChapterWarp.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._chapters = currentChapters();
        this.createHelpWindow();
        this.createChapterWindow();
        this.createMapWindow();
    };

    Scene_DebugChapterWarp.prototype.isBottomHelpMode = function() {
        return false;
    };

    Scene_DebugChapterWarp.prototype.buttonAreaHeight = function() {
        return ConfigManager.touchUI
            ? Scene_Base.prototype.buttonAreaHeight.call(this)
            : 0;
    };

    Scene_DebugChapterWarp.prototype.createChapterWindow = function() {
        const rect = this.chapterWindowRect();
        this._chapterWindow = new Window_DebugChapterList(rect, this._chapters);
        this._chapterWindow.setHelpWindow(this._helpWindow);
        this._chapterWindow.setHandler("ok", this.onChapterOk.bind(this));
        this._chapterWindow.setHandler("cancel", this.popScene.bind(this));
        this.addWindow(this._chapterWindow);
    };

    Scene_DebugChapterWarp.prototype.createMapWindow = function() {
        const rect = this.mapWindowRect();
        this._mapWindow = new Window_DebugMapList(rect, this._chapters);
        this._mapWindow.setHelpWindow(this._helpWindow);
        this._mapWindow.setHandler("ok", this.onMapOk.bind(this));
        this._mapWindow.setHandler("cancel", this.onMapCancel.bind(this));
        this._mapWindow.deactivate();
        this._mapWindow.setChapterIndex(0);
        this._chapterWindow.setMapWindow(this._mapWindow);
        this.addWindow(this._mapWindow);
        this._chapterWindow.callUpdateHelp();
    };

    Scene_DebugChapterWarp.prototype.chapterWindowRect = function() {
        const wx = 0;
        const wy = this.mainAreaTop();
        const ww = Math.min(280, Math.floor(Graphics.boxWidth * 0.32));
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_DebugChapterWarp.prototype.mapWindowRect = function() {
        const chapterRect = this.chapterWindowRect();
        const gap = 12;
        const wx = chapterRect.x + chapterRect.width + gap;
        const wy = this.mainAreaTop();
        const ww = Graphics.boxWidth - wx;
        const wh = this.mainAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    Scene_DebugChapterWarp.prototype.onChapterOk = function() {
        this._chapterWindow.deactivate();
        this._mapWindow.activate();
        if (this._mapWindow.maxItems() > 0) {
            this._mapWindow.select(0);
        }
    };

    Scene_DebugChapterWarp.prototype.onMapCancel = function() {
        this._mapWindow.deactivate();
        this._chapterWindow.activate();
        this._chapterWindow.callUpdateHelp();
    };

    Scene_DebugChapterWarp.prototype.onMapOk = function() {
        const entry = this._mapWindow.currentEntry();
        if (!isMapEntryValid(entry)) {
            SoundManager.playBuzzer();
            this._mapWindow.activate();
            return;
        }
        $gamePlayer.reserveTransfer(
            entry.mapId,
            entry.x,
            entry.y,
            entry.direction,
            entry.fadeType
        );
        SceneManager.goto(Scene_Map);
    };

    function Window_DebugChapterList() {
        this.initialize(...arguments);
    }

    Window_DebugChapterList.prototype = Object.create(Window_Command.prototype);
    Window_DebugChapterList.prototype.constructor = Window_DebugChapterList;

    Window_DebugChapterList.prototype.initialize = function(rect, chapters) {
        this._chapters = chapters || [];
        this._mapWindow = null;
        Window_Command.prototype.initialize.call(this, rect);
    };

    Window_DebugChapterList.prototype.makeCommandList = function() {
        for (const chapter of this._chapters) {
            const label = `${chapter.name} (${chapter.maps.length})`;
            this.addCommand(label, "ok", true, chapter.id);
        }
    };

    Window_DebugChapterList.prototype.itemTextAlign = function() {
        return "left";
    };

    Window_DebugChapterList.prototype.setMapWindow = function(mapWindow) {
        this._mapWindow = mapWindow;
        this.updateLinkedMapWindow();
    };

    Window_DebugChapterList.prototype.select = function(index) {
        Window_Command.prototype.select.call(this, index);
        this.updateLinkedMapWindow();
    };

    Window_DebugChapterList.prototype.updateLinkedMapWindow = function() {
        if (this._mapWindow) {
            this._mapWindow.setChapterIndex(this.currentExt() || 0);
        }
    };

    Window_DebugChapterList.prototype.updateHelp = function() {
        const chapter = this.currentChapter();
        if (!chapter) {
            this._helpWindow.setText("Pilih chapter untuk membuka daftar map debug.");
            return;
        }
        const count = chapter.maps.length;
        const mapLabel = count === 1 ? "map" : "map";
        this._helpWindow.setText(
            `${chapter.name}\nPilih chapter ini untuk melihat ${count} ${mapLabel} debug yang sudah diatur.`
        );
    };

    Window_DebugChapterList.prototype.currentChapter = function() {
        const index = this.currentExt();
        return this._chapters.find(chapter => chapter.id === index) || null;
    };

    function Window_DebugMapList() {
        this.initialize(...arguments);
    }

    Window_DebugMapList.prototype = Object.create(Window_Command.prototype);
    Window_DebugMapList.prototype.constructor = Window_DebugMapList;

    Window_DebugMapList.prototype.initialize = function(rect, chapters) {
        this._chapters = chapters || [];
        this._chapterIndex = 0;
        Window_Command.prototype.initialize.call(this, rect);
    };

    Window_DebugMapList.prototype.makeCommandList = function() {
        const maps = this.chapterMaps();
        if (maps.length <= 0) {
            this.addCommand(emptyMapLabel, "ok", false, null);
            return;
        }
        for (const entry of maps) {
            this.addCommand(mapDisplayName(entry), "ok", isMapEntryValid(entry), entry);
        }
    };

    Window_DebugMapList.prototype.itemTextAlign = function() {
        return "left";
    };

    Window_DebugMapList.prototype.setChapterIndex = function(index) {
        const nextIndex = Number.isFinite(index) ? index : 0;
        if (this._chapterIndex !== nextIndex) {
            this._chapterIndex = nextIndex;
            this.refresh();
            this.select(0);
        } else if (this.maxItems() <= 0) {
            this.refresh();
            this.select(0);
        }
    };

    Window_DebugMapList.prototype.chapterMaps = function() {
        const chapter = this._chapters.find(entry => entry.id === this._chapterIndex);
        return chapter ? chapter.maps : [];
    };

    Window_DebugMapList.prototype.currentEntry = function() {
        return this.currentExt();
    };

    Window_DebugMapList.prototype.updateHelp = function() {
        const chapter = this._chapters.find(entry => entry.id === this._chapterIndex);
        const currentEntry = this.currentEntry();
        if (!chapter) {
            this._helpWindow.setText("Chapter tidak ditemukan.");
            return;
        }
        if (!currentEntry) {
            this._helpWindow.setText(
                `${chapter.name}\nChapter ini belum punya map debug.`
            );
            return;
        }
        if (!isMapEntryValid(currentEntry)) {
            this._helpWindow.setText(
                `${chapter.name} > ${mapDisplayName(currentEntry)}\nMap ID ${currentEntry.mapId} belum valid atau belum ada di database.`
            );
            return;
        }
        this._helpWindow.setText(
            `${chapter.name} > ${mapDisplayName(currentEntry)}\nMap ID ${currentEntry.mapId} | X:${currentEntry.x} Y:${currentEntry.y} | Arah: ${directionLabel(currentEntry.direction)} | Fade: ${fadeLabel(currentEntry.fadeType)}`
        );
    };
})();
