/*:
@target MZ
@plugindesc Reverie - Complete Main Menu UI Override (PIXI HIJACK + MEMENTOS BLUEPRINT)
@author Aristel
*/

(() => {
    // =======================================================
    // 1. SETTINGS & CONSTANTS
    // =======================================================
    const DEBUG_MODE = true; 

    const MENU_MARGIN_X = 12; 
    const MENU_MARGIN_Y = 12; 

    const CURSOR_IMAGE_NAME = "FingerCursor";
    const CURSOR_NATIVE_SIZE = 14; 
    const CURSOR_DRAW_SIZE = 24;

    const HMU_MEMENTOS_GROUP = "MementosGroup";

    const CURSOR_ANIMATION_DELAY = 45; 
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
            
            if (isTarget && !child._reverieRenderHijacked) {
                child._reverieRenderHijacked = true;
                
                const originalRender = child.render;
                const originalRenderCanvas = child.renderCanvas;

                const applyReverieSlide = function(target, renderer, originalMethod) {
                    const originalY = target.y; 

                    if ($gameTemp && $gameTemp._customMenuOpen && $gameTemp._menuCursorDelay > 0) {
                        const progress = (CURSOR_ANIMATION_DELAY - $gameTemp._menuCursorDelay) / CURSOR_ANIMATION_DELAY;
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        
                        if ($gameTemp._menuCursorDelay === CURSOR_ANIMATION_DELAY) {
                            target.y = 68 + SLIDE_Y_OFFSET;
                        } else {
                            target.y = 68 + (SLIDE_Y_OFFSET * (1 - easeOut));
                        }
                        target.updateTransform();
                    } else if ($gameTemp && $gameTemp._customMenuOpen) {
                        target.y = 68;
                        target.updateTransform();
                    }

                    if (originalMethod) originalMethod.call(target, renderer);

                    target.y = originalY;
                    target.updateTransform(); 
                };

                if (originalRender) {
                    child.render = function(renderer) { applyReverieSlide(this, renderer, originalRender); };
                }
                if (originalRenderCanvas) {
                    child.renderCanvas = function(renderer) { applyReverieSlide(this, renderer, originalRenderCanvas); };
                }
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

            if (this._mementosCatWindow && this._mementosCatWindow.visible) {
                hijackHUDMakerNode(this, HMU_MEMENTOS_GROUP);
            }

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
        if (selectable) return Window_Selectable.prototype.fittingHeight(numLines);
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

    const customDrawItemWithCursor = function(index) {
        const rect = this.itemLineRect(index);
        
        const clearX = rect.x - CURSOR_DRAW_SIZE - 20;
        const clearW = rect.width + CURSOR_DRAW_SIZE + 40;
        this.contents.clearRect(clearX, rect.y, clearW, rect.height);
        
        const name = this.commandName ? this.commandName(index) : (this.item() ? this.item().name : "");
        this.changePaintOpacity(this.isCommandEnabled ? this.isCommandEnabled(index) : true);

        const textWidth = this.textWidth(name);
        const textX = rect.x + CURSOR_DRAW_SIZE + 10; 
        
        if (DEBUG_MODE) this.drawText(name, textX, rect.y, textWidth, 'left');

        if (this.index() === index && this.active && (!$gameTemp || !$gameTemp._menuCursorDelay || $gameTemp._menuCursorDelay <= 0)) {
            const cursorX = textX - CURSOR_DRAW_SIZE - 5; 
            const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2; 
            const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
            
            if (cursorBmp.isReady()) {
                this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
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

    applySkeletonStyle(Window_MenuCommand);
    applySkeletonStyle(Window_MenuStatus);
    Window_MenuCommand.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuCommand.prototype.select = customSelectRefresh;
    Window_MenuStatus.prototype.select = customSelectRefresh;

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

    // =======================================================
    // 6. MEMENTOS: CATEGORIES
    // =======================================================
    function Window_MenuMementosCat() { this.initialize(...arguments); }
    Window_MenuMementosCat.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MenuMementosCat.prototype.constructor = Window_MenuMementosCat;
    applySkeletonStyle(Window_MenuMementosCat);
    Window_MenuMementosCat.prototype.maxCols = function() { return 5; }; 
    Window_MenuMementosCat.prototype.makeCommandList = function() {
        this.addCommand("Goodies", 'goodies');
        this.addCommand("Trinkets", 'trinkets');
        this.addCommand("Keepsakes", 'keepsakes');
    };
    Window_MenuMementosCat.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuMementosCat.prototype.select = customSelectRefresh;

    // =======================================================
    // 7. MEMENTOS: ITEM LIST & ACTIONS
    // =======================================================
    function Window_MementosItemList() { this.initialize(...arguments); }
    Window_MementosItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_MementosItemList.prototype.constructor = Window_MementosItemList;
    applySkeletonStyle(Window_MementosItemList);
    Window_MementosItemList.prototype.maxCols = function() { return 1; };
    Window_MementosItemList.prototype.includes = function(item) {
        if (!item) return false;
        const cat = this._category;
        if (cat === 'goodies') return item.itypeId === 1 && item.meta.Category !== 'Trinkets'; 
        if (cat === 'trinkets') return item.itypeId === 1 && item.meta.Category === 'Trinkets';
        if (cat === 'keepsakes') return item.itypeId === 2; 
        return false;
    };
    Window_MementosItemList.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (item) {
            const rect = this.itemLineRect(index);
            this.contents.clearRect(rect.x - 40, rect.y, rect.width + 80, rect.height);
            
            if (DEBUG_MODE) {
                this.drawText(item.name, rect.x + 34, rect.y, rect.width - 60, 'left');
                this.drawText("x" + $gameParty.numItems(item), rect.x, rect.y, rect.width, 'right');
            }

            if (this.index() === index && this.active) {
                 const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
                 if (cursorBmp.isReady()) {
                     this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, rect.x, rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
                 } else {
                     cursorBmp.addLoadListener(() => this.redrawItem(index));
                 }
            }
        }
    };
    Window_MementosItemList.prototype.select = customSelectRefresh;

    function Window_MementosAction() { this.initialize(...arguments); }
    Window_MementosAction.prototype = Object.create(Window_Command.prototype);
    Window_MementosAction.prototype.constructor = Window_MementosAction;
    applySkeletonStyle(Window_MementosAction);
    Window_MementosAction.prototype.setItem = function(item) {
        this._item = item;
        this.refresh();
    };
    Window_MementosAction.prototype.makeCommandList = function() {
        const item = this._item;
        
        let isNeeded = false;
        // Fix: Explicitly check if the item has ANY effect on ANY current party member
        if (item && item.itypeId === 1 && item.meta.Category !== 'Trinkets') {
            if (item.occasion === 0 || item.occasion === 2) { // 0: Always, 2: Menu Screen
                isNeeded = $gameParty.members().some(actor => {
                    const action = new Game_Action(actor);
                    action.setItemObject(item);
                    return action.testApply(actor);
                });
            }
        }

        const canTrash = item && item.itypeId !== 2; 

        this.addCommand("Use", 'use', isNeeded);
        this.addCommand("Trash", 'trash', canTrash);
    };
    Window_MementosAction.prototype.drawItem = customDrawItemWithCursor;
    Window_MementosAction.prototype.select = customSelectRefresh;

    function Window_MementosConfirm() { this.initialize(...arguments); }
    Window_MementosConfirm.prototype = Object.create(Window_Command.prototype);
    Window_MementosConfirm.prototype.constructor = Window_MementosConfirm;
    applySkeletonStyle(Window_MementosConfirm);
    
    // Fix: Makes Yes/No horizontal
    Window_MementosConfirm.prototype.maxCols = function() { return 2; }; 
    
    Window_MementosConfirm.prototype.itemRect = function(index) {
        const rect = Window_Command.prototype.itemRect.call(this, index);
        rect.y += 36; // Pushes the choices down to leave room for the header
        return rect;
    };
    Window_MementosConfirm.prototype.makeCommandList = function() {
        this.addCommand("Yes", 'yes');
        this.addCommand("No", 'no');
    };
    Window_MementosConfirm.prototype.drawAllItems = function() {
        if (DEBUG_MODE) {
            this.drawText("Are you sure?", 0, 0, this.innerWidth, 'center');
        }
        Window_Selectable.prototype.drawAllItems.call(this);
    };
    Window_MementosConfirm.prototype.drawItem = customDrawItemWithCursor;
    Window_MementosConfirm.prototype.select = customSelectRefresh;

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
        this.createMementosItemList();
        this.createMementosActionWindow();
        this.createMementosConfirmWindow();

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
        this._mementosCatWindow.setHandler('ok', this.onMementosCatOk.bind(this));
        this._mementosCatWindow.setHandler('cancel', this.onMementosCancel.bind(this));
        this.addWindow(this._mementosCatWindow);
        this._mementosCatWindow.hide(); 
        this._mementosCatWindow.deactivate();
    };

    Scene_Map.prototype.createMementosItemList = function() {
        const w = 300; 
        const x = Graphics.boxWidth - w - MENU_MARGIN_X; 
        const y = this._mementosCatWindow.y; 
        const h = this.calcWindowHeight(4, true); 
        
        this._mementosItemWindow = new Window_MementosItemList(new Rectangle(x, y, w, h));
        this._mementosItemWindow.setHandler('ok', this.onMementosItemOk.bind(this));
        this._mementosItemWindow.setHandler('cancel', this.onMementosItemCancel.bind(this));
        this.addWindow(this._mementosItemWindow);
        this._mementosItemWindow.hide();
        this._mementosItemWindow.deactivate();
    };

    Scene_Map.prototype.createMementosActionWindow = function() {
        const w = 200;
        const h = this.calcWindowHeight(2, true);
        
        // Fix: Zero Y-margin between List and Action window, exact X-alignment with Submenu
        const x = this._mementosCatWindow.x; 
        const y = this._mementosItemWindow.y + this._mementosItemWindow.height; 
        
        this._mementosActionWindow = new Window_MementosAction(new Rectangle(x, y, w, h));
        this._mementosActionWindow.setHandler('use', this.onMementosActionUse.bind(this));
        this._mementosActionWindow.setHandler('trash', this.onMementosActionTrash.bind(this));
        this._mementosActionWindow.setHandler('cancel', this.onMementosActionCancel.bind(this));
        this.addWindow(this._mementosActionWindow);
        this._mementosActionWindow.hide();
        this._mementosActionWindow.deactivate();
    };

    Scene_Map.prototype.createMementosConfirmWindow = function() {
        const w = 200;
        const h = this.calcWindowHeight(2, true); // Fix: Exact height for 2 rows (header + horizontal choices)
        
        // Fix: Zero X-margin between Action window and Confirm window
        const x = this._mementosActionWindow.x + this._mementosActionWindow.width; 
        const y = this._mementosActionWindow.y; 
        
        this._mementosConfirmWindow = new Window_MementosConfirm(new Rectangle(x, y, w, h));
        this._mementosConfirmWindow.setHandler('yes', this.onMementosConfirmYes.bind(this));
        this._mementosConfirmWindow.setHandler('no', this.onMementosConfirmCancel.bind(this));
        this._mementosConfirmWindow.setHandler('cancel', this.onMementosConfirmCancel.bind(this));
        this.addWindow(this._mementosConfirmWindow);
        this._mementosConfirmWindow.hide();
        this._mementosConfirmWindow.deactivate();
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
        $gameTemp.mementosUseMode = false;
        
        this._commandWindow.hide();
        this._commandWindow.deactivate();
        this._statusWindow.hide();
        this._statusWindow.deactivate();
        this._mementosCatWindow.hide();
        this._mementosCatWindow.deactivate();
        this._mementosItemWindow.hide();
        this._mementosItemWindow.deactivate();
        this._mementosActionWindow.hide();
        this._mementosActionWindow.deactivate();
        this._mementosConfirmWindow.hide();
        this._mementosConfirmWindow.deactivate();
    };

    Scene_Map.prototype.commandPersonal = function() {
        this._statusWindow.show();
        this._statusWindow.activate();
        this._statusWindow.select(0); 
    };

    Scene_Map.prototype.onPersonalCancel = function() {
        this._statusWindow.deselect(); 
        this._statusWindow.deactivate();
        if ($gameTemp.mementosUseMode) {
            $gameTemp.mementosUseMode = false;
            this._mementosActionWindow.activate();
        } else {
            this._commandWindow.activate();
        }
    };

    Scene_Map.prototype.commandMementos = function() {
        hijackHUDMakerNode(SceneManager._scene, HMU_MEMENTOS_GROUP);

        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
        this._mementosCatWindow.show();
        this._mementosCatWindow.activate();
        this._mementosCatWindow.select(0); 
    };

    Scene_Map.prototype.onMementosCatOk = function() {
        this._mementosItemWindow.setCategory(this._mementosCatWindow.currentSymbol());
        this._mementosItemWindow.show();
        this._mementosItemWindow.activate();
        this._mementosItemWindow.select(0);
    };

    Scene_Map.prototype.onMementosCancel = function() {
        this._mementosCatWindow.hide();
        this._mementosCatWindow.deactivate();
        this._commandWindow.activate();
    };

    Scene_Map.prototype.onMementosItemOk = function() {
        const item = this._mementosItemWindow.item();
        if (item) {
            this._mementosActionWindow.setItem(item);
            this._mementosActionWindow.show();
            this._mementosActionWindow.activate();
            this._mementosActionWindow.select(0);
        } else {
            this._mementosItemWindow.activate();
        }
    };

    Scene_Map.prototype.onMementosItemCancel = function() {
        this._mementosItemWindow.hide();
        this._mementosItemWindow.deactivate();
        this._mementosCatWindow.activate();
    };

    Scene_Map.prototype.onMementosActionUse = function() {
        $gameTemp.mementosUseMode = true; 
        this._statusWindow.activate();
        this._statusWindow.select(0);
    };

    Scene_Map.prototype.onMementosActionTrash = function() {
        this._mementosConfirmWindow.show();
        this._mementosConfirmWindow.activate();
        this._mementosConfirmWindow.select(0);
    };

    Scene_Map.prototype.onMementosActionCancel = function() {
        this._mementosActionWindow.hide();
        this._mementosActionWindow.deactivate();
        this._mementosItemWindow.activate();
    };

    Scene_Map.prototype.onMementosConfirmYes = function() {
        const item = this._mementosActionWindow._item;
        if (item) {
            SoundManager.playShop(); 
            $gameParty.loseItem(item, 1);
            this._mementosItemWindow.refresh();
            this._mementosActionWindow.refresh();
        }
        this._mementosConfirmWindow.hide();
        this._mementosConfirmWindow.deactivate();
        this._mementosActionWindow.hide();
        this._mementosItemWindow.activate();
    };

    Scene_Map.prototype.onMementosConfirmCancel = function() {
        this._mementosConfirmWindow.hide();
        this._mementosConfirmWindow.deactivate();
        this._mementosActionWindow.activate();
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
        
        if ($gameTemp.mementosUseMode) {
            const item = this._mementosActionWindow._item;
            const action = new Game_Action(actor);
            action.setItemObject(item);
            
            if (action.testApply(actor)) {
                action.apply(actor);
                $gameParty.loseItem(item, 1);
                SoundManager.playUseItem();
                this._mementosItemWindow.refresh();
                this._mementosActionWindow.refresh();
                this._statusWindow.refresh();
                
                if ($gameParty.numItems(item) === 0) {
                    $gameTemp.mementosUseMode = false;
                    this._statusWindow.deselect();
                    this._mementosActionWindow.hide();
                    this._mementosItemWindow.activate();
                } else {
                    this._statusWindow.activate(); 
                }
            } else {
                SoundManager.playBuzzer();
                this._statusWindow.activate();
            }
        } else {
            $gameTemp.menuSelectedActorIndex = actorIndex;
            this._statusWindow.deselect();
            this._commandWindow.activate();
        }
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
        $gameTemp.hudShowMementosList = !!(this._mementosItemWindow && this._mementosItemWindow.visible);
        $gameTemp.hudShowMementosAction = !!(this._mementosActionWindow && this._mementosActionWindow.visible);
        $gameTemp.hudShowMementosConfirm = !!(this._mementosConfirmWindow && this._mementosConfirmWindow.visible);

        if (this._mementosItemWindow && this._mementosItemWindow.active) {
            const item = this._mementosItemWindow.item();
            $gameTemp.mementosItemName = item ? item.name : "";
            $gameTemp.mementosItemDesc = item ? item.description : "";
            $gameTemp.mementosItemAmount = item ? $gameParty.numItems(item) : 0;
        } else if (!this._mementosItemWindow || !this._mementosItemWindow.visible) {
            $gameTemp.mementosItemName = "";
            $gameTemp.mementosItemDesc = "";
            $gameTemp.mementosItemAmount = 0;
        }
    };

})();