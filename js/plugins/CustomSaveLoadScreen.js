/*:
 * @target MZ
 * @plugindesc Reverie - custom save/load skeleton for HUD Maker Ultra.
 * @author Aristel
 *
 * @command openCamp
 * @text Open Camp Save/Load
 * @desc Opens the custom save/load screen with Save unlocked.
 *
 * @command openLoad
 * @text Open Load
 * @desc Opens the custom save/load screen with Save locked.
 *
 * @help CustomSaveLoadScreen.js
 *
 * This plugin only provides the save/load skeleton and input behavior.
 * Built the visible UI in SRD HUD Maker Ultra with Map HUD components.
 *
 * Save file IDs:
 *   0 = Manual autosave slot
 *   1-8 = Manual save files
 */

(() => {
    "use strict";

    const DEBUG_MODE = false;
    
    const AUTOSAVE_FILE_ID = 0;
    const SAVE_FILE_COUNT = 8;
    const FIRST_SAVEFILE_ID = 1;
    const MAX_SAVEFILE_ID_EXCLUSIVE = SAVE_FILE_COUNT + 1;
    const TOTAL_SAVE_LOAD_ROWS = SAVE_FILE_COUNT + 1;
    const VISIBLE_FILE_ROWS = 3;
    const CURSOR_IMAGE_NAME = "FingerCursor";
    const CURSOR_NATIVE_SIZE = 14;
    const CURSOR_DRAW_SIZE = 24;

    const SAVE_LOAD_TOP_Y = 48;
    const SAVE_LOAD_MODE_X = 40;
    const SAVE_LOAD_MODE_WIDTH = 180;
    const SAVE_LOAD_FILE_X = 226;
    const SAVE_LOAD_FILE_RIGHT_MARGIN = 40;
    const SAVE_LOAD_FILE_WIDTH_BONUS = 0;
    const SAVE_LOAD_FILE_BOTTOM_MARGIN = 24;
    const SAVE_LOAD_FILE_ITEM_HEIGHT_BONUS = 5;
    const SAVE_LOAD_FILE_ITEM_Y_OFFSET = -66;

    const SAVE_LOAD_BACKGROUND_PICTURE = "save";

    const CONFIRM_WINDOW_WIDTH = 300;
    const CONFIRM_WINDOW_Y_OFFSET = 41;
    const CONFIRM_COMMAND_Y_OFFSET = 0;

    const EMPTY_IMAGE =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    const FACE_IMAGE_CACHE = {};
    const FACE_IMAGE_LOADING = {};

    const originalSavefileInfo = DataManager.savefileInfo;
    const originalMakeSavefileInfo = DataManager.makeSavefileInfo;

    const isAutosaveFileId = function(savefileId) {
        return Number(savefileId) === AUTOSAVE_FILE_ID;
    };

    const isManualSavefileId = function(savefileId) {
        return savefileId >= FIRST_SAVEFILE_ID && savefileId < MAX_SAVEFILE_ID_EXCLUSIVE;
    };

    const managedSavefileIds = function() {
        const ids = [AUTOSAVE_FILE_ID];
        for (let i = FIRST_SAVEFILE_ID; i < MAX_SAVEFILE_ID_EXCLUSIVE; i++) {
            ids.push(i);
        }
        return ids;
    };

    const manualSavefileIds = function() {
        const ids = [];
        for (let i = FIRST_SAVEFILE_ID; i < MAX_SAVEFILE_ID_EXCLUSIVE; i++) {
            ids.push(i);
        }
        return ids;
    };

    const isManagedSavefileId = function(savefileId) {
        return isAutosaveFileId(savefileId) || isManualSavefileId(savefileId);
    };

    const savefileIdFromIndex = function(index) {
        return Number(index);
    };

    DataManager.maxSavefiles = function() {
        return MAX_SAVEFILE_ID_EXCLUSIVE;
    };

    DataManager.savefileInfo = function(savefileId) {
        if (!isManagedSavefileId(savefileId)) return null;
        return originalSavefileInfo.call(this, savefileId);
    };

    DataManager.isAnySavefileExists = function() {
        return managedSavefileIds().some(id => !!this.savefileInfo(id));
    };

    DataManager.latestSavefileId = function() {
        const ids = managedSavefileIds();
        let latestId = 0;
        let latestTimestamp = -Infinity;
        for (const id of ids) {
            const info = this.savefileInfo(id);
            if (info && info.timestamp > latestTimestamp) {
                latestTimestamp = info.timestamp;
                latestId = id;
            }
        }
        return latestId;
    };

    DataManager.earliestSavefileId = function() {
        const ids = managedSavefileIds();
        let earliestId = FIRST_SAVEFILE_ID;
        let earliestTimestamp = Infinity;
        for (const id of ids) {
            const info = this.savefileInfo(id);
            if (info && info.timestamp < earliestTimestamp) {
                earliestTimestamp = info.timestamp;
                earliestId = id;
            }
        }
        return earliestId;
    };

    DataManager.emptySavefileId = function() {
        for (const id of manualSavefileIds()) {
            if (!this.savefileInfo(id)) return id;
        }
        return -1;
    };

    const cleanMapName = function(name) {
        return String(name || "").replace(/_/g, " ").trim();
    };

    const mapInfo = function(mapId) {
        return $dataMapInfos && $dataMapInfos[mapId] ? $dataMapInfos[mapId] : null;
    };

    const topLevelMapInfo = function(mapId) {
        let current = mapInfo(mapId);
        let guard = 0;
        while (current && current.parentId > 0 && guard < 20) {
            const parent = mapInfo(current.parentId);
            if (!parent) break;
            current = parent;
            guard++;
        }
        return current || mapInfo(mapId);
    };

    DataManager.makeSavefileInfo = function() {
        const info = originalMakeSavefileInfo.call(this);
        const leader = $gameParty.leader();
        const currentMapInfo = mapInfo($gameMap.mapId());
        const chapterMapInfo = topLevelMapInfo($gameMap.mapId());

        info.reverieLeaderName = leader ? leader.name() : "";
        info.reverieLeaderFaceName = leader ? leader.faceName() : "";
        info.reverieLeaderFaceIndex = leader ? leader.faceIndex() : 0;
        info.faces = leader ? [[leader.faceName(), leader.faceIndex()]] : [];
        info.characters = leader ? [[leader.characterName(), leader.characterIndex()]] : [];
        info.reverieMainMapName = cleanMapName(chapterMapInfo ? chapterMapInfo.name : info.title);
        info.reverieLocationName = cleanMapName(currentMapInfo ? currentMapInfo.name : "");
        return info;
    };

    const savefileName = function(savefileId) {
        if (isAutosaveFileId(savefileId)) return "AUTOSAVE";
        return "FILE " + savefileId;
    };

    const savefileMainMapName = function(info) {
        return info ? (info.reverieMainMapName || info.title || "") : "";
    };

    const savefileActorName = function(info) {
        return info ? (info.reverieLeaderName || "") : "";
    };

    const savefilePlaytime = function(info) {
        return info ? (info.playtime || "") : "";
    };

    const savefileLocation = function(info) {
        return info ? (info.reverieLocationName || "") : "";
    };

    const savefileFaceName = function(info) {
        if (info && info.reverieLeaderFaceName) return info.reverieLeaderFaceName;
        if (info && info.faces && info.faces[0]) return info.faces[0][0] || "";
        return "";
    };

    const savefileFaceIndex = function(info) {
        if (info && Number.isFinite(Number(info.reverieLeaderFaceIndex))) {
            return Number(info.reverieLeaderFaceIndex);
        }
        if (info && info.faces && info.faces[0]) return Number(info.faces[0][1] || 0);
        return 0;
    };

    const croppedFaceImage = function(faceName, faceIndex) {
        const index = Math.max(0, Number(faceIndex || 0));
        const cacheKey = faceName + ":" + index;
        if (FACE_IMAGE_CACHE[cacheKey]) return FACE_IMAGE_CACHE[cacheKey];

        const source = ImageManager.loadFace(faceName);
        if (!source.isReady()) {
            if (!FACE_IMAGE_LOADING[cacheKey]) {
                FACE_IMAGE_LOADING[cacheKey] = true;
                source.addLoadListener(() => {
                    delete FACE_IMAGE_LOADING[cacheKey];
                    croppedFaceImage(faceName, index);
                    requestSaveLoadHudRefresh();
                });
            }
            return EMPTY_IMAGE;
        }

        const faceWidth = ImageManager.faceWidth;
        const faceHeight = ImageManager.faceHeight;
        const columns = Math.max(1, Math.floor(source.width / faceWidth));
        const sx = (index % columns) * faceWidth;
        const sy = Math.floor(index / columns) * faceHeight;
        const target = new Bitmap(faceWidth, faceHeight);
        target.blt(source, sx, sy, faceWidth, faceHeight, 0, 0, faceWidth, faceHeight);
        try {
            FACE_IMAGE_CACHE[cacheKey] = target.canvas.toDataURL("image/png");
        } catch (e) {
            FACE_IMAGE_CACHE[cacheKey] = EMPTY_IMAGE;
        }
        return FACE_IMAGE_CACHE[cacheKey];
    };

    const savefileFaceImage = function(info) {
        const faceName = savefileFaceName(info);
        return faceName ? croppedFaceImage(faceName, savefileFaceIndex(info)) : EMPTY_IMAGE;
    };

    const setBaseVisibility = function(window) {
        window._closingDelay = 0;
        if (DEBUG_MODE) {
            window.opacity = 150;
            window.frameVisible = true;
        } else {
            window.opacity = 0;
            window.frameVisible = false;
            window.backOpacity = 0;
        }
    };

    const hideWindowScrollIndicators = function(window) {
        window.upArrowVisible = false;
        window.downArrowVisible = false;

        const spriteNames = [
            "_upArrowSprite",
            "_downArrowSprite",
            "_leftArrowSprite",
            "_rightArrowSprite",
            "_scrollBaseSprite",
            "_scrollBarSprite",
            "_scrollThumbSprite",
            "_scrollCursorSprite",
            "_scrollFrameSprite",
            "_scrollTrackSprite"
        ];

        for (const name of spriteNames) {
            if (window[name]) window[name].visible = false;
        }

        for (const key of Object.keys(window)) {
            if (/scroll/i.test(key) && /sprite/i.test(key)) {
                const sprite = window[key];
                if (sprite && typeof sprite === "object" && "visible" in sprite) {
                    sprite.visible = false;
                }
            }
        }

        if (window.contentsBack) {
            window.contentsBack.clear();
        }
    };

    const applySkeletonStyle = function(windowClass) {
        const _initialize = windowClass.prototype.initialize;
        windowClass.prototype.initialize = function(rect) {
            _initialize.call(this, rect);
            setBaseVisibility(this);
            hideWindowScrollIndicators(this);
        };

        windowClass.prototype.drawItemBackground = function() {};
        windowClass.prototype._refreshCursor = function() {
            if (this._cursorSprite) this._cursorSprite.visible = false;
        };
        windowClass.prototype.updateArrows = function() {
            this.upArrowVisible = false;
            this.downArrowVisible = false;
        };
        windowClass.prototype.drawScrollBar = function() {};
        windowClass.prototype.refreshScrollBar = function() {};
        windowClass.prototype.updateScrollBar = function() {};
        windowClass.prototype.isScrollBarVisible = function() {
            return false;
        };
        windowClass.prototype.isScrollBarEnabled = function() {
            return false;
        };
        windowClass.prototype.processTouch = function() {};
        windowClass.prototype.processTouchScroll = function() {};
        windowClass.prototype.processWheelScroll = function() {};

        const _update = windowClass.prototype.update;
        windowClass.prototype.update = function() {
            if (_update) _update.call(this);
            hideWindowScrollIndicators(this);
        };

        const _activate = windowClass.prototype.activate;
        windowClass.prototype.activate = function() {
            _activate.call(this);
            this.refresh();
        };

        const _deactivate = windowClass.prototype.deactivate;
        windowClass.prototype.deactivate = function() {
            _deactivate.call(this);
            this.refresh();
        };
    };

    const drawFingerCursor = function(window, x, y, enabled = true) {
        const bitmap = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
        if (bitmap.isReady()) {
            const lastOpacity = window.contents.paintOpacity;
            window.changePaintOpacity(enabled);
            window.contents.blt(bitmap, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, x, y, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
            window.contents.paintOpacity = lastOpacity;
        } else {
            bitmap.addLoadListener(() => window.refresh());
        }
    };

    const requestSaveLoadHudRefresh = function() {
        const scene = SceneManager._scene;
        if (scene && scene.refreshSaveLoadHudNow) {
            scene.refreshSaveLoadHudNow();
        }
    };

    const selectWithCursorRedraw = function(index) {
        const lastIndex = this.index();
        Window_Selectable.prototype.select.call(this, index);
        if (this.index() !== lastIndex) {
            if (lastIndex >= 0) this.redrawItem(lastIndex);
            if (this.index() >= 0) this.redrawItem(this.index());
        } else if (this.index() >= 0) {
            this.redrawItem(this.index());
        }
    };

    function Window_ReverieSaveLoadMode() {
        this.initialize(...arguments);
    }

    Window_ReverieSaveLoadMode.prototype = Object.create(Window_Command.prototype);
    Window_ReverieSaveLoadMode.prototype.constructor = Window_ReverieSaveLoadMode;

    Window_ReverieSaveLoadMode.prototype.initialize = function(rect) {
        this._canSave = false;
        Window_Command.prototype.initialize.call(this, rect);
    };

    Window_ReverieSaveLoadMode.prototype.setCanSave = function(canSave) {
        if (this._canSave !== canSave) {
            this._canSave = canSave;
            this.refresh();
        }
    };

    Window_ReverieSaveLoadMode.prototype.makeCommandList = function() {
        this.addCommand("SAVE", "save", this._canSave);
        this.addCommand("LOAD", "load", true);
    };

    Window_ReverieSaveLoadMode.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        this.contents.clearRect(rect.x - 40, rect.y, rect.width + 80, rect.height);
        if (DEBUG_MODE) {
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(this.commandName(index), rect.x + CURSOR_DRAW_SIZE + 8, rect.y, rect.width, "left");
            this.changePaintOpacity(true);
        }
        if ((this.active || this._keepCursorVisible) && this.index() === index) {
            drawFingerCursor(this, rect.x, rect.y + Math.floor((rect.height - CURSOR_DRAW_SIZE) / 2) + 4, this.isCommandEnabled(index));
        }
    };

    Window_ReverieSaveLoadMode.prototype.select = function(index) {
        selectWithCursorRedraw.call(this, index);
        requestSaveLoadHudRefresh();
    };

    Window_ReverieSaveLoadMode.prototype.smoothSelect = function(index) {
        this.select(index);
        this.ensureCursorVisible(false);
        requestSaveLoadHudRefresh();
    };

    Window_ReverieSaveLoadMode.prototype.processTouch = function() {};
    applySkeletonStyle(Window_ReverieSaveLoadMode);

    function Window_ReverieSaveLoadList() {
        this.initialize(...arguments);
    }

    Window_ReverieSaveLoadList.prototype = Object.create(Window_Selectable.prototype);
    Window_ReverieSaveLoadList.prototype.constructor = Window_ReverieSaveLoadList;

    Window_ReverieSaveLoadList.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this._mode = "load";
        this._canSave = false;
    };

    Window_ReverieSaveLoadList.prototype.setMode = function(mode, canSave) {
        this._mode = mode;
        this._canSave = canSave;
        this.refresh();
    };

    Window_ReverieSaveLoadList.prototype.maxItems = function() {
        return TOTAL_SAVE_LOAD_ROWS;
    };

    Window_ReverieSaveLoadList.prototype.maxCols = function() {
        return 1;
    };

    Window_ReverieSaveLoadList.prototype.numVisibleRows = function() {
        return VISIBLE_FILE_ROWS;
    };

    Window_ReverieSaveLoadList.prototype.itemHeight = function() {
        return Math.floor(this.innerHeight / VISIBLE_FILE_ROWS) + SAVE_LOAD_FILE_ITEM_HEIGHT_BONUS;
    };

    Window_ReverieSaveLoadList.prototype.maxPageRows = function() {
        return VISIBLE_FILE_ROWS;
    };

    Window_ReverieSaveLoadList.prototype.savefileId = function() {
        if (this.index() < 0) return -1;
        return savefileIdFromIndex(this.index());
    };

    Window_ReverieSaveLoadList.prototype.isCurrentItemEnabled = function() {
        return this.isEnabled(this.savefileId());
    };

    Window_ReverieSaveLoadList.prototype.isEnabled = function(savefileId) {
        if (this._mode === "save") {
            return this._canSave && isManualSavefileId(savefileId);
        } else {
            return !!DataManager.savefileInfo(savefileId);
        }
    };

    Window_ReverieSaveLoadList.prototype.selectionTopRow = function(index) {
        if (index < 0) return this.topRow();
        return Math.max(0, index - VISIBLE_FILE_ROWS + 1).clamp(0, this.maxTopRow());
    };

    Window_ReverieSaveLoadList.prototype.snapScrollToSelection = function() {
        if (this.index() < 0) return;
        this.setTopRow(this.selectionTopRow(this.index()));
        this._scrollDuration = 0;
        this._scrollTargetY = this.scrollY();
    };

    Window_ReverieSaveLoadList.prototype.ensureCursorVisible = function() {
        this.snapScrollToSelection();
    };

    Window_ReverieSaveLoadList.prototype.select = function(index) {
        Window_Selectable.prototype.select.call(this, index);
        this.snapScrollToSelection();
        this.refresh();
        requestSaveLoadHudRefresh();
    };

    Window_ReverieSaveLoadList.prototype.smoothSelect = function(index) {
        this.select(index);
    };

    Window_ReverieSaveLoadList.prototype.drawItem = function(index) {
        const savefileId = savefileIdFromIndex(index);
        const info = DataManager.savefileInfo(savefileId);
        const rect = this.itemLineRect(index);
        const clearY = Math.min(rect.y, rect.y + SAVE_LOAD_FILE_ITEM_Y_OFFSET) - 8;
        const clearH = rect.height + Math.abs(SAVE_LOAD_FILE_ITEM_Y_OFFSET) + 16;
        this.contents.clearRect(rect.x - 40, clearY, rect.width + 80, clearH);
        rect.y += SAVE_LOAD_FILE_ITEM_Y_OFFSET;
        if (DEBUG_MODE) {
            const title = info ? savefileName(savefileId) + ": " + savefileMainMapName(info) : savefileName(savefileId);
            this.changePaintOpacity(this.isEnabled(savefileId));
            this.drawText(title, rect.x + CURSOR_DRAW_SIZE + 8, rect.y, rect.width, "left");
            this.changePaintOpacity(true);
        }
        if (this.active && this.index() === index) {
            drawFingerCursor(this, rect.x, rect.y + 4, this.isEnabled(savefileId));
        }
    };

    Window_ReverieSaveLoadList.prototype.processTouch = function() {};
    Window_ReverieSaveLoadList.prototype.playOkSound = function() {};
    applySkeletonStyle(Window_ReverieSaveLoadList);

    function Window_ReverieSaveLoadConfirm() {
        this.initialize(...arguments);
    }

    Window_ReverieSaveLoadConfirm.prototype = Object.create(Window_Command.prototype);
    Window_ReverieSaveLoadConfirm.prototype.constructor = Window_ReverieSaveLoadConfirm;

    Window_ReverieSaveLoadConfirm.prototype.maxCols = function() {
        return 2;
    };

    Window_ReverieSaveLoadConfirm.prototype.itemRect = function(index) {
        const rect = Window_Command.prototype.itemRect.call(this, index);
        rect.y += CONFIRM_COMMAND_Y_OFFSET;
        return rect;
    };

    Window_ReverieSaveLoadConfirm.prototype.makeCommandList = function() {
        this.addCommand("YES", "yes");
        this.addCommand("NO", "no");
    };

    Window_ReverieSaveLoadConfirm.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        this.contents.clearRect(rect.x - 40, rect.y, rect.width + 80, rect.height);
        if (DEBUG_MODE) {
            this.drawText(this.commandName(index), rect.x + CURSOR_DRAW_SIZE + 8, rect.y, rect.width, "left");
        }
        if (this.active && this.index() === index) {
            drawFingerCursor(this, rect.x, rect.y + Math.floor((rect.height - CURSOR_DRAW_SIZE) / 2) + 4);
        }
    };

    Window_ReverieSaveLoadConfirm.prototype.select = function(index) {
        selectWithCursorRedraw.call(this, index);
        requestSaveLoadHudRefresh();
    };

    Window_ReverieSaveLoadConfirm.prototype.smoothSelect = function(index) {
        this.select(index);
        this.ensureCursorVisible(false);
        requestSaveLoadHudRefresh();
    };

    Window_ReverieSaveLoadConfirm.prototype.processTouch = function() {};
    applySkeletonStyle(Window_ReverieSaveLoadConfirm);

    function Scene_ReverieSaveLoad() {
        this.initialize(...arguments);
    }

    Scene_ReverieSaveLoad.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ReverieSaveLoad.prototype.constructor = Scene_ReverieSaveLoad;

    Scene_ReverieSaveLoad.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
        const request = $gameTemp && $gameTemp._reverieSaveLoadRequest ? $gameTemp._reverieSaveLoadRequest : {};
        this._initialMode = request.initialMode || "load";
        this._canSave = !!request.canSave;
        this._mode = this._canSave && this._initialMode === "save" ? "save" : "load";
        this._confirmType = "";
        this._confirmSavefileId = 0;
        this._loadSuccess = false;
        this._busy = false;
        if ($gameTemp) {
            $gameTemp._reverieSaveLoadRequest = null;
            this.clearOtherHudFlags();
            $gameTemp._customSaveLoadOpen = true;
            $gameTemp.hudShowSaveLoad = true;
        }
    };

    Scene_ReverieSaveLoad.prototype.clearOtherHudFlags = function() {
        if (!$gameTemp) return;
        $gameTemp._customMenuOpen = false;
        $gameTemp.hudShowMainMenu = false;
        $gameTemp.hudShowMementos = false;
        $gameTemp.hudShowMementosList = false;
        $gameTemp.hudShowMementosAction = false;
        $gameTemp.hudShowMementosConfirm = false;
        $gameTemp.hudShowAbilitiesCat = false;
        $gameTemp.hudShowAbilitiesTabs = false;
        $gameTemp.hudShowAbilitiesList = false;
        $gameTemp.hudShowEquipTabs = false;
        $gameTemp.hudShowEquipList = false;
        $gameTemp.hudShowEquipDesc = false;
        $gameTemp.hudShowEquipStat = false;
        $gameTemp.hudShowOptionsCat = false;
        $gameTemp.hudShowOptionsList = false;
        $gameTemp.hudShowOptionsDesc = false;
        $gameTemp.hudShowOptionsConfirm = false;
        $gameTemp.hudShowPass = false;
        $gameTemp.passMidCardVis = false;
        $gameTemp.passLeaderTextVis = false;
        $gameTemp.passPhotoVis = false;
        for (let i = 0; i < 4; i++) {
            $gameTemp["passCardVis" + i] = false;
        }
    };

    Scene_ReverieSaveLoad.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        DataManager.loadAllSavefileImages();
        this.createWindows();
        this.createUltraHUD();
        this.refreshModeSelection();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.createCancelButton = function() {};
    Scene_ReverieSaveLoad.prototype.createPageButtons = function() {};

    Scene_ReverieSaveLoad.prototype.createBackground = function() {
        this._backgroundSprite = new Sprite(ImageManager.loadPicture(SAVE_LOAD_BACKGROUND_PICTURE));
        this.addChild(this._backgroundSprite);
    };

    Scene_ReverieSaveLoad.prototype.start = function() {
        Scene_MenuBase.prototype.start.call(this);
        if ($gameTemp) {
            this.clearOtherHudFlags();
            $gameTemp._customSaveLoadOpen = true;
        }
        this._modeWindow.activate();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.terminate = function() {
        this.destroyUltraHUD();
        if ($gameTemp) {
            const returnToMenu = !!$gameTemp._reverieReturnToOmoriMenuAfterSaveLoadCancel && !this._loadSuccess;
            $gameTemp._reverieReturnToOmoriMenuAfterSaveLoadCancel = false;
            $gameTemp.returnToOmoriMenuAfterLoad = returnToMenu;
            $gameTemp._customSaveLoadOpen = false;
            $gameTemp.hudShowSaveLoad = false;
            $gameTemp.hudShowSaveLoadConfirm = false;
        }
        Scene_MenuBase.prototype.terminate.call(this);
        if (this._loadSuccess) {
            $gameSystem.onAfterLoad();
        }
    };

    Scene_ReverieSaveLoad.prototype.createWindows = function() {
        const modeRect = new Rectangle(SAVE_LOAD_MODE_X, SAVE_LOAD_TOP_Y, SAVE_LOAD_MODE_WIDTH, this.calcWindowHeight(2, true));
        this._modeWindow = new Window_ReverieSaveLoadMode(modeRect);
        this._modeWindow.setCanSave(this._canSave);
        this._modeWindow.setHandler("save", this.onModeSave.bind(this));
        this._modeWindow.setHandler("load", this.onModeLoad.bind(this));
        this._modeWindow.setHandler("cancel", this.popScene.bind(this));
        this._modeWindow._keepCursorVisible = true;
        this.addWindow(this._modeWindow);

        const listRect = new Rectangle(
            SAVE_LOAD_FILE_X,
            SAVE_LOAD_TOP_Y,
            Graphics.boxWidth - SAVE_LOAD_FILE_X - SAVE_LOAD_FILE_RIGHT_MARGIN + SAVE_LOAD_FILE_WIDTH_BONUS,
            Graphics.boxHeight - SAVE_LOAD_TOP_Y - SAVE_LOAD_FILE_BOTTOM_MARGIN
        );
        this._fileWindow = new Window_ReverieSaveLoadList(listRect);
        this._fileWindow.setMode(this._mode, this._canSave);
        this._fileWindow.setHandler("ok", this.onFileOk.bind(this));
        this._fileWindow.setHandler("cancel", this.onFileCancel.bind(this));
        this._fileWindow.select(this.firstSavefileIndex());
        this._fileWindow.deactivate();
        this.addWindow(this._fileWindow);

        const confirmHeight = this.calcWindowHeight(2, true) + CONFIRM_COMMAND_Y_OFFSET;
        const confirmRect = new Rectangle(
            Math.floor((Graphics.boxWidth - CONFIRM_WINDOW_WIDTH) / 2),
            Math.floor((Graphics.boxHeight - confirmHeight) / 2) + CONFIRM_WINDOW_Y_OFFSET,
            CONFIRM_WINDOW_WIDTH,
            confirmHeight
        );
        this._confirmWindow = new Window_ReverieSaveLoadConfirm(confirmRect);
        this._confirmWindow.setHandler("yes", this.onConfirmYes.bind(this));
        this._confirmWindow.setHandler("no", this.onConfirmNo.bind(this));
        this._confirmWindow.setHandler("cancel", this.onConfirmNo.bind(this));
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        this.addWindow(this._confirmWindow);
    };

    Scene_ReverieSaveLoad.prototype.firstSavefileIndex = function() {
        return 0;
    };

    Scene_ReverieSaveLoad.prototype.refreshModeSelection = function() {
        this._modeWindow.select(this._mode === "save" ? 0 : 1);
        this._modeWindow.refresh();
        this._fileWindow.setMode(this._mode, this._canSave);
        this._fileWindow.refresh();
    };

    Scene_ReverieSaveLoad.prototype.onModeSave = function() {
        if (!this._canSave) {
            SoundManager.playBuzzer();
            this._modeWindow.activate();
            return;
        }
        this._mode = "save";
        this.openFileList();
    };

    Scene_ReverieSaveLoad.prototype.onModeLoad = function() {
        this._mode = "load";
        this.openFileList();
    };

    Scene_ReverieSaveLoad.prototype.openFileList = function() {
        this.refreshModeSelection();
        this._modeWindow.deactivate();
        this._fileWindow.activate();
        if (this._fileWindow.index() < 0) this._fileWindow.select(this.firstSavefileIndex());
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.onFileCancel = function() {
        this._fileWindow.deactivate();
        this._modeWindow.activate();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.onFileOk = function() {
        if (this._busy) return;

        const savefileId = this._fileWindow.savefileId();
        const info = DataManager.savefileInfo(savefileId);

        if (this._mode === "save") {
            if (!this._canSave || !isManualSavefileId(savefileId)) {
                SoundManager.playBuzzer();
                this._fileWindow.activate();
                return;
            }
            if (info) {
                this.openConfirm("overwrite", savefileId, "Overwrite this file?");
            } else {
                this.executeSave(savefileId);
            }
        } else {
            if (!info) {
                SoundManager.playBuzzer();
                this._fileWindow.activate();
                return;
            }
            this.openConfirm("load", savefileId, "Load this file?");
        }
    };

    Scene_ReverieSaveLoad.prototype.openConfirm = function(type, savefileId, text) {
        SoundManager.playOk();
        this._confirmType = type;
        this._confirmSavefileId = savefileId;
        if ($gameTemp) {
            $gameTemp.saveLoadConfirmType = type;
            $gameTemp.saveLoadConfirmText = text;
            $gameTemp.hudShowSaveLoadConfirm = true;
        }
        this._fileWindow.deactivate();
        this._confirmWindow.show();
        this._confirmWindow.refresh();
        this._confirmWindow.select(1);
        this._confirmWindow.activate();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.onConfirmNo = function() {
        this.closeConfirm();
        this._fileWindow.activate();
    };

    Scene_ReverieSaveLoad.prototype.onConfirmYes = function() {
        if (this._confirmType === "overwrite") {
            this.closeConfirm();
            this.executeSave(this._confirmSavefileId);
        } else if (this._confirmType === "load") {
            this.closeConfirm();
            this.executeLoad(this._confirmSavefileId);
        }
    };

    Scene_ReverieSaveLoad.prototype.closeConfirm = function() {
        this._confirmWindow.hide();
        this._confirmWindow.deactivate();
        if ($gameTemp) {
            $gameTemp.hudShowSaveLoadConfirm = false;
            $gameTemp.saveLoadConfirmText = "";
            $gameTemp.saveLoadConfirmType = "";
        }
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.executeSave = function(savefileId) {
        this._busy = true;
        this._fileWindow.deactivate();
        $gameSystem.setSavefileId(savefileId);
        $gameSystem.onBeforeSave();
        DataManager.saveGame(savefileId)
            .then(() => this.onSaveSuccess())
            .catch(() => this.onSaveFailure());
    };

    Scene_ReverieSaveLoad.prototype.onSaveSuccess = function() {
        this._busy = false;
        SoundManager.playSave();
        DataManager.loadAllSavefileImages();
        this._fileWindow.refresh();
        this._fileWindow.activate();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.onSaveFailure = function() {
        this._busy = false;
        SoundManager.playBuzzer();
        this._fileWindow.activate();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.executeLoad = function(savefileId) {
        this._busy = true;
        this._fileWindow.deactivate();
        DataManager.loadGame(savefileId)
            .then(() => this.onLoadSuccess())
            .catch(() => this.onLoadFailure());
    };

    Scene_ReverieSaveLoad.prototype.onLoadSuccess = function() {
        SoundManager.playLoad();
        this.fadeOutAll();
        this.reloadMapIfUpdated();
        SceneManager.goto(Scene_Map);
        this._loadSuccess = true;
    };

    Scene_ReverieSaveLoad.prototype.onLoadFailure = function() {
        this._busy = false;
        SoundManager.playBuzzer();
        this._fileWindow.activate();
        this.refreshSaveLoadHudNow();
    };

    Scene_ReverieSaveLoad.prototype.reloadMapIfUpdated = function() {
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            const mapId = $gameMap.mapId();
            const x = $gamePlayer.x;
            const y = $gamePlayer.y;
            $gamePlayer.reserveTransfer(mapId, x, y);
            $gamePlayer.requestMapReload();
        }
    };

    Scene_ReverieSaveLoad.prototype.update = function() {
        this.updateSaveLoadHUDData();
        Scene_MenuBase.prototype.update.call(this);
        this.updateUltraHUDContainerVisibility();
        this.updateSaveLoadHUDData();
    };

    Scene_ReverieSaveLoad.prototype.createUltraHUD = function() {
        if (typeof Stage_UltraHUDContainer === "undefined") return;
        this._ultraHudContainer = new Stage_UltraHUDContainer(true);
        this._ultraHudContainer.createMapHUD();
        this.addChild(this._ultraHudContainer);
        if (this._windowLayer) {
            const windowLayerIndex = this.children.indexOf(this._windowLayer);
            if (windowLayerIndex >= 0) {
                this.setChildIndex(this._ultraHudContainer, windowLayerIndex);
            }
        }
        this.updateUltraHUDContainerVisibility();
    };

    Scene_ReverieSaveLoad.prototype.shouldHUDBeAvailable = function() {
        return true;
    };

    Scene_ReverieSaveLoad.prototype.ultraHUDVisibility = function() {
        const hmu = SRD && SRD.HUDMakerUltra ? SRD.HUDMakerUltra : null;
        const mapFunc = hmu && hmu.mapVisibilityFunc ? hmu.mapVisibilityFunc : null;
        const baseVisible = mapFunc ? mapFunc() : true;
        const globalVisible = typeof $gameUltraHUD === "undefined" ? true : $gameUltraHUD.globalVisibility;
        return baseVisible && globalVisible;
    };

    Scene_ReverieSaveLoad.prototype.updateUltraHUDContainerVisibility = function() {
        if (!this._ultraHudContainer) return;
        this._ultraHudContainer.visible = this.ultraHUDVisibility();
        this._ultraHudContainer.setVisibilityState(true);
        this._ultraHudContainer._fadeState = true;
        this._ultraHudContainer._fadeCurr = this._ultraHudContainer._fadeDuration || 0;
        this._ultraHudContainer.alpha = 1;
    };

    Scene_ReverieSaveLoad.prototype.destroyUltraHUD = function() {
        if (this._ultraHudContainer) {
            this._ultraHudContainer.destroyCurrentHUD();
            this.removeChild(this._ultraHudContainer);
            this._ultraHudContainer.destroy();
            this._ultraHudContainer = null;
        }
    };

    Scene_ReverieSaveLoad.prototype.refreshSaveLoadHudNow = function() {
        this.updateSaveLoadHUDData();
        if (this._ultraHudContainer && this._ultraHudContainer.updateMainHUD) {
            this._ultraHudContainer.updateMainHUD();
        }
    };

    Scene_ReverieSaveLoad.prototype.updateSaveLoadHUDData = function() {
        if (!$gameTemp || !this._modeWindow || !this._fileWindow) return;

        const confirmOpen = !!(this._confirmWindow && this._confirmWindow.visible);
        const fileCursorVisible = this._fileWindow.active && !confirmOpen && !this._busy;
        const modeCursorIndex = this._modeWindow.index();
        const confirmCursorIndex = this._confirmWindow ? this._confirmWindow.index() : -1;

        $gameTemp.hudShowSaveLoad = true;
        $gameTemp.saveLoadMode = this._mode;
        $gameTemp.saveLoadCanSave = this._canSave;
        $gameTemp.saveLoadModeIndex = modeCursorIndex;
        $gameTemp.saveLoadModeCursorIndex = modeCursorIndex;
        $gameTemp.saveLoadModeCursorSave = modeCursorIndex === 0;
        $gameTemp.saveLoadModeCursorLoad = modeCursorIndex === 1;
        $gameTemp.saveLoadModeActive = this._modeWindow.active;
        $gameTemp.saveLoadFileActive = this._fileWindow.active;
        $gameTemp.saveLoadFileCursorVisible = fileCursorVisible;
        $gameTemp.saveLoadFileIndex = this._fileWindow.index();
        $gameTemp.saveLoadFileId = this._fileWindow.savefileId();
        $gameTemp.saveLoadTopIndex = this._fileWindow.topIndex();
        $gameTemp.saveLoadConfirmIndex = confirmCursorIndex;
        $gameTemp.saveLoadConfirmCursorYes = confirmOpen && confirmCursorIndex === 0;
        $gameTemp.saveLoadConfirmCursorNo = confirmOpen && confirmCursorIndex === 1;
        $gameTemp.saveLoadBusy = this._busy;
        $gameTemp.hudShowSaveLoadConfirm = confirmOpen;

        for (let slot = 0; slot < VISIBLE_FILE_ROWS; slot++) {
            const savefileIndex = $gameTemp.saveLoadTopIndex + slot;
            const savefileId = savefileIdFromIndex(savefileIndex);
            const info = DataManager.savefileInfo(savefileId);
            const hasData = !!info;
            const slotExists = isManagedSavefileId(savefileId);
            const fileName = slotExists ? savefileName(savefileId) : "";
            const mainMapName = savefileMainMapName(info);

            $gameTemp["saveLoadSlotId" + slot] = savefileId;
            $gameTemp["saveLoadSlotIndex" + slot] = savefileIndex;
            $gameTemp["saveLoadSlotFileName" + slot] = fileName;
            $gameTemp["saveLoadSlotExists" + slot] = slotExists;
            $gameTemp["saveLoadSlotIsAutosave" + slot] = isAutosaveFileId(savefileId);
            $gameTemp["saveLoadSlotCanSave" + slot] = isManualSavefileId(savefileId);
            $gameTemp["saveLoadSlotHasData" + slot] = hasData;
            $gameTemp["saveLoadSlotCurrent" + slot] = savefileId === $gameTemp.saveLoadFileId;
            $gameTemp["saveLoadSlotSelected" + slot] = fileCursorVisible && savefileId === $gameTemp.saveLoadFileId;
            $gameTemp["saveLoadSlotCursor" + slot] = fileCursorVisible && savefileId === $gameTemp.saveLoadFileId;
            $gameTemp["saveLoadSlotEnabled" + slot] = slotExists ? this._fileWindow.isEnabled(savefileId) : false;
            $gameTemp["saveLoadSlotHeader" + slot] = hasData && mainMapName ? fileName + ": " + mainMapName : fileName;
            $gameTemp["saveLoadSlotMainMap" + slot] = hasData ? mainMapName : "";
            $gameTemp["saveLoadSlotActorName" + slot] = hasData ? savefileActorName(info) : "";
            $gameTemp["saveLoadSlotPlaytime" + slot] = hasData ? savefilePlaytime(info) : "";
            $gameTemp["saveLoadSlotLocation" + slot] = hasData ? savefileLocation(info) : "";
            $gameTemp["saveLoadSlotFaceName" + slot] = hasData ? savefileFaceName(info) : "";
            $gameTemp["saveLoadSlotFaceIndex" + slot] = hasData ? savefileFaceIndex(info) : 0;
            $gameTemp["saveLoadSlotFaceImage" + slot] = hasData ? savefileFaceImage(info) : EMPTY_IMAGE;
        }
    };

    function Scene_ReverieSave() {
        this.initialize(...arguments);
    }

    Scene_ReverieSave.prototype = Object.create(Scene_ReverieSaveLoad.prototype);
    Scene_ReverieSave.prototype.constructor = Scene_ReverieSave;

    Scene_ReverieSave.prototype.initialize = function() {
        if ($gameTemp) {
            $gameTemp._reverieSaveLoadRequest = {
                initialMode: "save",
                canSave: true
            };
        }
        Scene_ReverieSaveLoad.prototype.initialize.call(this);
    };

    function Scene_ReverieLoad() {
        this.initialize(...arguments);
    }

    Scene_ReverieLoad.prototype = Object.create(Scene_ReverieSaveLoad.prototype);
    Scene_ReverieLoad.prototype.constructor = Scene_ReverieLoad;

    Scene_ReverieLoad.prototype.initialize = function() {
        if ($gameTemp) {
            $gameTemp._reverieSaveLoadRequest = {
                initialMode: "load",
                canSave: false
            };
        }
        Scene_ReverieSaveLoad.prototype.initialize.call(this);
    };

    window.Scene_ReverieSaveLoad = Scene_ReverieSaveLoad;
    window.Scene_Save = Scene_ReverieSave;
    window.Scene_Load = Scene_ReverieLoad;

    window.ReverieSaveLoad = {
        openCampSaveLoad() {
            if ($gameTemp) {
                $gameTemp._reverieSaveLoadRequest = {
                    initialMode: "save",
                    canSave: true
                };
            }
            SceneManager.push(Scene_ReverieSaveLoad);
        },

        openLoad() {
            if ($gameTemp) {
                $gameTemp._reverieSaveLoadRequest = {
                    initialMode: "load",
                    canSave: false
                };
            }
            SceneManager.push(Scene_ReverieSaveLoad);
        }
    };

    PluginManager.registerCommand("CustomSaveLoadScreen", "openCamp", () => {
        window.ReverieSaveLoad.openCampSaveLoad();
    });

    PluginManager.registerCommand("CustomSaveLoadScreen", "openLoad", () => {
        window.ReverieSaveLoad.openLoad();
    });
})();
