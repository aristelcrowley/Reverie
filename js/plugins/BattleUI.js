/*:
 * @target MZ
 * @plugindesc Complete Battle UI Override
 * @author Custom
 */
(() => {
    const CUSTOM_FONT = "Comic Sans MS, sans-serif"; 
    const CUSTOM_FONT_SIZE = 30; 
    const SMALL_FONT_SIZE = 18; 
    const CURSOR_SYMBOL = "👉"; 
    const CHAOTIC_COLORS = ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93", "#ff924c"];

    function cleanText(text) {
        if (!text) return "";
        return text.replace(/\\[a-zA-Z]+\[.*?\]/g, '') 
                   .replace(/[\x00-\x1F\x7F-\x9F]/g, '') 
                   .replace(/I\[\d+\]/g, '') 
                   .trim();
    }

    Window_Base.prototype.autoWrapText = function(text, maxWidth) {
        if (!text) return "";
        text = text.replace(/[\r\n]+/g, ' '); 
        this.resetFontSettings(); 
        const words = text.split(' ');
        let wrappedText = "";
        let currentLine = "";

        for (let i = 0; i < words.length; i++) {
            let testLine = currentLine + words[i] + " ";
            if (this.textWidth(testLine) > maxWidth && i > 0) {
                wrappedText += currentLine.trim() + "\n";
                currentLine = words[i] + " ";
            } else {
                currentLine = testLine;
            }
        }
        wrappedText += currentLine.trim();
        return wrappedText;
    };

    const _Window_Help_setText = Window_Help.prototype.setText;
    Window_Help.prototype.setText = function(text) {
        if (text) {
            this.resetFontSettings();
            text = this.autoWrapText(text, this.contentsWidth() - 20);
        }
        _Window_Help_setText.call(this, text);
    };

    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        
        if ($gameParty && $gameVariables) {
            const activeActor = BattleManager.actor();
            $gameVariables.setValue(101, activeActor ? activeActor.actorId() : 0);
            
            if (this._actorWindow && this._actorWindow.active && this._actorWindow.actor()) {
                $gameVariables.setValue(102, this._actorWindow.actor().actorId());
            } else {
                $gameVariables.setValue(102, 0);
            }
        }
    };

    const applyBlackBox = function(windowClass) {
        const _initialize = windowClass.prototype.initialize;
        windowClass.prototype.initialize = function(rect) {
            _initialize.call(this, rect);
            this.frameVisible = false; 
            this.opacity = 0; 
            
            this._customBlackBg = new Sprite(new Bitmap(rect.width, rect.height));
            this._customBlackBg.bitmap.fillRect(0, 0, rect.width, rect.height, 'rgba(0, 0, 0, 0.95)');
            this.addChildToBack(this._customBlackBg);
        };
    };

    Scene_Battle.prototype.startPartyCommandSelection = function() {
        this.selectNextCommand(); 
    };

    const _Scene_Battle_createActorCommandWindow = Scene_Battle.prototype.createActorCommandWindow;
    Scene_Battle.prototype.createActorCommandWindow = function() {
        _Scene_Battle_createActorCommandWindow.call(this);
        this._actorCommandWindow.setHandler("cancel", null); 
        this._actorCommandWindow.setHelpWindow(this._helpWindow);
    };

    Scene_Battle.prototype.createCancelButton = function() {};

    const topBoxRect = function() {
        const w = Graphics.boxWidth * 0.60; 
        const x = (Graphics.boxWidth - w) / 2;
        return new Rectangle(x, 0, w, 120); 
    };

    Scene_Battle.prototype.helpWindowRect = topBoxRect;
    Scene_Battle.prototype.logWindowRect = topBoxRect;

    applyBlackBox(Window_Help);
    applyBlackBox(Window_BattleLog);

    Window_BattleLog.prototype.maxLines = function() { return 3; }; 
    Window_BattleLog.prototype.resetFontSettings = function() {
        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = SMALL_FONT_SIZE;
        this.contents.outlineColor = 'rgba(0,0,0,1)';
        this.contents.outlineWidth = 4;
        this.contents.textColor = '#ffffff';
    };

    Window_Help.prototype.resetFontSettings = function() {
        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = SMALL_FONT_SIZE;
        this.contents.outlineColor = 'rgba(0,0,0,1)';
        this.contents.outlineWidth = 4;
        this.contents.textColor = '#ffffff';
    };

    const _Window_ActorCommand_initialize = Window_ActorCommand.prototype.initialize; 
    Window_ActorCommand.prototype.initialize = function(rect) {
        _Window_ActorCommand_initialize.call(this, rect); 
        this.opacity = 0; 
    };

    Window_ActorCommand.prototype.maxCols = function() { return 2; };
    Window_ActorCommand.prototype.numVisibleRows = function() { return 3; };
    Window_ActorCommand.prototype.drawItemBackground = function(index) {}; 
    Window_ActorCommand.prototype.refreshCursor = function() { this.setCursorRect(0, 0, 0, 0); }; 

    const _Window_ActorCommand_select = Window_ActorCommand.prototype.select;
    Window_ActorCommand.prototype.select = function(index) {
        const lastIndex = this.index();
        _Window_ActorCommand_select.call(this, index);
        
        if (this.index() !== lastIndex) {
            if (lastIndex >= 0) this.redrawItem(lastIndex); 
            if (this.index() >= 0) this.redrawItem(this.index()); 
        }

        if (this.active && SceneManager._scene && SceneManager._scene._helpWindow) {
            const helpWin = SceneManager._scene._helpWindow;
            helpWin.show(); 
            let commandName = this.commandName(this.index());
            if (commandName) {
                commandName = cleanText(commandName);
                let desc = "Select an action.";
                if (commandName.includes("Attack")) desc = "Perform a standard state-based element attack against a targeted enemy.";
                else if (commandName.includes("Skill")) desc = "Use a character-specific skill.";
                else if (commandName.includes("Bond")) desc = "Use a cooperative bond ability to assist an ally.";
                else if (commandName.includes("Guard")) desc = "Defend to reduce incoming damage this turn.";
                else if (commandName.includes("Mementos")) desc = "Use a consumable mementos from the party's shared inventory.";
                else if (commandName.includes("Escape")) desc = "Attempt to flee from battle and return to safety.";
                
                helpWin.resetFontSettings();
                let wrappedDesc = helpWin.autoWrapText(desc, helpWin.contentsWidth() - 20);
                if (helpWin._text !== wrappedDesc) {
                    helpWin.setText(wrappedDesc);
                }
            }
        }
    };

    Window_ActorCommand.prototype.drawItem = function(index) {
        if (!this._list || !this._list[index]) return;

        const rect = this.itemLineRect(index);
        
        this.contents.clearRect(rect.x, rect.y - 4, rect.width, rect.height + 8);

        const boxColor = CHAOTIC_COLORS[index % CHAOTIC_COLORS.length];
        this.contents.fillRect(rect.x + 2, rect.y + 2, rect.width - 4, rect.height - 4, boxColor);

        let cleanName = cleanText(this.commandName(index));
        let enabled = this.isCommandEnabled(index);

        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = CUSTOM_FONT_SIZE;
        this.contents.textColor = "#ffffff"; 
        this.contents.outlineColor = "rgba(0, 0, 0, 0.9)";
        this.contents.outlineWidth = 5;
        this.changePaintOpacity(enabled);

        let jitterY = (index % 2 === 0) ? -3 : 3;

        if (this.index() === index) {
            cleanName = CURSOR_SYMBOL + " " + cleanName;
            jitterY = 0; 
        }

        this.drawText(cleanName, rect.x, rect.y + jitterY, rect.width, 'center');
    };

    const _Scene_Battle_actorCommandWindowRect = Scene_Battle.prototype.actorCommandWindowRect;
    Scene_Battle.prototype.actorCommandWindowRect = function() {
        const w = Graphics.boxWidth * 0.6; 
        const h = this.calcWindowHeight(3, true); 
        const x = (Graphics.boxWidth - w) / 2;
        const y = Graphics.boxHeight - h - 10;
        return new Rectangle(x, y, w, h);
    };

    const setupSubMenu = function(windowClass) {
        applyBlackBox(windowClass); 

        windowClass.prototype.maxCols = function() { return 2; };
        windowClass.prototype.numVisibleRows = function() { return 2; }; 
        windowClass.prototype.drawItemBackground = function(index) {}; 
        windowClass.prototype.refreshCursor = function() { this.setCursorRect(0, 0, 0, 0); }; 

        windowClass.prototype._updateArrows = function() {
            this.downArrowVisible = false;
            this.upArrowVisible = false;
        };

        windowClass.prototype.cursorDown = function(wrap) { Window_Selectable.prototype.cursorDown.call(this, true); };
        windowClass.prototype.cursorUp = function(wrap) { Window_Selectable.prototype.cursorUp.call(this, true); };
        windowClass.prototype.cursorRight = function(wrap) { Window_Selectable.prototype.cursorRight.call(this, true); };
        windowClass.prototype.cursorLeft = function(wrap) { Window_Selectable.prototype.cursorLeft.call(this, true); };

        const _calcWindowHeight = windowClass.prototype.calcWindowHeight;
        windowClass.prototype.calcWindowHeight = function(numLines, selectable) {
            return _calcWindowHeight.call(this, numLines, selectable) + 70; 
        };

        // Track which "page" of items we're showing (each page = 4 items in 2x2)
        windowClass.prototype.currentTopRow = function() {
            if (this._customTopRow === undefined) this._customTopRow = 0;
            return this._customTopRow;
        };

        windowClass.prototype.setCurrentTopRow = function(row) {
            this._customTopRow = Math.max(0, row);
        };

        // Override itemRect to position items relative to our custom top row, not scroll
        windowClass.prototype.itemRect = function(index) {
            const maxCols = this.maxCols();
            const itemWidth = this.itemWidth();
            const itemHeight = this.itemHeight();
            const colSpacing = this.colSpacing();
            const rowSpacing = this.rowSpacing();
            const col = index % maxCols;
            const row = Math.floor(index / maxCols);
            // Position relative to our custom top row
            const displayRow = row - this.currentTopRow();
            const x = col * itemWidth + colSpacing / 2;
            const y = displayRow * itemHeight + rowSpacing / 2 + 70;
            const width = itemWidth - colSpacing;
            const height = itemHeight - rowSpacing;
            return new Rectangle(x, y, width, height);
        };

        // Only draw items that should be visible based on current top row
        windowClass.prototype.drawAllItems = function() {
            this.contents.clear();
            this.drawHeader();
            
            const topRow = this.currentTopRow();
            const maxCols = this.maxCols();
            const visibleRows = this.numVisibleRows();
            const startIndex = topRow * maxCols;
            const endIndex = Math.min(startIndex + (visibleRows * maxCols), this.maxItems());
            
            for (let i = startIndex; i < endIndex; i++) {
                this.drawItem(i);
            }
        };

        windowClass.prototype.drawHeader = function() {
            // Clear header area before redrawing to prevent stacking
            this.contents.clearRect(0, 0, this.contentsWidth(), 56);
            this.contents.fillRect(0, 58, this.contentsWidth(), 4, '#ffffff'); 
            
            const item = this.item();
            if (!item) return;
            
            this.contents.fontFace = CUSTOM_FONT;
            this.contents.fontSize = 24;
            this.contents.textColor = '#ffffff';
            this.contents.outlineColor = 'rgba(0,0,0,1)';
            this.contents.outlineWidth = 4;
            
            let text = "";
            if (DataManager.isItem(item)) {
                text = "Hold: " + $gameParty.numItems(item) + " x";
            } else if (DataManager.isSkill(item)) {
                let cost = item.mpCost > 0 ? item.mpCost + " SP" : (item.tpCost > 0 ? item.tpCost + " TP" : "0 SP");
                text = "Cost: " + cost;
            }
            this.drawText(text, 0, 10, this.contentsWidth(), 'center');
        };

        windowClass.prototype.drawItem = function(index) {
            const item = this.itemAt(index);
            if (!item) return;

            const rect = this.itemLineRect(index);
            
            // Skip if this item would be drawn outside visible area
            if (rect.y < 60 || rect.y > this.contentsHeight()) return;
            
            this.contents.clearRect(rect.x, rect.y - 4, rect.width, rect.height + 8);

            let cleanName = cleanText(item.name);

            this.contents.fontFace = CUSTOM_FONT;
            this.contents.fontSize = CUSTOM_FONT_SIZE - 6;
            this.contents.textColor = "#ffffff"; 
            this.contents.outlineColor = "rgba(0, 0, 0, 0.9)";
            this.contents.outlineWidth = 4;
            this.changePaintOpacity(this.isEnabled(item));

            if (this.index() === index) {
                cleanName = CURSOR_SYMBOL + " " + cleanName;
            }

            this.drawText(cleanName, rect.x, rect.y, rect.width, 'center'); 
        };

        const _select = windowClass.prototype.select;
        windowClass.prototype.select = function(index) {
            const lastIndex = this.index();
            _select.call(this, index);
            
            // Calculate which row the selected index is on
            const currentRow = Math.floor(index / this.maxCols());
            const visibleRows = this.numVisibleRows();
            const topRow = this.currentTopRow();
            const bottomRow = topRow + visibleRows - 1;
            
            let needsFullRefresh = false;
            
            // If selection moved outside visible rows, snap to new page
            if (currentRow < topRow) {
                this.setCurrentTopRow(currentRow);
                needsFullRefresh = true;
            } else if (currentRow > bottomRow) {
                this.setCurrentTopRow(currentRow - visibleRows + 1);
                needsFullRefresh = true;
            }
            
            if (needsFullRefresh) {
                this.refresh();
            } else {
                this.drawHeader();
                if (this.index() !== lastIndex) {
                    if (lastIndex >= 0) this.redrawItem(lastIndex); 
                    if (this.index() >= 0) this.redrawItem(this.index()); 
                }
            }
        };

        // Reset top row when window activates/refreshes
        const _refresh = windowClass.prototype.refresh;
        windowClass.prototype.refresh = function() {
            // Ensure top row is valid for current selection
            if (this.index() >= 0) {
                const currentRow = Math.floor(this.index() / this.maxCols());
                const visibleRows = this.numVisibleRows();
                const topRow = this.currentTopRow();
                const bottomRow = topRow + visibleRows - 1;
                if (currentRow < topRow || currentRow > bottomRow) {
                    this.setCurrentTopRow(Math.max(0, currentRow - visibleRows + 1));
                }
            }
            _refresh.call(this);
        };

        // Disable scroll-related methods completely
        windowClass.prototype.smoothScrollTo = function(x, y) {};
        windowClass.prototype.processWheelScroll = function() {};
        windowClass.prototype.overallHeight = function() { 
            return this.innerHeight; 
        };
    };

    setupSubMenu(Window_BattleSkill);
    setupSubMenu(Window_BattleItem);

    const gridRectSub = function() {
        const w = Graphics.boxWidth * 0.6; 
        const h = this.calcWindowHeight(2, true) + 70; 
        const x = (Graphics.boxWidth - w) / 2;
        const y = Graphics.boxHeight - h - 10;
        return new Rectangle(x, y, w, h);
    };
    Scene_Battle.prototype.skillWindowRect = gridRectSub;
    Scene_Battle.prototype.itemWindowRect = gridRectSub;

    const setupInvisibleTarget = function(windowClass) {
        const _initialize = windowClass.prototype.initialize;
        windowClass.prototype.initialize = function(rect) {
            _initialize.call(this, rect);
            this.opacity = 0;
            this.frameVisible = false;
        };
        windowClass.prototype.drawItemBackground = function(index) {};
        windowClass.prototype.refreshCursor = function() { this.setCursorRect(0, 0, 0, 0); };
        windowClass.prototype.drawItem = function(index) {}; 
    };

    setupInvisibleTarget(Window_BattleEnemy);
    setupInvisibleTarget(Window_BattleActor);

    Window_BattleEnemy.prototype.updateHelp = function() {
        if (this._helpWindow && this.enemy()) {
            this._helpWindow.setText("⚔️ Target: " + cleanText(this.enemy().name()));
        }
    };

    Window_BattleActor.prototype.updateHelp = function() {
        if (this._helpWindow && this.actor()) {
            this._helpWindow.setText("💚 Target: " + cleanText(this.actor().name()));
        }
    };

    const targetRect = function() {
        return new Rectangle(0, Graphics.boxHeight - 200, Graphics.boxWidth, 200);
    };

    Scene_Battle.prototype.enemyWindowRect = targetRect;
    Scene_Battle.prototype.actorWindowRect = targetRect;

})();