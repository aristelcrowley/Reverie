/*:

@target MZ

@plugindesc Reverie - Complete Battle UI Override (other override hud was made using HUD Maker Ultra, not in this plugin)

@help must be placed under VisuMZ_0_CoreEngine and VisuMZ_1_BattleCore for proper functionality

@author Aristel
*/

(() => {
const CUSTOM_FONT = '"BattleUIFont", sans-serif';
const SMALL_FONT_SIZE = 20;

const CURSOR_SYMBOL = "👉"; 

FontManager.load("BattleUIFont", "KleeOne-SemiBold.ttf");

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
    const windowHeight = 135; 
    return new Rectangle(x, 0, w, windowHeight); 
};

Scene_Battle.prototype.helpWindowRect = topBoxRect;
Scene_Battle.prototype.logWindowRect = topBoxRect;

applyBlackBox(Window_Help);
applyBlackBox(Window_BattleLog);

Window_BattleLog.prototype.lineHeight = function() { return 28; }; 
Window_BattleLog.prototype.maxLines = function() { return 4; }; 

Window_BattleLog.prototype.resetFontSettings = function() {
    this.contents.fontFace = CUSTOM_FONT;
    this.contents.fontSize = 20;
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
Window_ActorCommand.prototype.lineHeight = function() { return 36; };
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

    let cleanName = cleanText(this.commandName(index));
    let enabled = this.isCommandEnabled(index);
    let isSelected = (this.index() === index);

    const bx = rect.x + 2;
    const by = rect.y + 2;
    const bw = rect.width - 4;
    const bh = rect.height - 4;

    const bgColor = isSelected ? '#ffffff' : '#000000';
    const textColor = isSelected ? '#000000' : '#ffffff';

    this.contents.fillRect(bx, by, bw, bh, bgColor);
    this.contents.fillRect(bx, by, bw, 3, '#ffffff'); 
    this.contents.fillRect(bx, by + bh - 3, bw, 3, '#ffffff'); 
    this.contents.fillRect(bx, by, 3, bh, '#ffffff'); 
    this.contents.fillRect(bx + bw - 3, by, 3, bh, '#ffffff'); 

    this.contents.fontFace = CUSTOM_FONT;
    this.contents.fontSize = 26;
    this.contents.textColor = textColor; 
    this.contents.outlineColor = 'rgba(0,0,0,1)';
    this.contents.outlineWidth = isSelected ? 0 : 4; 
    this.changePaintOpacity(enabled);

    this.drawText(cleanName, rect.x, rect.y, rect.width, 'center');
};

const _Scene_Battle_actorCommandWindowRect = Scene_Battle.prototype.actorCommandWindowRect;
Scene_Battle.prototype.actorCommandWindowRect = function() {
    const w = Graphics.boxWidth * 0.6; 
    const h = this.calcWindowHeight(3, true); 
    const x = (Graphics.boxWidth - w) / 2;
    const y = Graphics.boxHeight - h - 25; 
    return new Rectangle(x, y, w, h);
};

Window_ActorCommand.prototype.innerHeight = function() {
    return Math.max(0, this.height - this.padding * 2);
};

const setupSubMenu = function(windowClass) {
    applyBlackBox(windowClass); 

    const _initialize = windowClass.prototype.initialize;
    windowClass.prototype.initialize = function(rect) {
        _initialize.call(this, rect);
        this._headerSprite = new Sprite(new Bitmap(rect.width, 70));
        this.addChild(this._headerSprite);
        this._headerSprite.bitmap.fillRect(0, 58, rect.width, 4, '#ffffff');
    };

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

    windowClass.prototype.currentTopRow = function() {
        if (this._customTopRow === undefined) this._customTopRow = 0;
        return this._customTopRow;
    };

    windowClass.prototype.setCurrentTopRow = function(row) {
        this._customTopRow = Math.max(0, row);
    };

    windowClass.prototype.itemRect = function(index) {
        const maxCols = this.maxCols();
        const itemWidth = this.itemWidth();
        const itemHeight = this.itemHeight();
        const colSpacing = this.colSpacing();
        const rowSpacing = this.rowSpacing();
        const col = index % maxCols;
        const row = Math.floor(index / maxCols);
        const displayRow = row - this.currentTopRow();
        const x = col * itemWidth + colSpacing / 2;
        const y = displayRow * itemHeight + rowSpacing / 2 + 70;
        const width = itemWidth - colSpacing;
        const height = itemHeight - rowSpacing;
        return new Rectangle(x, y, width, height);
    };

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
        this.contents.clearRect(0, 0, this.contentsWidth(), 56);
        
        const item = this.item();
        if (!item) return;
        
        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = 18;
        this.contents.textColor = '#ffffff';
        this.contents.outlineColor = 'rgba(0,0,0,1)';
        this.contents.outlineWidth = 4;
        
        let text = "";
        if (DataManager.isItem(item)) {
            text = "Hold: " + $gameParty.numItems(item) + " x";
        } else if (DataManager.isSkill(item)) {
            let cost = item.mpCost > 0 ? item.mpCost + " MP" : (item.tpCost > 0 ? item.tpCost + " TP" : "0 MP");
            text = "Cost: " + cost;
        }
        this.drawText(text, 0, 10, this.contentsWidth(), 'center');
    };

    windowClass.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (!item) return;

        const rect = this.itemLineRect(index);
        
        if (rect.y < 60 || rect.y > this.contentsHeight()) return;
        
        this.contents.clearRect(rect.x - 25, rect.y - 4, rect.width + 50, rect.height + 8);

        let cleanName = cleanText(item.name);

        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = 20; 
        
        this.contents.textColor = "#ffffff"; 
        this.contents.outlineColor = "rgba(0, 0, 0, 0.9)";
        this.contents.outlineWidth = 4;
        this.changePaintOpacity(this.isEnabled(item));

        this.drawText(cleanName, rect.x, rect.y, rect.width, 'center'); 

        if (this.index() === index) {
            const textW = this.textWidth(cleanName);
            const cursorW = this.textWidth(CURSOR_SYMBOL) + 10;
            const cursorX = rect.x + (rect.width / 2) - (textW / 2) - cursorW;
            
            this.drawText(CURSOR_SYMBOL, cursorX, rect.y, cursorW + 20, 'left');
        }
    };

    const _select = windowClass.prototype.select;
    windowClass.prototype.select = function(index) {
        const lastIndex = this.index();
        _select.call(this, index);
        
        const currentRow = Math.floor(index / this.maxCols());
        const visibleRows = this.numVisibleRows();
        const topRow = this.currentTopRow();
        const bottomRow = topRow + visibleRows - 1;
        
        let needsFullRefresh = false;
        
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

    const _refresh = windowClass.prototype.refresh;
    windowClass.prototype.refresh = function() {
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

// STOP VISUSTELLA/ENGINE FROM DELETING TEXT
Window_BattleLog.prototype.pushBaseLine = function() {};
Window_BattleLog.prototype.popBaseLine = function() {};

// ======================================================================
// SMOOTH SCROLLING BATTLE LOG (FLICKER-FREE FINAL)
// ======================================================================

// Increase height to accommodate the 5th line during the transition
Window_BattleLog.prototype.contentsHeight = function() {
    return (this.maxLines() + 1) * this.lineHeight(); 
};

// Override refresh to draw EVERY line currently in the array (including the 5th one)
Window_BattleLog.prototype.refresh = function() {
    this.contents.clear();
    for (let i = 0; i < this._lines.length; i++) {
        this.drawLineText(i);
    }
};

const _Window_BattleLog_clear = Window_BattleLog.prototype.clear;
Window_BattleLog.prototype.clear = function() {
    _Window_BattleLog_clear.call(this);
    this._slideUpTimer = 0;
    if (this.origin) this.origin.y = 0; 
};

const _Window_BattleLog_update = Window_BattleLog.prototype.update;
Window_BattleLog.prototype.update = function() {
    _Window_BattleLog_update.call(this);
    
    if (this._slideUpTimer > 0) {
        this._slideUpTimer--;
        
        // Use a smoother ease-out for the progress
        let progress = 1 - (this._slideUpTimer / this._slideUpMax);
        
        if (this.origin) {
            this.origin.y = Math.floor(this.lineHeight() * progress);
        }
        
        if (this._slideUpTimer === 0) {
            while (this._lines.length > this.maxLines()) {
                this._lines.shift();
            }
            if (this.origin) this.origin.y = 0;
            this.refresh(); // Clean up to the standard 4 lines
        }
    }
};

Window_BattleLog.prototype.addText = function(text) {
    if (text && typeof text === 'string') {
        text = text.replace(/<center>/gi, '').replace(/<\/center>/gi, '');
    }
    
    // Safety snap if engine spams text
    if (this._slideUpTimer > 0) {
        this._slideUpTimer = 0;
        while (this._lines.length > this.maxLines()) {
            this._lines.shift();
        }
        if (this.origin) this.origin.y = 0;
    }
    
    this._lines.push(text);
    this.refresh(); // Draw the new text immediately so it exists for the slide
    
    if (this._lines.length > this.maxLines()) {
        this._slideUpMax = 12; 
        this._slideUpTimer = this._slideUpMax;
    }
    
    this.wait(); 
};

// Ensure drawLineText is using the correct coordinates for scrolling
Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.lineRect(index);
    let textToDraw = this._lines[index] || "";
    textToDraw = textToDraw.replace(/<center>/gi, "").replace(/<\/center>/gi, "");
    this.drawTextEx(textToDraw, rect.x + 8, rect.y, rect.width);
};

// CUSTOM BATTLE LOG 
Window_BattleLog.prototype.displayAction = function(subject, item) {
    this.push('clear'); 

    if (subject._martyrBlinded) {
        this.push('addText', cleanText(subject.name()) + " is blinded by self-sacrifice!");
        this.push('wait');
        this.push('wait');
        this.push('wait');
        subject._martyrBlinded = false; // Turn it off so it doesn't accidentally print on their next normal turn
    }

    let targets = BattleManager._targets;
    let targetName = "";
    let target = null;
    
    if (targets && targets.length > 0) {
        target = targets[0]; 
        if (targets.length === 1) {
            targetName = target.name();
        } else {
            targetName = target.isEnemy() ? "the enemies" : "the party";
        }
    } else {
        targetName = "nobody";
    }

    let isFailed = false;
    let sName = item ? item.name.toLowerCase() : "";

    if (item && target) {
        let isElementor = $gameSwitches.value(102);
        let hasUpgraded = target.isStateAffected(6) || target.isStateAffected(7) || target.isStateAffected(8);
        let hasBase = target.isStateAffected(3) || target.isStateAffected(4) || target.isStateAffected(5);
        
        if (sName.includes("project")) {
            if (isElementor || hasUpgraded) isFailed = true;
        } else if (sName.includes("mock") || sName.includes("hype up") || sName.includes("doomscroll")) {
            if (hasUpgraded) isFailed = true;
        } else if (sName.includes("overwhelm")) {
            if (!hasBase) isFailed = true;
        } else if (sName.includes("wake-up call")) {
            if (!target.isStateAffected(8)) isFailed = true;
        } else if (sName.includes("bear hug")) {
            if (!target.isStateAffected(7)) isFailed = true;
        } else if (sName.includes("clinical facts")) {
            if (!target.isStateAffected(6) && !target.isStateAffected(3)) isFailed = true;
        }
    }

    let msg1 = (item && item.message1) ? item.message1 : "";
    let msg2 = (isFailed && item && item.message2) ? item.message2 : "";

    const printCustomMessage = (msg) => {
        if (msg.match(/\{USER\}/i)) {
            msg = msg.replace(/%1\s*/g, "");
        } else {
            msg = msg.replace(/%1/g, cleanText(subject.name()));
        }
        msg = msg.replace(/\{USER\}/gi, cleanText(subject.name()));
        msg = msg.replace(/\{TARGET\}/gi, cleanText(targetName));

        let wrappedMsg = this.autoWrapText(msg, this.contentsWidth() - 20);
        let lines = wrappedMsg.split('\n');
        for (let line of lines) {
            this.push('addText', line);
        }
    };

    if (msg1) {
        printCustomMessage(msg1);
    }
    
    if (msg2) {
        this.push('wait');
        this.push('wait');
        this.push('wait');
        printCustomMessage(msg2);
    }

    if (!isFailed && target && targets.length === 1) {
        let tName = cleanText(target.name());
        if (sName.includes("clinical facts")) {
            let hpAmount = Math.floor(target.mhp * 0.15);
            let mpAmount = Math.floor(target.mmp * 0.15);
            this.push('addText', tName + " recovered " + hpAmount + " HP!");
            this.push('wait'); 
            this.push('wait');
            this.push('wait');
            this.push('addText', tName + " recovered " + mpAmount + " MP!");
        } else if (sName.includes("wake-up call")) {
            let hpAmount = Math.floor(target.mhp * 0.40);
            this.push('addText', tName + " recovered " + hpAmount + " HP!");
        } else if (sName.includes("bear hug")) {
            let mpAmount = Math.floor(target.mmp * 0.40);
            this.push('addText', tName + " recovered " + mpAmount + " MP!");
        }
    }
    
    // STANDARD DELAY FOR ALL ACTIONS
    this.push('wait');
    this.push('wait');
};

// OVERRIDE DAMAGE & RECOVERY FORMATTING
Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push('addText', cleanText(target.name()) + " takes " + target.result().hpDamage + " damage!");
        } else if (target.result().hpDamage < 0) {
            this.push('addText', cleanText(target.name()) + " recovered " + Math.abs(target.result().hpDamage) + " HP!");
        } else {
            this.push('addText', cleanText(target.name()) + " takes 0 damage!");
        }
        this.push('wait');
        this.push('wait');
    }
};

// DYNAMIC EMOTION & REVIVE TRACKER
const _Window_BattleLog_displayChangedStates = Window_BattleLog.prototype.displayChangedStates;
Window_BattleLog.prototype.displayChangedStates = function(target) {
    let isRevived = false;
    if (target.result().removedStateObjects().length > 0) {
        for (let state of target.result().removedStateObjects()) {
            if (state.id === target.deathStateId()) {
                isRevived = true;
            }
        }
    }
    
    if (isRevived) {
        this.push('addText', cleanText(target.name()) + " revived with 50% HP!");
        this.push('wait');
        this.push('wait');
    }
    
    if (target.result().addedStateObjects().length > 0) {
        for (let state of target.result().addedStateObjects()) {
            if (state.id === target.deathStateId()) {
                this.push('addText', cleanText(target.name()) + " fell asleep...");
                this.push('wait');
                this.push('wait');
            } 

            else if (state.id !== target.deathStateId() && state.id !== 2) {
                this.push('addText', cleanText(target.name()) + " becomes " + cleanText(state.name) + "!");
                this.push('wait');
                this.push('wait');
                this.push('wait');
                this.push('wait');
            }
        }
    }
};

Window_BattleLog.prototype.drawLineText = function(index) {
    const rect = this.lineRect(index);
    // (We completely deleted the clearRect line here!)
    
    let textToDraw = this._lines[index] || "";
    textToDraw = textToDraw.replace(/<center>/gi, "").replace(/<\/center>/gi, "");
    
    this.drawTextEx(textToDraw, rect.x + 8, rect.y, rect.width);
};

// CUSTOM DAMAGE REFLECT (DESPAIR TIMING QUEUE)
Window_BattleLog.prototype.performDespairReflect = function(target, damage) {
    if (target.isAlive()) {
        target.setHp(target.hp - damage);
        target.result().clear();
        target.result().hpAffected = true;
        target.result().hpDamage = damage;
        target.startDamagePopup();
        
        if (target.isDead()) {
            target.performCollapse();
        }
        
        // Use our own native UI damage display!
        this.displayHpDamage(target);
    }
}

// DEATH MESSAGE CATCHER (HOOKED TO COLLAPSE ANIMATION)
const _Game_Battler_performCollapse = Game_Battler.prototype.performCollapse;
Game_Battler.prototype.performCollapse = function() {
    // 1. Run the normal collapse animation so the sprite fades out
    _Game_Battler_performCollapse.call(this);
    
    // 2. Guarantee we are in combat and the custom Log Window is ready
    if ($gameParty.inBattle() && BattleManager._logWindow) {
        
        // 3. Clean the name of any hidden VisuStella icon codes
        let cName = this.name().replace(/\\I\[\d+\]/g, '').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
        
        // 4. Print the correct narrative text directly to the log queue!
        if (this.isActor()) {
            BattleManager._logWindow.push('addText', cName + " is erased...");
        } else {
            BattleManager._logWindow.push('addText', cName + " is defeated!");
        }
        
        // 5. Force the engine to pause so the text hangs on screen heavily
        BattleManager._logWindow.push('wait');
        BattleManager._logWindow.push('wait');
        BattleManager._logWindow.push('wait');
    }
};

// HYSTERIA MP-TO-HP BYPASS
const HYSTERIA_STATE_ID = 7; 

const _Game_BattlerBase_canPaySkillCost = Game_BattlerBase.prototype.canPaySkillCost;
Game_BattlerBase.prototype.canPaySkillCost = function(skill) {
    // If Hysterical, allow them to cast even with 0 MP
    if (this.isStateAffected(HYSTERIA_STATE_ID) && skill.mpCost > 0) {
        return this.tp >= this.skillTpCost(skill); // Only check TP
    }
    return _Game_BattlerBase_canPaySkillCost.call(this, skill);
};

const _Game_BattlerBase_paySkillMpCost = Game_BattlerBase.prototype.paySkillMpCost;
Game_BattlerBase.prototype.paySkillMpCost = function(skill) {
    // If Hysterical, completely cancel the native MP deduction
    if (this.isStateAffected(HYSTERIA_STATE_ID) && skill.mpCost > 0) {
        return; 
    }
    _Game_BattlerBase_paySkillMpCost.call(this, skill);
};

// SYNC HUD MAKER DAMAGE WITH BATTLE LOG QUEUE
Window_BattleLog.prototype.performHysteriaDamage = function(target, damage) {
    if (target.isAlive()) {
        // Subtract the HP ONLY when this function is called in the queue
        target.setHp(target.hp - damage);
        
        // Trigger the red popup
        target.result().clear();
        target.result().hpAffected = true;
        target.result().hpDamage = damage;
        target.startDamagePopup();
        
        // If it kills them, trigger the collapse (Our global death message will catch it!)
        if (target.isDead()) {
            target.performCollapse();
        }
    }
};

})();

