/*:
@target MZ
@plugindesc Reverie - Complete Main Menu UI Override (THE PIXI RENDER HIJACK - FLICKER FIXED)
@author Aristel
*/

(() => {
    // =======================================================
    // 1. SETTINGS & CONSTANTS
    // =======================================================
    const DEBUG_MODE = false; 

    const MENU_MARGIN_X = 12; 
    const MENU_MARGIN_Y = 12; 

    const CURSOR_IMAGE_NAME = "FingerCursor";
    const CURSOR_NATIVE_SIZE = 14; 
    const CURSOR_DRAW_SIZE = 24;

    // --- EXACT HUD MAKER GROUP NAME ---
    const HMU_MEMENTOS_GROUP = "MementosGroup";

    // Custom delay for the cursor when opening a sliding submenu (in frames)
    const CURSOR_ANIMATION_DELAY = 90; 
    // How far up (in pixels) the menu starts before sliding down
    const SLIDE_Y_OFFSET = -68; 

    // =======================================================
    // 1.2. PIXI WEBGL HIJACK ENGINE
    // =======================================================
    const hijackHUDMakerNode = (parent, targetName) => {
        if (!parent || !parent.children) return;
        
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            
            let isTarget = false;
            if (child.name === targetName) isTarget = true;
            else if (child._component && child._component.name === targetName) isTarget = true;
            else if (child.component && child.component.name === targetName) isTarget = true;
            else if (child._data && (child._data.name === targetName || child._data.Name === targetName)) isTarget = true;
            else if (child.data && (child.data.name === targetName || child.data.Name === targetName)) isTarget = true;
            
            if (isTarget && !child._reverieHijacked) {
                child._reverieHijacked = true;
                
                // --- FLICKER FIX: HIDE IMMEDIATELY ON DISCOVERY ---
                // This prevents the group from being drawn at the resting position for 1 frame
                child.renderable = false; 
                
                const originalUpdateTransform = child.updateTransform;
                child.updateTransform = function() {
                    // Let HUD Maker lock its coordinates
                    if (originalUpdateTransform) originalUpdateTransform.call(this);
                    
                    // Capture the resting Y position once
                    if (this._reverieBaseY === undefined) {
                        this._reverieBaseY = this.y; 
                    }
                    
                    // Override the Y position during the slide
                    if ($gameTemp && $gameTemp._customMenuOpen && $gameTemp._menuCursorDelay > 0) {
                        const progress = (CURSOR_ANIMATION_DELAY - $gameTemp._menuCursorDelay) / CURSOR_ANIMATION_DELAY;
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const offset = SLIDE_Y_OFFSET * (1 - easeOut);
                        
                        this.y = this._reverieBaseY + offset; 
                        this.renderable = true; // Show it now that it's at the correct slide position
                    } else if ($gameTemp && $gameTemp._customMenuOpen) {
                        this.y = this._reverieBaseY;
                        this.renderable = true;
                    }
                };
            }
            
            hijackHUDMakerNode(child, targetName);
        }
    };

    // =======================================================
    // 1.5. OVERLAY ENGINE
    // =======================================================
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if ($gameTemp && $gameTemp._customMenuOpen) {
            Scene_Base.prototype.update.call(this); 
            this.updateHUDMakerBridge(); 

            // Hijack scan
            if (this._mementosCatWindow && this._mementosCatWindow.visible) {
                hijackHUDMakerNode(this, HMU_MEMENTOS_GROUP);
            }

            // --- NATIVE SKELETON SLIDE (For Cursor Sync) ---
            if ($gameTemp._menuCursorDelay > 0) {
                $gameTemp._menuCursorDelay--;
                
                const progress = (CURSOR_ANIMATION_DELAY - $gameTemp._menuCursorDelay) / CURSOR_ANIMATION_DELAY;
                const easeOut = 1 - Math.pow(1 - progress, 3);
                const currentOffset = SLIDE_Y_OFFSET * (1 - easeOut);

                if (this._mementosCatWindow && this._mementosCatWindow.active) {
                    this._mementosCatWindow.y = this._mementosCatWindow._baseY + currentOffset;
                    this._mementosCatWindow.redrawItem(this._mementosCatWindow.index());
                }

                if ($gameTemp._menuCursorDelay === 0) {
                    if (this._mementosCatWindow) {
                        this._mementosCatWindow.y = this._mementosCatWindow._baseY;
                        if (this._mementosCatWindow.active) this._mementosCatWindow.redrawItem(this._mementosCatWindow.index());
                    }
                }
            } 
            return;
        }
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.updateCallMenu = function() {
        if (this.isMenuEnabled() && this.isMenuCalled()) {
            this.menuCalling = false;
            this.openCustomOmoriMenu();
        }
    };

    Scene_Map.prototype.calcWindowHeight = function(numLines, selectable) {
        if (selectable) {
            return Window_Selectable.prototype.fittingHeight(numLines);
        }
        return Window_Base.prototype.fittingHeight(numLines);
    };

    // =======================================================
    // 1.8. THE "STUN" LOCK (PREVENTS INPUT DURING ANIMATION)
    // =======================================================
    const _Window_Selectable_processCursorMove = Window_Selectable.prototype.processCursorMove;
    Window_Selectable.prototype.processCursorMove = function() {
        if ($gameTemp && $gameTemp._customMenuOpen && $gameTemp._menuCursorDelay > 0) return; 
        _Window_Selectable_processCursorMove.call(this);
    };

    const _Window_Selectable_processHandling = Window_Selectable.prototype.processHandling;
    Window_Selectable.prototype.processHandling = function() {
        if ($gameTemp && $gameTemp._customMenuOpen && $gameTemp._menuCursorDelay > 0) return; 
        _Window_Selectable_processHandling.call(this);
    };

    const _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        if ($gameTemp && $gameTemp._customMenuOpen && $gameTemp._menuCursorDelay > 0) return; 
        _Window_Selectable_processTouch.call(this);
    };

    // =======================================================
    // 2. ANNIHILATE UNWANTED UI ELEMENTS
    // =======================================================
    Scene_Map.prototype.createMenuButton = function() {}; 
    Scene_MenuBase.prototype.createCancelButton = function() {}; 
    Scene_MenuBase.prototype.createButtonAssistWindow = function() {};

    const _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.call(this);
        if (this._helpWindow) this._helpWindow.visible = false;
    };

    // =======================================================
    // 3. SKELETON INVISIBILITY & CURSOR INJECTION
    // =======================================================
    const applySkeletonStyle = function(windowClass) {
        const _initialize = windowClass.prototype.initialize;
        windowClass.prototype.initialize = function(rect) {
            _initialize.call(this, rect);
            if (DEBUG_MODE) {
                this.opacity = 150; 
                this.frameVisible = true; 
            } else {
                this.opacity = 0; 
                this.frameVisible = false; 
                this.backOpacity = 0; 
            }
        };

        windowClass.prototype.drawItemBackground = function(index) {};

        windowClass.prototype._refreshCursor = function() {
            if (this._cursorSprite) this._cursorSprite.visible = false;
        };

        const _activate = windowClass.prototype.activate;
        windowClass.prototype.activate = function() {
            _activate.call(this);
            if (this.index() >= 0) this.redrawItem(this.index());
        };

        const _deactivate = windowClass.prototype.deactivate;
        windowClass.prototype.deactivate = function() {
            _deactivate.call(this);
            if (this.index() >= 0) this.redrawItem(this.index());
        };
    };

    applySkeletonStyle(Window_MenuCommand);
    applySkeletonStyle(Window_MenuStatus);

    // =======================================================
    // 4. CUSTOM DRAW ITEM (FOR ALL BUTTON LISTS)
    // =======================================================
    const customDrawItemWithCursor = function(index) {
        const rect = this.itemLineRect(index);
        
        const clearX = rect.x - CURSOR_DRAW_SIZE - 20;
        const clearW = rect.width + CURSOR_DRAW_SIZE + 40;
        this.contents.clearRect(clearX, rect.y, clearW, rect.height);
        
        const name = this.commandName ? this.commandName(index) : (this.item() ? this.item().name : "");
        this.changePaintOpacity(this.isCommandEnabled ? this.isCommandEnabled(index) : true);

        const textWidth = this.textWidth(name);
        const textX = rect.x + CURSOR_DRAW_SIZE + 10; 
        
        if (DEBUG_MODE) {
            this.drawText(name, textX, rect.y, textWidth, 'left');
        }

        if (this.index() === index && this.active && (!$gameTemp || !$gameTemp._menuCursorDelay || $gameTemp._menuCursorDelay <= 0)) {
            const cursorX = textX - CURSOR_DRAW_SIZE - 5; 
            const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2; 
            const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
            
            if (cursorBmp.isReady()) {
                this.contents.blt(
                    cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, 
                    cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE 
                );
            } else {
                cursorBmp.addLoadListener(() => this.redrawItem(index));
            }
        }
    };

    const customSelectRefresh = function(index) {
        const lastIndex = this.index();
        Window_Selectable.prototype.select.call(this, index);
        if (this.index() !== lastIndex) {
            if (lastIndex >= 0) this.redrawItem(lastIndex); 
            if (this.index() >= 0) this.redrawItem(this.index()); 
        }
    };

    // =======================================================
    // 5. BLUEPRINT ALIGNMENT: MAIN MENUS
    // =======================================================
    Scene_Map.prototype.commandWindowRect = function() {
        const w = Graphics.boxWidth - (MENU_MARGIN_X * 2);
        const h = this.calcWindowHeight(1, true);
        return new Rectangle(MENU_MARGIN_X, MENU_MARGIN_Y, w, h);
    };

    Window_MenuCommand.prototype.maxCols = function() { return 5; };
    Window_MenuCommand.prototype.numVisibleRows = function() { return 1; }; 
    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addCommand("Equip", 'equip');
        this.addCommand("Skill", 'skill');    
        this.addCommand("Bond", 'bond');      
        this.addCommand("Mementos", 'mementos'); 
        this.addCommand("Options", 'options');
    };
    Window_MenuCommand.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuCommand.prototype.select = customSelectRefresh;

    Scene_Map.prototype.statusWindowRect = function() {
        const height = 240; 
        const w = Graphics.boxWidth - (MENU_MARGIN_X * 2);
        const y = Graphics.boxHeight - height - MENU_MARGIN_Y;
        return new Rectangle(MENU_MARGIN_X, y, w, height);
    };
    Window_MenuStatus.prototype.maxCols = function() { return 4; }; 
    Window_MenuStatus.prototype.numVisibleRows = function() { return 1; }; 
    Window_MenuStatus.prototype.drawItemImage = function(index) {}; 
    Window_MenuStatus.prototype.drawItemStatus = function(index) {}; 
    Window_MenuStatus.prototype.drawItem = function(index) {
        const rect = this.itemRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        if (DEBUG_MODE) {
            const isSelected = (this.index() === index && this.active);
            const color = isSelected ? 'rgba(0, 255, 0, 0.5)' : 'rgba(255, 0, 0, 0.3)';
            this.contents.fillRect(rect.x, rect.y, rect.width, rect.height, color);
            this.drawText(this.actor(index).name(), rect.x, rect.y, rect.width, 'center');
        }
    };
    Window_MenuStatus.prototype.select = customSelectRefresh;

    // =======================================================
    // 6. MEMENTOS CATEGORY
    // =======================================================
    function Window_MenuMementosCat() { this.initialize(...arguments); }
    Window_MenuMementosCat.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MenuMementosCat.prototype.constructor = Window_MenuMementosCat;
    applySkeletonStyle(Window_MenuMementosCat);
    Window_MenuMementosCat.prototype.maxCols = function() { return 5; }; 
    Window_MenuMementosCat.prototype.makeCommandList = function() {
        this.addCommand("Snacks", 'snacks');
        this.addCommand("Toys", 'toys');
        this.addCommand("Important", 'important');
    };
    Window_MenuMementosCat.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuMementosCat.prototype.select = customSelectRefresh;

    // =======================================================
    // 8. WIRING IT ALL TOGETHER ON THE MAP
    // =======================================================
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createCustomOmoriMenu();
    };

    Scene_Map.prototype.createCustomOmoriMenu = function() {
        this.createCommandWindow();
        this.createStatusWindow();
        this.createMementosSubWindow();

        this._commandWindow.hide();
        this._commandWindow.deactivate();
        this._statusWindow.hide();
        this._statusWindow.deactivate();
    };

    Scene_Map.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_MenuCommand(rect);
        this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('skill', this.commandPersonal.bind(this)); 
        this._commandWindow.setHandler('bond', this.commandPersonal.bind(this));  
        this._commandWindow.setHandler('mementos', this.commandMementos.bind(this));
        this._commandWindow.setHandler('cancel', this.closeCustomOmoriMenu.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Map.prototype.createStatusWindow = function() {
        const rect = this.statusWindowRect();
        this._statusWindow = new Window_MenuStatus(rect);
        this._statusWindow.setHandler('ok', this.onPersonalOkCustom.bind(this));
        this._statusWindow.setHandler('cancel', this.onPersonalCancel.bind(this));
        this.addWindow(this._statusWindow);
    };

    Scene_Map.prototype.createMementosSubWindow = function() {
        const h = this.calcWindowHeight(1, true);
        const y = MENU_MARGIN_Y + h; 
        const rect = new Rectangle(MENU_MARGIN_X, y, Graphics.boxWidth - (MENU_MARGIN_X * 2), h);
        this._mementosCatWindow = new Window_MenuMementosCat(rect);
        this._mementosCatWindow._baseY = y; 
        this._mementosCatWindow.setHandler('cancel', this.onMementosCancel.bind(this));
        this.addWindow(this._mementosCatWindow);
        this._mementosCatWindow.hide(); 
        this._mementosCatWindow.deactivate();
    };

    // --- OVERLAY LOGIC HANDLERS ---
    Scene_Map.prototype.openCustomOmoriMenu = function() {
        $gameTemp._customMenuOpen = true;
        $gameTemp._menuCursorDelay = 0; 
        
        this._commandWindow.show();
        this._commandWindow.activate();
        this._commandWindow.select(0);
        this._statusWindow.show();      
        this._statusWindow.deselect();  
    };

    Scene_Map.prototype.closeCustomOmoriMenu = function() {
        $gameTemp._customMenuOpen = false;
        
        this._commandWindow.hide();
        this._commandWindow.deactivate();
        this._statusWindow.hide();
        this._statusWindow.deactivate();
        this._mementosCatWindow.hide();
        this._mementosCatWindow.deactivate();
    };

    Scene_Map.prototype.commandPersonal = function() {
        this._statusWindow.show();
        this._statusWindow.activate();
        this._statusWindow.select(0); 
    };

    Scene_Map.prototype.onPersonalCancel = function() {
        this._statusWindow.deselect(); 
        this._statusWindow.deactivate();
        this._commandWindow.activate();
    };

    Scene_Map.prototype.commandMementos = function() {
        // PRE-HIJACK DISCOVERY: Hide it before the first frame can draw at the bottom
        hijackHUDMakerNode(this, HMU_MEMENTOS_GROUP);

        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
        this._mementosCatWindow.show();
        this._mementosCatWindow.activate();
        this._mementosCatWindow.select(0); 
    };

    Scene_Map.prototype.onMementosCancel = function() {
        this._mementosCatWindow.hide();
        this._mementosCatWindow.deactivate();
        this._commandWindow.activate();
    };

    const _Window_MenuStatus_processOk = Window_MenuStatus.prototype.processOk;
    Window_MenuStatus.prototype.processOk = function() {
        if (this.isCurrentItemEnabled()) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            SceneManager._scene.onPersonalOkCustom();
        }
    };

    Scene_Map.prototype.onPersonalOkCustom = function() {
        const symbol = this._commandWindow.currentSymbol();
        const actorIndex = this._statusWindow.index();
        const actor = $gameParty.members()[actorIndex];
        
        $gameTemp.menuSelectedActorIndex = actorIndex;
        this._statusWindow.deselect();
        this._commandWindow.activate();
    };

    // =======================================================
    // 9. HUD MAKER ULTRA TRACKING BRIDGE
    // =======================================================
    Scene_Map.prototype.updateHUDMakerBridge = function() {
        if (!$gameTemp) return;

        $gameTemp.isTopMenuActive = this._commandWindow ? this._commandWindow.active : false;
        $gameTemp.menuTopIndex = this._commandWindow ? this._commandWindow.index() : -1;
        
        $gameTemp.isSelectingActor = this._statusWindow ? this._statusWindow.active : false;
        $gameTemp.menuActorIndex = this._statusWindow ? this._statusWindow.index() : -1;

        $gameTemp.hudShowMementos = !!(this._mementosCatWindow && this._mementosCatWindow.visible);
    };

})();