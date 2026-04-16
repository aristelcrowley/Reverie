/*:
@target MZ
@plugindesc Reverie - Complete Main Menu UI Override (ONLY SKELETON HERE, THE ACTUAL UI WAS MADE VIA SRD HUD MAKER ULTRA)
@author Aristel
*/

(() => {
    const DEBUG_MODE = true; 

    const CURSOR_IMAGE_NAME = "FingerCursor";
    const CURSOR_NATIVE_SIZE = 14; 
    const CURSOR_DRAW_SIZE = 28;

    Scene_Map.prototype.createMenuButton = function() {}; 
    Scene_MenuBase.prototype.createCancelButton = function() {}; 
    Scene_MenuBase.prototype.createButtonAssistWindow = function() {};

    const _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.call(this);
        if (this._helpWindow) this._helpWindow.visible = false;
    };

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

        windowClass.prototype._refreshCursor = function() {
            if (this._cursorSprite) this._cursorSprite.visible = false;
        };
    };

    applySkeletonStyle(Window_MenuCommand);
    applySkeletonStyle(Window_MenuStatus);
    applySkeletonStyle(Window_Gold);

    const customDrawItemWithCursor = function(index) {
        const rect = this.itemLineRect(index);
        this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
        
        const name = this.commandName(index);
        this.changePaintOpacity(this.isCommandEnabled(index));

        const textWidth = this.textWidth(name);
        const textX = rect.x + (rect.width / 2) - (textWidth / 2);
        
        if (DEBUG_MODE) {
            this.drawText(name, textX, rect.y, textWidth, 'left');
        }

        if (this.index() === index) {
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
    // TOP MENU 
    // =======================================================
    Scene_Menu.prototype.commandWindowRect = function() {
        return new Rectangle(0, 0, Graphics.boxWidth, this.calcWindowHeight(1, true));
    };

    Window_MenuCommand.prototype.maxCols = function() { return 4; }; 
    Window_MenuCommand.prototype.numVisibleRows = function() { return 1; }; 

    Window_MenuCommand.prototype.makeCommandList = function() {
        this.addCommand("Equip", 'equip');
        this.addCommand("Mindset", 'mindset');   
        this.addCommand("Mementos", 'mementos'); 
        this.addCommand("Options", 'options');
    };

    Window_MenuCommand.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuCommand.prototype.select = customSelectRefresh;

    // =======================================================
    // BOTTOM ACTOR CARDS
    // =======================================================
    Scene_Menu.prototype.statusWindowRect = function() {
        const height = 240; 
        return new Rectangle(0, Graphics.boxHeight - height, Graphics.boxWidth, height);
    };

    Window_MenuStatus.prototype.maxCols = function() { return 4; }; 
    Window_MenuStatus.prototype.numVisibleRows = function() { return 1; }; 

    Window_MenuStatus.prototype.itemRect = function(index) {
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        const x = col * itemWidth + colSpacing / 2;
        const y = row * itemHeight + rowSpacing / 2;
        return new Rectangle(x, y, itemWidth - colSpacing, itemHeight - rowSpacing);
    };

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

    Scene_Menu.prototype.goldWindowRect = function() { return new Rectangle(-1000, -1000, 0, 0); };

    // =======================================================
    // MEMENTOS SUBMENU
    // =======================================================
    function Window_MenuMementosCat() {
        this.initialize(...arguments);
    }
    Window_MenuMementosCat.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MenuMementosCat.prototype.constructor = Window_MenuMementosCat;

    applySkeletonStyle(Window_MenuMementosCat);

    Window_MenuMementosCat.prototype.maxCols = function() { return 3; };
    Window_MenuMementosCat.prototype.makeCommandList = function() {
        this.addCommand("Snacks", 'snacks');
        this.addCommand("Toys", 'toys');
        this.addCommand("Important", 'important');
    };
    Window_MenuMementosCat.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuMementosCat.prototype.select = customSelectRefresh;

    // =======================================================
    // MINDSET SUBMENU (SKILL / BOND)
    // =======================================================
    function Window_MenuMindsetCat() {
        this.initialize(...arguments);
    }
    Window_MenuMindsetCat.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MenuMindsetCat.prototype.constructor = Window_MenuMindsetCat;

    applySkeletonStyle(Window_MenuMindsetCat);

    Window_MenuMindsetCat.prototype.maxCols = function() { return 2; };
    Window_MenuMindsetCat.prototype.makeCommandList = function() {
        this.addCommand("Skill", 'skill');
        this.addCommand("Bond", 'bond');
    };
    Window_MenuMindsetCat.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuMindsetCat.prototype.select = customSelectRefresh;


    // =======================================================
    // WIRING IT ALL TOGETHER
    // =======================================================
    const _Scene_Menu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _Scene_Menu_create.call(this);
        this.createMementosSubWindow();
        this.createMindsetSubWindow(); // Create the new window!
    };

    Scene_Menu.prototype.createMementosSubWindow = function() {
        const topMenuHeight = this.calcWindowHeight(1, true);
        const w = Graphics.boxWidth * 0.55; 
        const h = topMenuHeight;
        const rect = new Rectangle(0, topMenuHeight, w, h);
        
        this._mementosCatWindow = new Window_MenuMementosCat(rect);
        this._mementosCatWindow.setHandler('cancel', this.onMementosCancel.bind(this));
        
        this.addWindow(this._mementosCatWindow);
        this._mementosCatWindow.hide(); 
        this._mementosCatWindow.deactivate();
    };

    Scene_Menu.prototype.createMindsetSubWindow = function() {
        const topMenuHeight = this.calcWindowHeight(1, true);
        const w = Graphics.boxWidth * 0.40; // Slightly narrower because it only has 2 options
        const h = topMenuHeight;
        const rect = new Rectangle(0, topMenuHeight, w, h);
        
        this._mindsetCatWindow = new Window_MenuMindsetCat(rect);
        // Pressing Cancel goes back to Character Selection, NOT the top menu!
        this._mindsetCatWindow.setHandler('cancel', this.onMindsetCancel.bind(this));
        
        this.addWindow(this._mindsetCatWindow);
        this._mindsetCatWindow.hide(); 
        this._mindsetCatWindow.deactivate();
    };

    Scene_Menu.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_MenuCommand(rect);
        
        this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('mindset', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('mementos', this.commandMementos.bind(this));
        this._commandWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Menu.prototype.commandMementos = function() {
        this._mementosCatWindow.show();
        this._mementosCatWindow.activate();
        this._mementosCatWindow.select(0); 
    };

    Scene_Menu.prototype.onMementosCancel = function() {
        this._mementosCatWindow.hide();
        this._mementosCatWindow.deactivate();
        this._commandWindow.activate();
    };

    Scene_Menu.prototype.onMindsetCancel = function() {
        this._mindsetCatWindow.hide();
        this._mindsetCatWindow.deactivate();
        this._statusWindow.activate(); // Bounce back to the bottom cards
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

    Scene_Menu.prototype.onPersonalOkCustom = function() {
        const symbol = this._commandWindow.currentSymbol();
        $gameTemp.menuSelectedActorIndex = this._statusWindow.index();

        if (symbol === 'equip') {
            $gameTemp.isEquipMenuOpen = true; 
            // Equip menu doesn't have a sub-menu, so we will open the item lists here next!
            this._statusWindow.deselect();
            this._commandWindow.activate();
        } else if (symbol === 'mindset') {
            $gameTemp.isMindsetMenuOpen = true; 
            // Show the Skill/Bond submenu!
            this._mindsetCatWindow.show();
            this._mindsetCatWindow.activate();
            this._mindsetCatWindow.select(0);
        }
    };

    // =======================================================
    // HUD MAKER ULTRA TRACKING BRIDGE
    // =======================================================
    const _Scene_Menu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
        _Scene_Menu_update.call(this);
        $gameTemp.isTopMenuActive = this._commandWindow.active;
        $gameTemp.menuTopIndex = this._commandWindow.index();
        
        $gameTemp.isSelectingActor = this._statusWindow.active;
        $gameTemp.menuActorIndex = this._statusWindow.index();

        $gameTemp.isMementosCatActive = this._mementosCatWindow.active;
        $gameTemp.mementosCatIndex = this._mementosCatWindow.index();

        // Track the Mindset Submenu for HUD Maker!
        $gameTemp.isMindsetCatActive = this._mindsetCatWindow.active;
        $gameTemp.mindsetCatIndex = this._mindsetCatWindow.index();
    };

})();