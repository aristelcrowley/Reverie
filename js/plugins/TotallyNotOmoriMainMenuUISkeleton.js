/*:
@target MZ
@plugindesc Reverie - Complete Main Menu UI Override (ONLY SKELETON HERE. Actual UI was built with HMU in the HUD Maker plugin)
@author Aristel
*/

(() => {
    // =======================================================
    // 1. SETTINGS & CONSTANTS
    // =======================================================
    const DEBUG_MODE = false; 
    
    const CURSOR_ANIMATION_DELAY = 20; 
    const OPT_ANIM_DELAY = 20; 
    const GLOBAL_CURSOR_X_OFFSET = -6;

    const MENU_MARGIN_X = 12; 
    const MENU_MARGIN_Y = 12; 

    const CURSOR_IMAGE_NAME = "FingerCursor";
    const CURSOR_NATIVE_SIZE = 14; 
    const CURSOR_DRAW_SIZE = 24;

    const HMU_EQUIP_TABS_GROUP = "EquipTabsMenu";
    const HMU_EQUIP_LIST_GROUP = "EquipListMenu";
    const HMU_EQUIP_DESC_GROUP = "EquipDescMenu";
    const HMU_EQUIP_STAT_GROUP = "EquipStatMenu";
    const HMU_EQUIP_RECT1_GROUP = "EquipRectangle1"; 
    const HMU_EQUIP_RECT2_GROUP = "EquipRectangle2";

    const HMU_MEMENTOS_GROUP = "MementosMenu";
    const HMU_MEMENTOS_LIST_GROUP = "MementosListMenu";
    const HMU_MEMENTOS_ACTION_GROUP = "MementosActionMenu";
    const HMU_MEMENTOS_CONFIRM_GROUP = "MementosConfirmMenu";
    const HMU_MEMENTOS_DESC_GROUP = "MementosDescMenu"; 

    const HMU_ABILITIES_CAT_GROUP = "AbilitiesMenu";
    const HMU_ABILITIES_TABS_GROUP = "AbilitiesTabsMenu";
    const HMU_ABILITIES_LIST_GROUP = "AbilitiesListMenu";
    const HMU_ABILITIES_DESC_GROUP = "AbilitiesDescMenu";

    const HMU_OPTIONS_CAT_GROUP = "OptionsCatMenu";
    const HMU_OPTIONS_LIST_GROUP = "OptionsListMenu";
    const HMU_OPTIONS_DESC_GROUP = "OptionsDescMenu";

    const MAIN_MENU_CURSOR_Y_OFFSET = 7;
    const MEMENTOS_CAT_CURSOR_Y_OFFSET = 7;
    const MEMENTOS_LIST_CURSOR_Y_OFFSET = 8;
    const MEMENTOS_ACTION_CURSOR_Y_OFFSET = 8;
    const MEMENTOS_CONFIRM_CURSOR_Y_OFFSET = 8;
    
    const OPTIONS_SUB_X_OFFSET = 24;
    const OPTIONS_LIST_CURSOR_Y_OFFSET = 0;

    const OPTIONS_MAIN_CURSOR_X_OFFSET = 0; 
    const OPTIONS_MAIN_CURSOR_Y_OFFSET = -10;
    const OPTIONS_SUB_CURSOR_X_OFFSET = 0; 
    const OPTIONS_SUB_CURSOR_Y_OFFSET = 0;
    const OPTIONS_AUDIO_Y_OFFSET = 25;
    const OPTIONS_SYSTEM_Y_OFFSET = 25;

    const OPTIONS_GEN_SUB_START_X = 24; 
    const OPTIONS_GEN_SUB_SPACING = 120;
    const OPTIONS_CTRL_KEY_X = 300; 
    const OPTIONS_CTRL_PAD_X = 525;

    const SLIDE_Y_OFFSET_CAT     = -68; 
    const SLIDE_Y_OFFSET_LIST    = -68; 
    const SLIDE_Y_OFFSET_ACTION  = -110; 
    const SLIDE_Y_OFFSET_CONFIRM = -110; 
    const SLIDE_Y_OFFSET_DESC    = -108; 

    const SLIDE_Y_OFFSET_EQUIP_TABS = 200;  
    const SLIDE_X_OFFSET_EQUIP_LIST = -200;  
    const SLIDE_X_OFFSET_EQUIP_DESC = -200;
    const SLIDE_Y_OFFSET_EQUIP_STAT = 200;

    const SLIDE_Y_OFFSET_OPT_LIST = 200;

    const MEMENTOS_LIST_VISIBLE_ITEMS = 4;
    const MEMENTOS_LIST_ITEM_PADDING = 0; 
    const MEMENTOS_LIST_ITEM_HEIGHT = 36; 
    const MEMENTOS_LIST_FONT_SIZE = 16; 
    const MEMENTOS_LIST_TEXT_Y_OFFSET = 10; 
    const MEMENTOS_LIST_CURSOR_X_OFFSET = -12;
    const MEMENTOS_LIST_Y_OFFSET = 3; 
    const MEMENTOS_ACTION_Y_OFFSET = -9; 
    const MEMENTOS_CONFIRM_Y_OFFSET = 5;

    const ACTOR_CARD_UP_OFFSET = 150;    
    const ACTOR_CARD_DOWN_OFFSET = 300;  
    const ACTOR_CARD_GAP = 196; 

    const EQUIP_TABS_CURSOR_X_OFFSET = -8;
    const EQUIP_TABS_CURSOR_Y_OFFSET = 2;
    const EQUIP_LIST_CURSOR_X_OFFSET = 14;
    const EQUIP_LIST_CURSOR_Y_OFFSET = 0;

    const EQUIP_LIST_RESTING_X = 200; 
    const EQUIP_LIST_WIDTH = 600;   
    
    const EQUIP_TABS_RESTING_Y = 460; 
    const EQUIP_TABS_HEIGHT = 155;    

    const EQUIP_LIST_RESTING_Y = 460; 
    const EQUIP_LIST_HEIGHT = 155; 

    const EQUIP_TABS_FONT_SIZE = 20;      
    const EQUIP_TABS_ITEM_HEIGHT = 24;    
    const EQUIP_TABS_ITEM_GAP = 0;       

    const PASS_ANIM_IN_MAX = 45;
    const PASS_ANIM_SHIFT_MAX = 30;
    const PASS_ANIM_FADE_MAX = 0;
    const PASS_ANIM_DROP_MAX = 60;
    const PASS_ANIM_WAIT_MAX = 90;
    const PASS_BG_ANIM_MAX = 30;
    const PASS_SLOT_DIST_X = 220; 
    const PASS_SLOT_DIST_Y = 220;

    // =======================================================
    // 1.01. PASS CARD POSITIONING & ULTRA HUD FORCING
    // =======================================================

    const passSlotX = (slot) => slot === 0 ? 0 : slot === 1 ? PASS_SLOT_DIST_X : slot === 2 ? 0 : -PASS_SLOT_DIST_X;
    const passSlotY = (slot) => slot === 0 ? -PASS_SLOT_DIST_Y : slot === 1 ? 0 : slot === 2 ? PASS_SLOT_DIST_Y : 0;
    const passOriginX = (slot) => slot === 0 ? 15 : slot === 1 ? -15 : slot === 2 ? -15 : 15;
    const passOriginY = (slot) => slot === 0 ? 15 : slot === 1 ? 15 : slot === 2 ? -15 : -15;

    const forceUltraHUDVisible = (scene) => {
        const hud = scene && scene._ultraHudContainer;
        if (!hud) return;

        if (scene.updateUltraHUDContainerVisibility) {
            scene.updateUltraHUDContainerVisibility();
        }

        const available = !scene.shouldHUDBeAvailable || scene.shouldHUDBeAvailable();
        const active = (typeof $gameUltraHUD === 'undefined' || $gameUltraHUD.globalActiveness) && available;
        if (scene.ultraHUDVisibility) {
            hud.visible = scene.ultraHUDVisibility();
        }
        if (hud.setVisibilityState) {
            hud.setVisibilityState(active);
        }
        if (active) {
            hud._fadeState = true;
            hud._fadeCurr = hud._fadeDuration || 0;
            hud.alpha = 1;
        }
    };

    const preparePassCardsAtOrigin = () => {
        if (!$gameTemp) return;

        $gameTemp.passCardX = $gameTemp.passCardX || [0, 0, 0, 0];
        $gameTemp.passCardY = $gameTemp.passCardY || [0, 0, 0, 0];
        $gameTemp.passCardOpacity = $gameTemp.passCardOpacity || [0, 0, 0, 0];

        for (let i = 0; i < 4; i++) {
            const actor = $gameParty.members()[i];
            const currentSlot = (i - ($gameTemp.passSelectedIndex || 0) + 4) % 4;
            $gameTemp['passCardVis' + i] = !!actor;
            $gameTemp['passCardImage' + i] = actor ? "img/pictures/" + actor.name().toLowerCase() + "_bg_black.png" : "img/pictures/sora_bg_black.png";
            $gameTemp.passCardX[i] = passOriginX(currentSlot);
            $gameTemp.passCardY[i] = passOriginY(currentSlot);
            $gameTemp.passCardOpacity[i] = 0;
        }
    };

    // =======================================================
    // 1.02. CUSTOM KEYBINDING INTERCEPTORS
    // =======================================================

    const CONTROL_KEY_ACTIONS = {
        key_up: 'up',
        key_down: 'down',
        key_left: 'left',
        key_right: 'right',
        key_ok: 'ok',
        key_cancel: 'escape',
        key_shift: 'shift',
        key_pass: 'pageup'
    };
    const CONTROL_PAD_ACTIONS = {
        key_up: 'up',
        key_down: 'down',
        key_left: 'left',
        key_right: 'right',
        key_ok: 'ok',
        key_cancel: 'cancel',
        key_shift: 'shift',
        key_pass: 'pageup'
    };
    const CONTROL_KEY_DEFAULTS = {
        up: 87,
        down: 83,
        left: 65,
        right: 68,
        ok: 13,
        escape: 27,
        shift: 16,
        pageup: 81
    };
    const CONTROL_PAD_DEFAULTS = {
        up: 12,
        down: 13,
        left: 14,
        right: 15,
        ok: 0,
        cancel: 1,
        shift: 2,
        pageup: 3
    };
    let reverieBaseKeyMapper = null;
    let reverieBaseGamepadMapper = null;
    const DISABLED_KEY_MOVEMENT_ALIASES = [37, 38, 39, 40, 98, 100, 102, 104];
    const OLD_ARROW_KEY_DEFAULTS = { up: 38, down: 40, left: 37, right: 39 };

    const cloneControlBindings = (bindings) => Object.assign({}, bindings);

    const normalizeControlBindings = (bindings, defaults) => {
        const result = {};
        for (const action in defaults) {
            const value = Number(bindings && bindings[action]);
            result[action] = Number.isFinite(value) ? value : defaults[action];
        }
        return result;
    };

    const controlActionForSymbol = (symbol, device) => {
        return device === 'gamepad' ? CONTROL_PAD_ACTIONS[symbol] : CONTROL_KEY_ACTIONS[symbol];
    };

    const keyNameFromCode = (keyCode) => {
        if (keyCode >= 65 && keyCode <= 90) return String.fromCharCode(keyCode);
        if (keyCode >= 48 && keyCode <= 57) return String.fromCharCode(keyCode);
        if (keyCode >= 96 && keyCode <= 105) return "Num " + (keyCode - 96);
        if (keyCode >= 112 && keyCode <= 123) return "F" + (keyCode - 111);

        const names = {
            8: "Backspace",
            9: "Tab",
            13: "Enter",
            16: "Shift",
            17: "Ctrl",
            18: "Alt",
            20: "Caps",
            27: "Esc",
            32: "Space",
            33: "PageUp",
            34: "PageDown",
            35: "End",
            36: "Home",
            37: "Left",
            38: "Up",
            39: "Right",
            40: "Down",
            45: "Insert",
            46: "Delete",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        };
        return names[keyCode] || "Key " + keyCode;
    };

    const padNameFromButton = (buttonId) => {
        const names = {
            0: "A",
            1: "B",
            2: "X",
            3: "Y",
            4: "LB",
            5: "RB",
            6: "LT",
            7: "RT",
            8: "Back",
            9: "Start",
            10: "L3",
            11: "R3",
            12: "D-Up",
            13: "D-Down",
            14: "D-Left",
            15: "D-Right"
        };
        return names[buttonId] || "Btn " + buttonId;
    };

    const controlBindingName = (symbol, device) => {
        const action = controlActionForSymbol(symbol, device);
        if (!action) return "";

        if (device === 'gamepad') {
            const bindings = normalizeControlBindings(ConfigManager.reveriePadBindings, CONTROL_PAD_DEFAULTS);
            return padNameFromButton(bindings[action]);
        } else {
            const bindings = normalizeControlBindings(ConfigManager.reverieKeyBindings, CONTROL_KEY_DEFAULTS);
            return keyNameFromCode(bindings[action]);
        }
    };

    const applyReverieInputBindings = () => {
        if (!reverieBaseKeyMapper || !reverieBaseGamepadMapper) return;

        const keyBindings = normalizeControlBindings(ConfigManager.reverieKeyBindings, CONTROL_KEY_DEFAULTS);
        const padBindings = normalizeControlBindings(ConfigManager.reveriePadBindings, CONTROL_PAD_DEFAULTS);

        const keyMapper = Object.assign({}, reverieBaseKeyMapper);
        for (const keyCode of DISABLED_KEY_MOVEMENT_ALIASES) {
            delete keyMapper[keyCode];
        }
        for (const action in CONTROL_KEY_DEFAULTS) {
            delete keyMapper[CONTROL_KEY_DEFAULTS[action]];
        }
        for (const action in keyBindings) {
            keyMapper[keyBindings[action]] = action;
        }
        Input.keyMapper = keyMapper;

        const gamepadMapper = Object.assign({}, reverieBaseGamepadMapper);
        for (const action in CONTROL_PAD_DEFAULTS) {
            delete gamepadMapper[CONTROL_PAD_DEFAULTS[action]];
        }
        for (const action in padBindings) {
            gamepadMapper[padBindings[action]] = action;
        }
        Input.gamepadMapper = gamepadMapper;

        ConfigManager.reverieKeyBindings = keyBindings;
        ConfigManager.reveriePadBindings = padBindings;
    };

    const setReverieControlBinding = (device, symbol, inputCode) => {
        const action = controlActionForSymbol(symbol, device);
        if (!action && action !== 0) return false;

        const isGamepad = device === 'gamepad';
        const defaults = isGamepad ? CONTROL_PAD_DEFAULTS : CONTROL_KEY_DEFAULTS;
        const current = normalizeControlBindings(
            isGamepad ? ConfigManager.reveriePadBindings : ConfigManager.reverieKeyBindings,
            defaults
        );
        const oldInput = current[action];

        for (const otherAction in current) {
            if (otherAction !== action && current[otherAction] === inputCode) {
                current[otherAction] = oldInput;
                break;
            }
        }

        current[action] = inputCode;
        if (isGamepad) ConfigManager.reveriePadBindings = current;
        else ConfigManager.reverieKeyBindings = current;
        applyReverieInputBindings();
        return true;
    };

    const migrateArrowMovementBindings = (bindings) => {
        if (!bindings) return bindings;
        for (const action in OLD_ARROW_KEY_DEFAULTS) {
            if (bindings[action] === OLD_ARROW_KEY_DEFAULTS[action]) {
                bindings[action] = CONTROL_KEY_DEFAULTS[action];
            }
        }
        return bindings;
    };

    // =======================================================
    // 1.05. CONFIGURATION DEFAULTS & OVERRIDES
    // =======================================================

    ConfigManager.customResIndex = ConfigManager.customResIndex !== undefined ? ConfigManager.customResIndex : 0;
    ConfigManager.battleTextSpeed = ConfigManager.battleTextSpeed !== undefined ? ConfigManager.battleTextSpeed : 1;
    ConfigManager.reverieKeyBindings = migrateArrowMovementBindings(normalizeControlBindings(ConfigManager.reverieKeyBindings, CONTROL_KEY_DEFAULTS));
    ConfigManager.reveriePadBindings = normalizeControlBindings(ConfigManager.reveriePadBindings, CONTROL_PAD_DEFAULTS);

    Input.gamepadMapper[1] = 'cancel';
    Input.gamepadMapper[3] = 'pageup';
    reverieBaseKeyMapper = Object.assign({}, Input.keyMapper);
    reverieBaseGamepadMapper = Object.assign({}, Input.gamepadMapper);
    applyReverieInputBindings();

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.battleTextSpeed = this.battleTextSpeed;
        config.reverieBindingVersion = 2;
        config.reverieKeyBindings = cloneControlBindings(this.reverieKeyBindings);
        config.reveriePadBindings = cloneControlBindings(this.reveriePadBindings);
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        if (config.alwaysDash !== true) {
            this.alwaysDash = false; 
        }
        this.battleTextSpeed = Number.isFinite(Number(config.battleTextSpeed)) ? Number(config.battleTextSpeed).clamp(0, 2) : 1;
        this.reverieKeyBindings = normalizeControlBindings(config.reverieKeyBindings, CONTROL_KEY_DEFAULTS);
        if (config.reverieBindingVersion !== 2) {
            migrateArrowMovementBindings(this.reverieKeyBindings);
        }
        this.reveriePadBindings = normalizeControlBindings(config.reveriePadBindings, CONTROL_PAD_DEFAULTS);
        applyReverieInputBindings();
    };

    const _Input_onKeyDown_ReverieMenu = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        if ($gameTemp && $gameTemp.optionsRebindActive) {
            if ($gameTemp.optionsRebindDevice === 'keyboard' && !event.repeat) {
                this._reverieLastKeyCode = event.keyCode;
            }
            event.preventDefault();
            return;
        }
        _Input_onKeyDown_ReverieMenu.call(this, event);
    };

    const _Input_updateGamepadState_ReverieMenu = Input._updateGamepadState;
    Input._updateGamepadState = function(gamepad) {
        if ($gameTemp && $gameTemp.optionsRebindActive) {
            const lastState = this._gamepadStates[gamepad.index] || [];
            const newState = [];
            const buttons = gamepad.buttons;
            const axes = gamepad.axes;
            const threshold = 0.5;

            newState[12] = false;
            newState[13] = false;
            newState[14] = false;
            newState[15] = false;
            for (let i = 0; i < buttons.length; i++) {
                newState[i] = buttons[i].pressed;
            }
            if (axes[1] < -threshold) newState[12] = true;
            else if (axes[1] > threshold) newState[13] = true;
            if (axes[0] < -threshold) newState[14] = true;
            else if (axes[0] > threshold) newState[15] = true;

            for (let j = 0; j < newState.length; j++) {
                if ($gameTemp.optionsRebindDevice === 'gamepad' && newState[j] && !lastState[j]) {
                    this._reverieLastPadButton = j;
                    break;
                }
            }
            this._gamepadStates[gamepad.index] = newState;
            return;
        }
        _Input_updateGamepadState_ReverieMenu.call(this, gamepad);
    };

    const _Window_Message_updateShowFast_ReverieMenu = Window_Message.prototype.updateShowFast;
    Window_Message.prototype.updateShowFast = function() {
        if (ConfigManager.commandRemember) {
            _Window_Message_updateShowFast_ReverieMenu.call(this);
        } else {
            this._showFast = false;
        }
    };

    const applyResolution = function() {
        if (ConfigManager.customResIndex === 1) Graphics._requestFullScreen();
        else Graphics._cancelFullScreen();
    };

    // =======================================================
    // 1.1 COMBAT SKILL LOCK OVERRIDE (FORCE 4 SLOTS IN BATTLE)
    // =======================================================
    const _Game_Actor_skills = Game_Actor.prototype.skills;
    Game_Actor.prototype.skills = function() {
        if ($gameParty.inBattle()) {
            const battleSkills = [];
            this._equippedSkills = this._equippedSkills || [null, null, null, null];
            this._equippedBonds = this._equippedBonds || [null, null, null, null];
            
            this._equippedSkills.forEach(id => { if (id && this.isLearnedSkill(id)) battleSkills.push($dataSkills[id]); });
            this._equippedBonds.forEach(id => { if (id && this.isLearnedSkill(id)) battleSkills.push($dataSkills[id]); });
            
            return battleSkills;
        }
        return _Game_Actor_skills.call(this);
    };

    // =======================================================
    // 1.14 PREVENT HUD MAKER IMAGE CRASHES
    // =======================================================
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        if (_Game_Temp_initialize) _Game_Temp_initialize.call(this);
        this.passMidImage = "img/pictures/sora_bg_black.png";
        this.passCardImage0 = "img/pictures/sora_bg_black.png";
        this.passCardImage1 = "img/pictures/sora_bg_black.png";
        this.passCardImage2 = "img/pictures/sora_bg_black.png";
        this.passCardImage3 = "img/pictures/sora_bg_black.png";
        this.passPhotoName = "img/pictures/pass_sora_to_gin.png";
        this.hudShowOptionsBindPrompt = false;
        this.optionsRebindActive = false;
        this.optionsRebindDevice = "";
        this.optionsRebindSymbol = "";
        this.optionsRebindPrompt = "";
        this.optionsRebindTarget = "";
        this.optionsRebindCurrent = "";
    };

    // =======================================================
    // 1.15 ACTOR INITIALIZATION (AUTO-EQUIP SKILLS ON NEW GAME)
    // =======================================================
    const _Game_Actor_setup = Game_Actor.prototype.setup;
    Game_Actor.prototype.setup = function(actorId) {
        _Game_Actor_setup.call(this, actorId);
        
        // Create fresh, empty arrays for the new character
        this._equippedSkills = [null, null, null, null];
        this._equippedBonds = [null, null, null, null];
        
        let skillCount = 0;
        let bondCount = 0;
        
        // Look at the skills they naturally start with and auto-equip the first 4
        const initialSkills = this.skills();
        for (let i = 0; i < initialSkills.length; i++) {
            const skill = initialSkills[i];
            if (skill && skill.stypeId === 2 && skillCount < 4) { // Skill Type 2: Skills
                this._equippedSkills[skillCount] = skill.id;
                skillCount++;
            } else if (skill && skill.stypeId === 3 && bondCount < 4) { // Skill Type 3: Bonds
                this._equippedBonds[bondCount] = skill.id;
                bondCount++;
            }
        }
    };

    // =======================================================
    // 1.2. PIXI WEBGL HIJACK ENGINE
    // =======================================================
    const hijackHUDMakerNode = (parent, targetName, isActiveFn, isClosingFn, getClosingDelayFn, offsetX, offsetY, isVisibleFn, animDuration = CURSOR_ANIMATION_DELAY) => {
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
                    const originalX = target.x;
                    const originalY = target.y; 
                    let shouldRender = true;

                    // Absolute Ban: If menu is fully closed, do not draw anything.
                    if (!$gameTemp || !$gameTemp._customMenuOpen) {
                        shouldRender = false;
                    }
                    // Absolute Ban 2: If the skeleton window itself is formally hidden, block HMU from flashing it
                    else if (isVisibleFn && !isVisibleFn()) {
                        shouldRender = false;
                    }
                    // IN Animation
                    else if ($gameTemp._menuCursorDelay > 0 && isActiveFn && isActiveFn()) {
                        let delayCurrent = Math.min($gameTemp._menuCursorDelay, animDuration);
                        const progress = (animDuration - delayCurrent) / animDuration;
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        
                        if (delayCurrent === animDuration) {
                            target.x = originalX + offsetX;
                            target.y = originalY + offsetY;
                        } else {
                            target.x = originalX + (offsetX * (1 - easeOut));
                            target.y = originalY + (offsetY * (1 - easeOut));
                        }
                        target.updateTransform();
                    } 
                    // OUT Animation (Glitch Fixed)
                    else if (isClosingFn && isClosingFn() && getClosingDelayFn) {
                        const delay = Math.min(getClosingDelayFn(), animDuration);
                        if (delay > 0) {
                            const progress = (animDuration - delay) / animDuration;
                            const easeIn = Math.pow(progress, 3);
                            target.x = originalX + (offsetX * easeIn);
                            target.y = originalY + (offsetY * easeIn);
                            target.updateTransform();
                        } else {
                            target.x = originalX + offsetX;
                            target.y = originalY + offsetY; 
                            target.updateTransform();
                            shouldRender = false; // Prevent the 1-frame flash at resting position
                        }
                    } 
                    else {
                        target.x = originalX;
                        target.y = originalY;
                        target.updateTransform();
                    }

                    // Only execute the draw call if we aren't hiding the flash
                    if (shouldRender && originalMethod) originalMethod.call(target, renderer);

                    target.x = originalX;
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
            hijackHUDMakerNode(child, targetName, isActiveFn, isClosingFn, getClosingDelayFn, offsetX, offsetY, isVisibleFn, animDuration);
        }
    };

    const hijackPopNode = (parent, targetName, isActiveFn, isClosingFn, getClosingDelayFn, isVisibleFn, popOrder, floatDir) => {
        if (!parent || !parent.children) return;
        
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            
            let isTarget = false;
            if (child.name === targetName) isTarget = true;
            else if (child._component && child._component.name === targetName) isTarget = true;
            else if (child.component && child.component.name === targetName) isTarget = true;
            else if (child._data && (child._data.name === targetName || child._data.Name === targetName)) isTarget = true;
            else if (child.data && (child.data.name === targetName || child.data.Name === targetName)) isTarget = true;
            
            if (isTarget && !child._reveriePopHijacked) {
                child._reveriePopHijacked = true;
                
                const originalRender = child.render;
                const originalRenderCanvas = child.renderCanvas;

                const applyPopAnim = function(target, renderer, originalMethod) {
                    const originalY = target.y;
                    const originalAlpha = target.alpha !== undefined ? target.alpha : 1;
                    let shouldRender = true;
                    let currentAlpha = originalAlpha;

                    // Absolute Ban: Menu closed or formally hidden
                    if (!$gameTemp || !$gameTemp._customMenuOpen || (isVisibleFn && !isVisibleFn())) {
                        shouldRender = false;
                    } 
                    // IN Animation (Split 20 frames into two sequential 10-frame chunks)
                    else if ($gameTemp._menuCursorDelay > 0 && isActiveFn && isActiveFn()) {
                        const delay = $gameTemp._menuCursorDelay;
                        let progress = 0;
                        if (popOrder === 1) progress = delay > 10 ? (20 - delay) / 10 : 1; // 1st pops frame 20->10
                        else progress = delay <= 10 ? (10 - delay) / 10 : 0;               // 2nd pops frame 10->0
                        
                        currentAlpha = originalAlpha * progress;
                        if (progress === 0) shouldRender = false;
                    } 
                    // OUT Animation (Reversed 10-frame chunks)
                    else if (isClosingFn && isClosingFn() && getClosingDelayFn) {
                        const delay = getClosingDelayFn();
                        let progress = 0;
                        if (popOrder === 1) progress = delay <= 10 ? delay / 10 : 1;       // 1st leaves frame 10->0
                        else progress = delay > 10 ? (delay - 10) / 10 : 0;                // 2nd leaves frame 20->10
                        
                        currentAlpha = originalAlpha * progress;
                        if (progress === 0) shouldRender = false;
                    }

                    if (shouldRender) {
                        target.alpha = currentAlpha;
                        
                        // IDLE FLOAT MATH: Graphics.frameCount ensures endless smooth bobbing
                        const floatY = Math.sin(Graphics.frameCount * 0.08) * 8 * floatDir;
                        target.y = originalY + floatY;
                        
                        target.updateTransform();
                        if (originalMethod) originalMethod.call(target, renderer);
                    }

                    // Restore completely to prevent permanent PIXI coordinate breakage
                    target.y = originalY;
                    target.alpha = originalAlpha;
                    target.updateTransform(); 
                };

                if (originalRender) child.render = function(renderer) { applyPopAnim(this, renderer, originalRender); };
                if (originalRenderCanvas) child.renderCanvas = function(renderer) { applyPopAnim(this, renderer, originalRenderCanvas); };
            }
            hijackPopNode(child, targetName, isActiveFn, isClosingFn, getClosingDelayFn, isVisibleFn, popOrder, floatDir);
        }
    };

    const hijackActorCardNode = (parent) => {
        if (!parent || !parent.children) return;
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            let targetIndex = -1;
            
            let nameStr = "";
            const checkName = (val) => { if (typeof val === 'string') nameStr += val.toLowerCase() + "|"; };
            checkName(child.name);
            if (child._component) checkName(child._component.name);
            if (child.component) checkName(child.component.name);
            if (child._data) { checkName(child._data.name); checkName(child._data.Name); checkName(child._data.id); }
            if (child.data) { checkName(child.data.name); checkName(child.data.Name); checkName(child.data.id); }
            
            if (nameStr.includes("actorcard0")) targetIndex = 0;
            else if (nameStr.includes("actorcard1")) targetIndex = 1;
            else if (nameStr.includes("actorcard2")) targetIndex = 2;
            else if (nameStr.includes("actorcard3")) targetIndex = 3;

            if (targetIndex !== -1 && !child._reverieCardHijacked) {
                child._reverieCardHijacked = true;
                const originalRender = child.render;
                const originalRenderCanvas = child.renderCanvas;

                const applyCardAnim = function(target, renderer, originalMethod) {
                    if (!$gameTemp || !$gameTemp._customMenuOpen) return;

                    const originalX = target.x;
                    const originalY = target.y;
                    
                    if ($gameTemp && $gameTemp.equipAnimState > 0) {
                        const state = $gameTemp.equipAnimState;
                        const prog = $gameTemp.equipAnimProgress;
                        const isSelected = ($gameTemp.activeMenuSymbol !== 'options' && $gameTemp.equipSelectedActor === targetIndex);
                        
                        if (!isSelected) {
                            if (state === 1) target.y += (ACTOR_CARD_DOWN_OFFSET * prog);
                            else if (state > 1 && state < 8) target.y += ACTOR_CARD_DOWN_OFFSET;
                            else if (state === 8) target.y += (ACTOR_CARD_DOWN_OFFSET * (1 - prog));
                        } else {
                            if (state === 2) target.x -= (targetIndex * ACTOR_CARD_GAP * prog);
                            else if (state > 2 && state < 7) target.x -= (targetIndex * ACTOR_CARD_GAP);
                            else if (state === 7) target.x -= (targetIndex * ACTOR_CARD_GAP * (1 - prog));

                            if (state === 3) target.y -= (ACTOR_CARD_UP_OFFSET * prog);
                            else if (state > 3 && state < 6) target.y -= ACTOR_CARD_UP_OFFSET;
                            else if (state === 6) target.y -= (ACTOR_CARD_UP_OFFSET * (1 - prog));
                        }
                    }
                    
                    if ($gameTemp && $gameTemp.passBgOffsetBottom) {
                        target.y += $gameTemp.passBgOffsetBottom;
                    }
                    
                    target.updateTransform();
                    if (originalMethod) originalMethod.call(target, renderer);
                    
                    target.x = originalX;
                    target.y = originalY;
                    target.updateTransform();
                };

                if (originalRender) child.render = function(renderer) { applyCardAnim(this, renderer, originalRender); };
                if (originalRenderCanvas) child.renderCanvas = function(renderer) { applyCardAnim(this, renderer, originalRenderCanvas); };
            }
            hijackActorCardNode(child);
        }
    };

    const hijackPassNode = (parent) => {
        if (!parent || !parent.children) return;
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            let targetIndex = -1;
            let isPhoto = false;
            
            let nameStr = "";
            const checkName = (val) => { if (typeof val === 'string') nameStr += val.toLowerCase() + "|"; };
            checkName(child.name);
            if (child._component) checkName(child._component.name);
            if (child.component) checkName(child.component.name);
            if (child._data) { checkName(child._data.name); checkName(child._data.Name); }
            if (child.data) { checkName(child.data.name); checkName(child.data.Name); }
            
            if (nameStr.includes("passcard0")) targetIndex = 0;
            else if (nameStr.includes("passcard1")) targetIndex = 1;
            else if (nameStr.includes("passcard2")) targetIndex = 2;
            else if (nameStr.includes("passcard3")) targetIndex = 3;
            else if (nameStr.includes("passphoto")) isPhoto = true;

            if ((targetIndex !== -1 || isPhoto) && !child._reveriePassHijacked) {
                child._reveriePassHijacked = true;
                const originalRender = child.render;
                const originalRenderCanvas = child.renderCanvas;

                const applyPassAnim = function(target, renderer, originalMethod) {
                    const originalX = target.x;
                    const originalY = target.y;
                    const originalAlpha = target.alpha !== undefined ? target.alpha : 1;
                    let shouldRender = true;
                    
                    if (!$gameTemp || !$gameTemp.hudShowPass) {
                        shouldRender = false; // FIX: Completely abort rendering to prevent 1-frame flashes!
                    } else {
                        if (targetIndex >= 0) {
                            target.x = originalX + ($gameTemp.passCardX[targetIndex] || 0);
                            target.y = originalY + ($gameTemp.passCardY[targetIndex] || 0);
                            target.alpha = originalAlpha * (($gameTemp.passCardOpacity[targetIndex] !== undefined ? $gameTemp.passCardOpacity[targetIndex] : 255) / 255);
                        } else if (isPhoto) {
                            target.y = originalY + ($gameTemp.passPhotoY || 0);
                        }
                    }
                    
                    if (shouldRender) {
                        target.updateTransform();
                        if (originalMethod) originalMethod.call(target, renderer);
                    }
                    
                    target.x = originalX;
                    target.y = originalY;
                    target.alpha = originalAlpha;
                    target.updateTransform();
                };

                if (originalRender) child.render = function(renderer) { applyPassAnim(this, renderer, originalRender); };
                if (originalRenderCanvas) child.renderCanvas = function(renderer) { applyPassAnim(this, renderer, originalRenderCanvas); };
            }
            hijackPassNode(child);
        }
    };

    const hijackMainMenuGroup = (parent) => {
        if (!parent || !parent.children) return;
        for (let i = 0; i < parent.children.length; i++) {
            const child = parent.children[i];
            let isTarget = false;
            let nameStr = "";
            
            const checkName = (val) => { if (typeof val === 'string') nameStr += val.toLowerCase() + "|"; };
            
            checkName(child.name);
            if (child._component) checkName(child._component.name);
            if (child.component) checkName(child.component.name);
            if (child._data) { checkName(child._data.name); checkName(child._data.Name); }
            if (child.data) { checkName(child.data.name); checkName(child.data.Name); }
            
            if (nameStr.includes("mainmenu")) isTarget = true;

            if (isTarget && !child._reverieMainMenuHijacked) {
                child._reverieMainMenuHijacked = true;
                const originalRender = child.render;
                const applyMainMenuAnim = function(target, renderer, originalMethod) {
                    if (!$gameTemp || !$gameTemp._customMenuOpen) return;

                    const originalY = target.y;
                    if ($gameTemp && $gameTemp.passBgOffsetTop) {
                        target.y += $gameTemp.passBgOffsetTop;
                    }
                    target.updateTransform();
                    if (originalMethod) originalMethod.call(target, renderer);
                    target.y = originalY;
                    target.updateTransform();
                };
                if (originalRender) child.render = function(renderer) { applyMainMenuAnim(this, renderer, originalRender); };
            }
            hijackMainMenuGroup(child);
        }
    };

    // =======================================================
    // 1.5. OVERLAY ENGINE
    // =======================================================
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        if ($gameTemp && $gameTemp.returnToOmoriMenuAfterLoad) {
            $gameTemp.returnToOmoriMenuAfterLoad = false;
            $gameTemp.hudShowOptionsCat = false;
            $gameTemp.hudShowOptionsList = false;
            $gameTemp.hudShowOptionsDesc = false;
            $gameTemp.hudShowOptionsConfirm = false;
            if (this._optionsCatWindow) { this._optionsCatWindow.hide(); this._optionsCatWindow.deactivate(); }
            if (this._optionsListWindow) { this._optionsListWindow.hide(); this._optionsListWindow.deactivate(); }
            if (this._optionsConfirmWindow) { this._optionsConfirmWindow.hide(); this._optionsConfirmWindow.deactivate(); }
            
            this.openCustomOmoriMenu();
            if (this._commandWindow) this._commandWindow.select(4); // Selects "Options" gracefully
        }

        if ($gameTemp && ($gameTemp._customMenuOpen || $gameTemp._globalClosingDelay > 0)) { 
            Scene_Base.prototype.update.call(this);

            this.updateOptionsRebind();
            this.updatePassAnimations();
            this.updateHUDMakerBridge(); 

            // OPTIONS CASCADE IN
            if ($gameTemp.optCatInTimer > 0) {
                $gameTemp.optCatInTimer--;
                if ($gameTemp.optCatInTimer === 0) {
                    $gameTemp.hudShowOptionsCat = true;
                    $gameTemp.optCatIsAnimatingIn = true;
                    
                    $gameTemp._menuCursorDelay = OPT_ANIM_DELAY;
                    this._optionsCatWindow.show();
                    
                    $gameTemp.optListInTimer = OPT_ANIM_DELAY;
                }
            }
            if ($gameTemp.optListInTimer > 0) {
                $gameTemp.optListInTimer--;
                if ($gameTemp.optListInTimer === 0) {
                    $gameTemp.optCatIsAnimatingIn = false;
                    $gameTemp.hudShowOptionsList = true;
                    $gameTemp.optListIsAnimatingIn = true;
                    
                    $gameTemp._menuCursorDelay = OPT_ANIM_DELAY;
                    this._optionsListWindow.setCategory('general');
                    this._optionsListWindow.deselect();
                    this._optionsListWindow.show();
                }
            }

            // Options Completion Unfreeze (Now waits for List instead of Desc)
            if ($gameTemp.optListIsAnimatingIn && $gameTemp._menuCursorDelay === 0) {
                $gameTemp.optListIsAnimatingIn = false;
                $gameTemp.optionsAnimActive = true;
                this._optionsCatWindow.activate();
                this._optionsCatWindow.select(0);
            }

            // OPTIONS CASCADE OUT
            if ($gameTemp.optListOutTimer > 0) {
                $gameTemp.optListOutTimer--;
                if ($gameTemp.optListOutTimer === 0) {
                    $gameTemp.hudShowOptionsList = false;
                    this._optionsCatWindow._closingDelay = OPT_ANIM_DELAY;
                    $gameTemp.optCatOutTimer = OPT_ANIM_DELAY;
                }
            }
            if ($gameTemp.optCatOutTimer > 0) {
                $gameTemp.optCatOutTimer--;
                if ($gameTemp.optCatOutTimer === 0) {
                    $gameTemp.hudShowOptionsCat = false;
                    $gameTemp.optionsAnimActive = false;
                    $gameTemp.equipAnimState = 5; // Reverse actor cards
                    $gameTemp.equipAnimTimer = 0;
                }
            }

            // Equip/Abilities Card Animation State Machine
            if ($gameTemp.equipAnimState > 0 && $gameTemp.equipAnimState < 4) {
                if ($gameTemp.equipAnimTimer < CURSOR_ANIMATION_DELAY) {
                    $gameTemp.equipAnimTimer++;
                } else {
                    $gameTemp.equipAnimState++; // Move to next phase
                    $gameTemp.equipAnimTimer = 0;
                    if ($gameTemp.equipAnimState === 2 && ($gameTemp.equipSelectedActor === 0 || $gameTemp.activeMenuSymbol === 'options')) {
                        $gameTemp.equipAnimState = 3; // Skip Left Movement if it's the 1st character OR options
                    }
                    if ($gameTemp.equipAnimState === 4) {
                        if ($gameTemp.activeMenuSymbol === 'equip' && this._equipTabsWindow) {
                            $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
                            this._equipTabsWindow.show();
                            this._equipTabsWindow.activate();
                            this._equipTabsWindow.select(1);
                            $gameTemp.equipDescInTimer = CURSOR_ANIMATION_DELAY;
                        } else if ($gameTemp.activeMenuSymbol === 'abilities' && this._abilitiesCatWindow) {
                            $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
                            this._abilitiesCatWindow.show();
                            this._abilitiesCatWindow.activate();
                            this._abilitiesCatWindow.select(0);
                        } else if ($gameTemp.activeMenuSymbol === 'options') {
                            $gameTemp.optCatInTimer = 1;
                        }
                    }
                }
                const progress = $gameTemp.equipAnimTimer / CURSOR_ANIMATION_DELAY;
                $gameTemp.equipAnimProgress = 1 - Math.pow(1 - progress, 3); // Smooth Ease Out
            } else if ($gameTemp.equipAnimState >= 5) {
                if ($gameTemp.equipAnimTimer < CURSOR_ANIMATION_DELAY) {
                    $gameTemp.equipAnimTimer++;
                } else {
                    $gameTemp.equipAnimState++;
                    $gameTemp.equipAnimTimer = 0;
                    if ($gameTemp.equipAnimState === 7 && ($gameTemp.equipSelectedActor === 0 || $gameTemp.activeMenuSymbol === 'options')) {
                        $gameTemp.equipAnimState = 8; 
                    }
                    if ($gameTemp.equipAnimState === 9) {
                        $gameTemp.equipAnimState = 0;
                        if ($gameTemp.activeMenuSymbol === 'options') {
                            this._commandWindow.activate();
                        } else if (this._statusWindow) {
                            this._statusWindow.activate(); 
                            this._statusWindow.select($gameTemp.equipSelectedActor); 
                        }
                    }
                }
                const progress = $gameTemp.equipAnimTimer / CURSOR_ANIMATION_DELAY;
                $gameTemp.equipAnimProgress = 1 - Math.pow(1 - progress, 3); 
            }

            // MEMENTOS HIJACKS
            if (this._mementosCatWindow && (this._mementosCatWindow.visible || this._mementosCatWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isCatClosing = () => this._mementosCatWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const catDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._mementosCatWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_MEMENTOS_GROUP, () => this._mementosCatWindow.active, isCatClosing, catDelay, 0, SLIDE_Y_OFFSET_CAT, () => this._mementosCatWindow.visible);
            }
            if (this._mementosItemWindow && (this._mementosItemWindow.visible || this._mementosItemWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isListClosing = () => this._mementosItemWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const listDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._mementosItemWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_MEMENTOS_LIST_GROUP, () => this._mementosItemWindow.active, isListClosing, listDelay, 0, SLIDE_Y_OFFSET_LIST, () => this._mementosItemWindow.visible);
                hijackHUDMakerNode(this, HMU_MEMENTOS_DESC_GROUP, () => this._mementosItemWindow.active, isListClosing, listDelay, 0, SLIDE_Y_OFFSET_DESC, () => this._mementosItemWindow.visible);
            }
            if (this._mementosActionWindow && (this._mementosActionWindow.visible || this._mementosActionWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isActionActive = () => this._mementosActionWindow.active || $gameTemp.mementosUseMode;
                const isActionClosing = () => this._mementosActionWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const actionDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._mementosActionWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_MEMENTOS_ACTION_GROUP, isActionActive, isActionClosing, actionDelay, 0, SLIDE_Y_OFFSET_ACTION, () => this._mementosActionWindow.visible);
            }
            if (this._mementosConfirmWindow && (this._mementosConfirmWindow.visible || this._mementosConfirmWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isConfirmClosing = () => this._mementosConfirmWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const confirmDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._mementosConfirmWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_MEMENTOS_CONFIRM_GROUP, () => this._mementosConfirmWindow.active, isConfirmClosing, confirmDelay, 0, SLIDE_Y_OFFSET_CONFIRM, () => this._mementosConfirmWindow.visible);
            }

            // ABILITIES HIJACKS
            if (this._abilitiesCatWindow && (this._abilitiesCatWindow.visible || this._abilitiesCatWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isAbilClosing = () => this._abilitiesCatWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const abilDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._abilitiesCatWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_ABILITIES_CAT_GROUP, () => this._abilitiesCatWindow.active, isAbilClosing, abilDelay, 0, SLIDE_Y_OFFSET_CAT, () => this._abilitiesCatWindow.visible);
            }
            if (this._abilitiesTabsWindow && (this._abilitiesTabsWindow.visible || this._abilitiesTabsWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isClosing = () => this._abilitiesTabsWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const delay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._abilitiesTabsWindow._closingDelay;
                const isActive = () => this._abilitiesTabsWindow.active && !$gameTemp.hudShowAbilitiesDesc;
                hijackHUDMakerNode(this, HMU_ABILITIES_TABS_GROUP, isActive, isClosing, delay, 0, SLIDE_Y_OFFSET_EQUIP_TABS, () => this._abilitiesTabsWindow.visible);
            }
            if (this._abilitiesListWindow && (this._abilitiesListWindow.visible || this._abilitiesListWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isClosing = () => this._abilitiesListWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const delay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._abilitiesListWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_ABILITIES_LIST_GROUP, () => this._abilitiesListWindow.active, isClosing, delay, SLIDE_X_OFFSET_EQUIP_LIST, 0, () => this._abilitiesListWindow.visible);
            }

            // OPTIONS HIJACKS
            if (this._optionsCatWindow && (this._optionsCatWindow.visible || this._optionsCatWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isOptCatClosing = () => $gameTemp.optCatOutTimer > 0 || $gameTemp._globalClosingDelay > 0;
                const optCatDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.optCatOutTimer;
                hijackHUDMakerNode(this, HMU_OPTIONS_CAT_GROUP, () => $gameTemp.optCatIsAnimatingIn, isOptCatClosing, optCatDelay, 0, SLIDE_Y_OFFSET_CAT, () => $gameTemp.hudShowOptionsCat, OPT_ANIM_DELAY);
            }
            if (this._optionsListWindow && (this._optionsListWindow.visible || this._optionsListWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isOptListClosing = () => $gameTemp.optListOutTimer > 0 || $gameTemp._globalClosingDelay > 0;
                const optListDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.optListOutTimer;
                hijackHUDMakerNode(this, HMU_OPTIONS_LIST_GROUP, () => $gameTemp.optListIsAnimatingIn, isOptListClosing, optListDelay, 0, SLIDE_Y_OFFSET_OPT_LIST, () => $gameTemp.hudShowOptionsList, OPT_ANIM_DELAY);
            }
            
            const isOptDescClosing = () => $gameTemp.optionsDescOutTimer > 0 || $gameTemp._globalClosingDelay > 0;
            const optDescDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.optionsDescOutTimer;
            hijackHUDMakerNode(this, HMU_OPTIONS_DESC_GROUP, () => $gameTemp.optDescIsAnimatingIn, isOptDescClosing, optDescDelay, 0, SLIDE_Y_OFFSET_OPT_LIST, () => $gameTemp.hudShowOptionsDesc, OPT_ANIM_DELAY);

            // ABILITIES CASCADE ANIMATIONS
            if ($gameTemp.abilTabsInTimer > 0) {
                $gameTemp.abilTabsInTimer--;
                if ($gameTemp.abilTabsInTimer === 0) {
                    $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
                    this._abilitiesTabsWindow.show();
                    this._abilitiesTabsWindow.activate();
                    this._abilitiesTabsWindow.select(0);
                    $gameTemp.abilDescInTimer = CURSOR_ANIMATION_DELAY;
                }
            }
            if ($gameTemp.abilDescInTimer > 0) {
                $gameTemp.abilDescInTimer--;
                if ($gameTemp.abilDescInTimer === 0) {
                    $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
                    $gameTemp.hudShowAbilitiesDesc = true;
                    $gameTemp.abilDescIsAnimatingIn = true;
                }
            }
            if ($gameTemp.abilDescOutDelay > 0) {
                $gameTemp.abilDescOutDelay--;
                if ($gameTemp.abilDescOutDelay === 0) {
                    $gameTemp.hudShowAbilitiesDesc = false;
                    this._abilitiesTabsWindow._closingDelay = CURSOR_ANIMATION_DELAY;
                    $gameTemp.abilCatInTimer = CURSOR_ANIMATION_DELAY; 
                }
            }
            if ($gameTemp.abilCatInTimer > 0) {
                $gameTemp.abilCatInTimer--;
                if ($gameTemp.abilCatInTimer === 0) {
                    $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
                    this._abilitiesCatWindow.show();
                    this._abilitiesCatWindow.activate();
                }
            }

            const isAbilDescClosing = () => $gameTemp.abilDescOutDelay > 0 || $gameTemp._globalClosingDelay > 0;
            const abilDescDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.abilDescOutDelay;
            hijackHUDMakerNode(this, HMU_ABILITIES_DESC_GROUP, () => $gameTemp.abilDescIsAnimatingIn, isAbilDescClosing, abilDescDelay, SLIDE_X_OFFSET_EQUIP_DESC, 0, () => $gameTemp.hudShowAbilitiesDesc);


            // EQUIP CASCADE IN SEQUENCES
            if ($gameTemp.equipDescInTimer > 0) {
                $gameTemp.equipDescInTimer--;
                if ($gameTemp.equipDescInTimer === 0) {
                    $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; // Trigger Desc IN animation
                    $gameTemp.hudShowEquipDesc = true;
                    $gameTemp.equipDescIsAnimatingIn = true; 
                    
                    // START STAT IN TIMER (Wait for Desc to finish sliding)
                    $gameTemp.equipStatInTimer = CURSOR_ANIMATION_DELAY;
                }
            }

            if ($gameTemp.equipStatInTimer > 0) {
                $gameTemp.equipStatInTimer--;
                if ($gameTemp.equipStatInTimer === 0) {
                    $gameTemp.equipDescIsAnimatingIn = false;
                    
                    $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; // Trigger Stat IN animation
                    $gameTemp.hudShowEquipStat = true;
                    $gameTemp.equipStatIsAnimatingIn = true;
                }
            }
            
            // Turn off specific IN flags when all animations are completely done
            if ($gameTemp._menuCursorDelay === 0) {
                $gameTemp.equipDescIsAnimatingIn = false;
                $gameTemp.equipStatIsAnimatingIn = false;
                $gameTemp.abilDescIsAnimatingIn = false;
            }

            // EQUIP CASCADE OUT SEQUENCES (Reverse order: Stat -> Desc -> Tabs)
            if ($gameTemp.equipStatOutDelay > 0) {
                $gameTemp.equipStatOutDelay--;
                if ($gameTemp.equipStatOutDelay === 0) {
                    $gameTemp.hudShowEquipStat = false;
                    $gameTemp.equipDescOutDelay = CURSOR_ANIMATION_DELAY; // Now slide Desc out
                }
            }

            if ($gameTemp.equipDescOutDelay > 0) {
                $gameTemp.equipDescOutDelay--;
                if ($gameTemp.equipDescOutDelay === 0) {
                    $gameTemp.hudShowEquipDesc = false;
                    this._equipTabsWindow._closingDelay = CURSOR_ANIMATION_DELAY; // Now slide Tabs out
                    $gameTemp.equipAnimState = 5; // Now reverse actor cards
                    $gameTemp.equipAnimTimer = 0;
                }
            }

            // EQUIP UI HIJACKS
            if (this._equipTabsWindow && (this._equipTabsWindow.visible || this._equipTabsWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isClosing = () => this._equipTabsWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const delay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._equipTabsWindow._closingDelay;
                const isActive = () => this._equipTabsWindow.active && !$gameTemp.hudShowEquipDesc && !$gameTemp.hudShowEquipStat; // Prevents tabs from re-sliding
                hijackHUDMakerNode(this, HMU_EQUIP_TABS_GROUP, isActive, isClosing, delay, 0, SLIDE_Y_OFFSET_EQUIP_TABS, () => this._equipTabsWindow.visible);
            }
            if (this._equipListWindow && (this._equipListWindow.visible || this._equipListWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
                const isClosing = () => this._equipListWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0;
                const delay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : this._equipListWindow._closingDelay;
                hijackHUDMakerNode(this, HMU_EQUIP_LIST_GROUP, () => this._equipListWindow.active, isClosing, delay, SLIDE_X_OFFSET_EQUIP_LIST, 0, () => this._equipListWindow.visible);
            }
            
            // Desc Hijack
            const isDescClosing = () => $gameTemp.equipDescOutDelay > 0 || $gameTemp._globalClosingDelay > 0;
            const descDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.equipDescOutDelay;
            hijackHUDMakerNode(this, HMU_EQUIP_DESC_GROUP, () => $gameTemp.equipDescIsAnimatingIn, isDescClosing, descDelay, SLIDE_X_OFFSET_EQUIP_DESC, 0, () => $gameTemp.hudShowEquipDesc);

            // Stat Hijack
            const isStatClosing = () => $gameTemp.equipStatOutDelay > 0 || $gameTemp._globalClosingDelay > 0;
            const statDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.equipStatOutDelay;
            hijackHUDMakerNode(this, HMU_EQUIP_STAT_GROUP, () => $gameTemp.equipStatIsAnimatingIn, isStatClosing, statDelay, 0, SLIDE_Y_OFFSET_EQUIP_STAT, () => $gameTemp.hudShowEquipStat);

            hijackPopNode(this, HMU_EQUIP_RECT1_GROUP, () => $gameTemp.equipStatIsAnimatingIn, isStatClosing, statDelay, () => $gameTemp.hudShowEquipStat, 1, 1);
            hijackPopNode(this, HMU_EQUIP_RECT2_GROUP, () => $gameTemp.equipStatIsAnimatingIn, isStatClosing, statDelay, () => $gameTemp.hudShowEquipStat, 2, -1);

            hijackActorCardNode(this);
            hijackPassNode(this);
            hijackMainMenuGroup(this); 

            if ($gameTemp && $gameTemp.passBgOffsetTop) {
                this._commandWindow.y = this._commandWindow._baseY + $gameTemp.passBgOffsetTop;
            } else if (this._commandWindow.y !== this._commandWindow._baseY) {
                this._commandWindow.y = this._commandWindow._baseY;
            }

            const allWindows = [
                {win: this._mementosCatWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_CAT}, 
                {win: this._mementosItemWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_LIST}, 
                {win: this._mementosActionWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_ACTION}, 
                {win: this._mementosConfirmWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_CONFIRM},
                {win: this._abilitiesCatWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_CAT},
                {win: this._abilitiesTabsWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_EQUIP_TABS},
                {win: this._abilitiesListWindow, offsetX: SLIDE_X_OFFSET_EQUIP_LIST, offsetY: 0},
                {win: this._equipTabsWindow, offsetX: 0, offsetY: SLIDE_Y_OFFSET_EQUIP_TABS},
                {win: this._equipListWindow, offsetX: SLIDE_X_OFFSET_EQUIP_LIST, offsetY: 0},
                {win: this._optionsCatWindow, offsetX: 0, offsetY: 0},
                {win: this._optionsListWindow, offsetX: 0, offsetY: 0},
                {win: this._optionsConfirmWindow, offsetX: 0, offsetY: 0}
            ];

            // IN Animation math
            if ($gameTemp._menuCursorDelay > 0) {
                $gameTemp._menuCursorDelay--;
                
                allWindows.forEach(item => {
                    const win = item.win;
                    if (win && win.active && win.visible) {
                        // Prevent the Skeleton window from re-sliding when the Description IN animation triggers
                        if (win === this._equipTabsWindow && $gameTemp.hudShowEquipDesc) return;
                        if (win === this._abilitiesTabsWindow && $gameTemp.hudShowAbilitiesDesc) return;
                        
                        const progress = (CURSOR_ANIMATION_DELAY - $gameTemp._menuCursorDelay) / CURSOR_ANIMATION_DELAY;
                        const easeOut = 1 - Math.pow(1 - progress, 3);

                        const currentOffsetX = item.offsetX * (1 - easeOut);
                        const currentOffsetY = item.offsetY * (1 - easeOut);
                        win.x = win._baseX + currentOffsetX;
                        win.y = win._baseY + currentOffsetY;
                        if (win.index && win.index() >= 0) win.redrawItem(win.index());
                    }
                });

                if ($gameTemp._menuCursorDelay === 0) {
                    allWindows.forEach(item => {
                        const win = item.win;
                        if (win && win.active && win.visible) {
                            if (win === this._equipTabsWindow && $gameTemp.hudShowEquipDesc) return;
                            if (win === this._abilitiesTabsWindow && $gameTemp.hudShowAbilitiesDesc) return;

                            win.x = win._baseX;
                            win.y = win._baseY;
                            if (win.index && win.index() >= 0) win.redrawItem(win.index());
                        }
                    });
                }
            }
            
            // Global OUT Animation (When leaving entire menu)
            if ($gameTemp._globalClosingDelay > 0) {
                $gameTemp._globalClosingDelay--;
                const progress = (CURSOR_ANIMATION_DELAY - $gameTemp._globalClosingDelay) / CURSOR_ANIMATION_DELAY;
                const easeIn = Math.pow(progress, 3);
                
                allWindows.forEach(item => {
                    const win = item.win;
                    if (win && win.visible) {
                        const currentOffsetX = item.offsetX * easeIn;
                        const currentOffsetY = item.offsetY * easeIn;
                        win.x = win._baseX + currentOffsetX;
                        win.y = win._baseY + currentOffsetY;
                    }
                });

                if ($gameTemp._globalClosingDelay === 0) {
                    $gameTemp._customMenuOpen = false; 

                    if (this._spriteset && this._reverieBlurFilter) {
                        const filters = this._spriteset.filters || [];
                        const filterIndex = filters.indexOf(this._reverieBlurFilter);
                        if (filterIndex > -1) {
                            filters.splice(filterIndex, 1);
                            this._spriteset.filters = filters;
                        }
                    }

                    $gameTemp.hudShowPass = false;
                    $gameTemp.passPhotoVis = false;
                    $gameTemp.passMidCardVis = false;
                    $gameTemp.passLeaderTextVis = false;
                    $gameTemp.passPhotoName = ""; 
                    $gameTemp.passBgOffsetTop = 0;
                    $gameTemp.passBgOffsetBottom = 0;
                    for (let i = 0; i < 4; i++) {
                        $gameTemp['passCardVis' + i] = false;
                        $gameTemp.passCardOpacity[i] = 0;
                    }

                    $gameTemp.hudShowMementos = false;
                    $gameTemp.hudShowMementosList = false;
                    $gameTemp.hudShowMementosAction = false;
                    $gameTemp.hudShowMementosConfirm = false;
                    $gameTemp.hudShowAbilitiesCat = false;
                    $gameTemp.hudShowAbilitiesTabs = false;
                    $gameTemp.hudShowAbilitiesList = false;
                    $gameTemp.hudShowAbilitiesDesc = false;
                    $gameTemp.hudShowEquipTabs = false;
                    $gameTemp.hudShowEquipList = false;
                    $gameTemp.hudShowEquipDesc = false;
                    $gameTemp.hudShowEquipStat = false;
                    
                    // Options flags
                    $gameTemp.hudShowOptionsCat = false;
                    $gameTemp.hudShowOptionsList = false;
                    $gameTemp.hudShowOptionsDesc = false;
                    $gameTemp.hudShowMainMenu = false;
                    $gameTemp._directPassMode = false;
                    $gameTemp.hudShowOptionsBindPrompt = false;
                    $gameTemp.optionsRebindActive = false;

                    this._commandWindow.hide();
                    this._commandWindow.deactivate();
                    this._statusWindow.hide();
                    this._statusWindow.deactivate();
                    if (this._passWindow) {
                        this._passWindow.hide();
                        this._passWindow.deactivate(); 
                    }
                    allWindows.forEach(item => {
                        if (item.win) {
                            item.win.hide();
                            item.win.deactivate();
                            item.win.x = item.win._baseX;
                            item.win.y = item.win._baseY;
                        }
                    });
                }
                return; 
            }

            // Submenu OUT Animation Math
            allWindows.forEach(item => {
                const win = item.win;
                if (win && win._closingDelay > 0) {
                    win._closingDelay--;
                    const progress = (CURSOR_ANIMATION_DELAY - win._closingDelay) / CURSOR_ANIMATION_DELAY;
                    const easeIn = Math.pow(progress, 3);
                    const currentOffsetX = item.offsetX * easeIn;
                    const currentOffsetY = item.offsetY * easeIn;

                    win.x = win._baseX + currentOffsetX;
                    win.y = win._baseY + currentOffsetY;

                    if (win._closingDelay === 0) {
                        win.hide();
                        win.x = win._baseX;
                        win.y = win._baseY;
                    }
                }
            });

            return;
        }
        _Scene_Map_update.call(this);
    };

    Scene_Map.prototype.updateCallMenu = function() {
        if (this.isMenuEnabled() && (this.isMenuCalled() || Input.isTriggered('cancel') || Input.isTriggered('menu'))) {
            this.menuCalling = false;
            this.openCustomOmoriMenu();
        } else if (this.isMenuEnabled() && Input.isTriggered('pageup') && (!$gameTemp || !$gameTemp._customMenuOpen)) {
            this.openCustomOmoriMenu(true);
            this._commandWindow.select(0);
            this.commandPass();
        }
    };

    Scene_Map.prototype.calcWindowHeight = function(numLines, selectable) {
        if (selectable) return Window_Selectable.prototype.fittingHeight(numLines);
        return Window_Base.prototype.fittingHeight(numLines);
    };

    // =======================================================
    // 1.8. THE "STUN" LOCK
    // =======================================================
    const isReverieMenuLocked = function(win) {
        if (!$gameTemp) return false;
        if ($gameTemp.optionsRebindActive) return true;
        if ($gameTemp._menuCursorDelay > 0) return true;
        if ($gameTemp._globalClosingDelay > 0) return true;
        if (win && win._closingDelay > 0) return true;
        if ($gameTemp.passAnimState > 0 && $gameTemp.passAnimState !== 3) return true;
        
        // 1. Prevent sequence corruption during Equip transitions (Exclude state 4)
        if ($gameTemp.equipAnimState > 0 && $gameTemp.equipAnimState < 9 && $gameTemp.equipAnimState !== 4) return true;
        
        if ($gameTemp.equipDescInTimer > 0) return true;
        if ($gameTemp.equipStatInTimer > 0) return true;
        if ($gameTemp.equipDescOutDelay > 0) return true;
        if ($gameTemp.equipStatOutDelay > 0) return true;

        if ($gameTemp.abilTabsInTimer > 0) return true;
        if ($gameTemp.abilDescInTimer > 0) return true;
        if ($gameTemp.abilDescOutDelay > 0) return true;
        if ($gameTemp.abilCatInTimer > 0) return true;

        if ($gameTemp.optCatInTimer > 0) return true;
        if ($gameTemp.optListInTimer > 0) return true;
        if ($gameTemp.optDescInTimer > 0) return true;
        if ($gameTemp.optDescOutTimer > 0) return true;
        if ($gameTemp.optListOutTimer > 0) return true;
        if ($gameTemp.optCatOutTimer > 0) return true;
        
        // 2. Prevent the "Invisible Active Window" crash by checking if ANY submenu is currently sliding away
        const scn = SceneManager._scene;
        if (scn) {
            if (scn._equipListWindow && scn._equipListWindow._closingDelay > 0) return true;
            if (scn._mementosItemWindow && scn._mementosItemWindow._closingDelay > 0) return true;
            if (scn._mementosActionWindow && scn._mementosActionWindow._closingDelay > 0) return true;
            if (scn._mementosConfirmWindow && scn._mementosConfirmWindow._closingDelay > 0) return true;
            if (scn._abilitiesCatWindow && scn._abilitiesCatWindow._closingDelay > 0) return true;
            if (scn._abilitiesTabsWindow && scn._abilitiesTabsWindow._closingDelay > 0) return true;
            if (scn._abilitiesListWindow && scn._abilitiesListWindow._closingDelay > 0) return true;
            if (scn._optionsCatWindow && scn._optionsCatWindow._closingDelay > 0) return true;
            if (scn._optionsListWindow && scn._optionsListWindow._closingDelay > 0) return true;
            if (scn._optionsConfirmWindow && scn._optionsConfirmWindow._closingDelay > 0) return true;
        }
        return false;
    };

    const _Window_Selectable_processCursorMove = Window_Selectable.prototype.processCursorMove;
    Window_Selectable.prototype.processCursorMove = function() {
        if (isReverieMenuLocked(this)) return; 
        _Window_Selectable_processCursorMove.call(this);
    };

    const _Window_Selectable_processHandling = Window_Selectable.prototype.processHandling;
    Window_Selectable.prototype.processHandling = function() {
        if (isReverieMenuLocked(this)) return; 
        _Window_Selectable_processHandling.call(this);
    };

    const _Window_Selectable_processTouch = Window_Selectable.prototype.processTouch;
    Window_Selectable.prototype.processTouch = function() {
        if ($gameTemp && $gameTemp._customMenuOpen) return; 

        if (isReverieMenuLocked(this)) return; 
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
            this._closingDelay = 0; 
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

        // COMPLETELY DESTROY ARROWS AND SCROLLBAR FOR ALL WINDOWS
        const _update = windowClass.prototype.update;
        windowClass.prototype.update = function() {
            if (_update) _update.call(this);
            if (this._upArrowSprite) this._upArrowSprite.visible = false;
            if (this._downArrowSprite) this._downArrowSprite.visible = false;
            if (this._leftArrowSprite) this._leftArrowSprite.visible = false;
            if (this._rightArrowSprite) this._rightArrowSprite.visible = false;
            if (this._scrollBaseSprite) this._scrollBaseSprite.visible = false;
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

        if (this.index() === index && this.active) {
            const cursorX = textX - CURSOR_DRAW_SIZE - 5 + GLOBAL_CURSOR_X_OFFSET;; 
            const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2 + (this.customCursorOffsetY || 0); 
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
    Window_MenuCommand.prototype.customCursorOffsetY = MAIN_MENU_CURSOR_Y_OFFSET; // Added offset
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
        this.addCommand("Pass", 'pass', true);
        this.addCommand("Equip", 'equip');
        this.addCommand("Mementos", 'mementos');
        this.addCommand("Abilities", 'abilities'); 
        this.addCommand("Options", 'options', true);
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
    // NEW: OPTIONS MENU CONTROLLER & CREATION
    // =======================================================
    
    // 1. OPTIONS CATEGORY (General, Audio, Controls, System)
    function Window_MenuOptionsCat() { this.initialize(...arguments); }
    Window_MenuOptionsCat.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MenuOptionsCat.prototype.constructor = Window_MenuOptionsCat;
    applySkeletonStyle(Window_MenuOptionsCat);
    Window_MenuOptionsCat.prototype.maxCols = function() { return 4; }; 
    Window_MenuOptionsCat.prototype.makeCommandList = function() {
        this.addCommand("General", 'general');
        this.addCommand("Audio", 'audio');
        this.addCommand("Controls", 'controls');
        this.addCommand("System", 'system');
    };
    Window_MenuOptionsCat.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuOptionsCat.prototype.select = function(index) {
        customSelectRefresh.call(this, index);
        if (index >= 0 && SceneManager._scene && SceneManager._scene._optionsListWindow) {
            const sym = this.commandSymbol(index);
            if (sym) {
                SceneManager._scene._optionsListWindow.setCategory(sym);
                SceneManager._scene._optionsListWindow.deselect();
            }
        }
    };
    Window_MenuOptionsCat.prototype.customCursorOffsetY = MEMENTOS_CAT_CURSOR_Y_OFFSET;

    // 2. OPTIONS LIST (Handles Indented Sub-Items & Instant Modifiers)
    function Window_MenuOptionsList() { this.initialize(...arguments); }
    Window_MenuOptionsList.prototype = Object.create(Window_Command.prototype);
    Window_MenuOptionsList.prototype.constructor = Window_MenuOptionsList;
    applySkeletonStyle(Window_MenuOptionsList);
    
    Window_MenuOptionsList.prototype.setCategory = function(category) {
        this._category = category;
        this._bindMode = (category === 'controls') ? 1 : 0;
        this.refresh();
    };

    Window_MenuOptionsList.prototype.itemHeight = function() {
        if (this._category === 'general') return 88; 
        if (this._category === 'controls') return 37;
        return Window_Selectable.prototype.itemHeight.call(this);
    };

    Window_MenuOptionsList.prototype.itemRect = function(index) {
        const rect = Window_Command.prototype.itemRect.call(this, index);
        if (this._category === 'controls') rect.y += 70; 
        if (this._category === 'audio') rect.y += OPTIONS_AUDIO_Y_OFFSET;
        if (this._category === 'system') rect.y += OPTIONS_SYSTEM_Y_OFFSET;
        return rect;
    };

    Window_MenuOptionsList.prototype.clearItem = function(index) {
        const rect = this.itemRect(index);
        this.contents.clearRect(0, rect.y, this.contentsWidth(), rect.height);
    };

    Window_MenuOptionsList.prototype.isCommandEnabled = function(index) {
        const item = this._list && this._list[index];
        return !item || item.enabled !== false;
    };

    Window_MenuOptionsList.prototype.makeCommandList = function() {
        const category = this._category || 'general';
        const isTitleOptions = SceneManager._scene && typeof Scene_ReverieTitleOptions !== 'undefined'
            && SceneManager._scene instanceof Scene_ReverieTitleOptions;
        switch (category) {
            case 'general':
                this.addCommand("Screen Resolution", 'opt_res');
                this.addCommand("Text Skip", 'opt_skip');
                this.addCommand("Battle Text", 'opt_btl');
                this.addCommand("Character Movement", 'opt_move');
                break;
            case 'audio':
                this.addCommand("BGM Volume", 'opt_bgm');
                this.addCommand("BGS Volume", 'opt_bgs');
                this.addCommand("ME Volume", 'opt_me');
                this.addCommand("SE Volume", 'opt_se');
                break;
            case 'controls':
                this.addCommand("Up", 'key_up', true, 'bind');
                this.addCommand("Down", 'key_down', true, 'bind');
                this.addCommand("Left", 'key_left', true, 'bind');
                this.addCommand("Right", 'key_right', true, 'bind');
                this.addCommand("Confirm", 'key_ok', true, 'bind');
                this.addCommand("Cancel / Menu", 'key_cancel', true, 'bind');
                this.addCommand("Run", 'key_shift', true, 'bind');
                this.addCommand("Pass", 'key_pass', true, 'bind');
                this.addCommand("", 'key_reset', true, 'reset');
                break;
            case 'system':
                if (isTitleOptions) {
                    this.addCommand("Locked: Load Game", 'sys_load', false);
                    this.addCommand("Locked: To Title", 'sys_title', false);
                } else {
                    this.addCommand("Load Game", 'sys_load', true); 
                    this.addCommand("To Title", 'sys_title', true);
                }
                this.addCommand("Exit Game", 'sys_exit', true);
                break;
        }
    };

    Window_MenuOptionsList.prototype.drawItem = function(index) {
        if (!this._list || !this._list[index]) return; 
        
        const rect = this.itemLineRect(index);
        const symbol = this.commandSymbol(index);
        const name = this.commandName(index);
        const ext = this.currentExt ? this._list[index].ext : null;

        const clearX = rect.x - CURSOR_DRAW_SIZE - 20;
        const clearY = rect.y - 4; 
        const clearW = rect.width + CURSOR_DRAW_SIZE + 400; 
        const clearH = this.itemHeight() + 8;
        this.contents.clearRect(clearX, clearY, clearW, clearH);

        this.changePaintOpacity(this.isCommandEnabled(index));
        let textX = rect.x + CURSOR_DRAW_SIZE + 10; 
        
        let subChoices = [];
        let subIndex = 0;
        if (this._category === 'general') {
            if (symbol === 'opt_res') { subChoices = ["1x", "Fullscreen"]; subIndex = ConfigManager.customResIndex !== undefined ? ConfigManager.customResIndex : 0; }
            if (symbol === 'opt_skip') { subChoices = ["OFF", "ON"]; subIndex = ConfigManager.commandRemember ? 1 : 0; }
            if (symbol === 'opt_btl') { subChoices = ["Fast", "Medium", "Slow"]; subIndex = ConfigManager.battleTextSpeed !== undefined ? ConfigManager.battleTextSpeed : 1; }
            if (symbol === 'opt_move') { subChoices = ["Walk", "Dash"]; subIndex = ConfigManager.alwaysDash ? 1 : 0; }
        }

        if (DEBUG_MODE) {
            if (this._category === 'general') {
                this.drawText(name, textX, rect.y, 250, 'left'); 
                let curX = textX + OPTIONS_GEN_SUB_START_X; 
                
                const originalFontSize = this.contents.fontSize;
                this.contents.fontSize = originalFontSize - 0; 
                
                for (let i = 0; i < subChoices.length; i++) {
                    this.changeTextColor(i === subIndex ? "#ffffff" : "#888888");
                    const cW = this.textWidth(subChoices[i]) + 20;
                    this.drawText(subChoices[i], curX, rect.y + 34, cW, 'left'); 
                    curX += OPTIONS_GEN_SUB_SPACING;
                }
                this.contents.fontSize = originalFontSize;
                this.resetTextColor();
            } else if (this._category === 'audio') {
                this.drawText(name, textX, rect.y, 250, 'left');
                let vol = 0;
                if (symbol === 'opt_bgm') vol = ConfigManager.bgmVolume;
                if (symbol === 'opt_bgs') vol = ConfigManager.bgsVolume;
                if (symbol === 'opt_me') vol = ConfigManager.meVolume;
                if (symbol === 'opt_se') vol = ConfigManager.seVolume;
                this.drawText(vol + "%", rect.x + rect.width - 60, rect.y, 60, 'right'); 
            } else if (this._category === 'controls') {
                if (symbol === 'key_reset') {
                    this.drawText("Reset Keys", textX + OPTIONS_CTRL_KEY_X, rect.y, 150, 'left');
                    this.drawText("Reset Pad", textX + OPTIONS_CTRL_PAD_X, rect.y, 150, 'left');
                } else {
                    this.drawText(name, textX, rect.y, 250, 'left');
                    this.drawText("[Key]", textX + OPTIONS_CTRL_KEY_X, rect.y, 100, 'left');
                    this.drawText("(Pad)", textX + OPTIONS_CTRL_PAD_X, rect.y, 100, 'left');
                }
            } else {
                this.drawText(name, textX, rect.y, 250, 'left');
            }
        }

        if (this._category === 'general') {
            let curX = textX + OPTIONS_GEN_SUB_START_X; 
            for (let i = 0; i < subChoices.length; i++) {
                if (i === subIndex) { 
                    const c2X = curX - CURSOR_DRAW_SIZE + GLOBAL_CURSOR_X_OFFSET + 4 + OPTIONS_SUB_CURSOR_X_OFFSET;
                    const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
                    if (cursorBmp.isReady()) {
                        const c2Y = rect.y + 34 + (24 - CURSOR_DRAW_SIZE) / 2 + OPTIONS_SUB_CURSOR_Y_OFFSET;
                        this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, c2X, c2Y, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
                    } else {
                        cursorBmp.addLoadListener(() => this.redrawItem(index));
                    }
                }
                curX += OPTIONS_GEN_SUB_SPACING;
            }
        }

        // MAIN CURSOR
        if (this.index() === index && this.active) {
            const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
            let cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2 + OPTIONS_LIST_CURSOR_Y_OFFSET; 
            if (this._category === 'general') cursorY = rect.y + (34 - CURSOR_DRAW_SIZE) / 2; 
            
            cursorY += OPTIONS_MAIN_CURSOR_Y_OFFSET;

            if (cursorBmp.isReady()) {
                if (this._category !== 'controls') {
                    const cursorX1 = textX - CURSOR_DRAW_SIZE - 5 + GLOBAL_CURSOR_X_OFFSET + OPTIONS_MAIN_CURSOR_X_OFFSET; 
                    this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX1, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
                }
                
                if (this._category === 'controls' && this._bindMode > 0) {
                    const cursorX3 = (this._bindMode === 1 ? textX + OPTIONS_CTRL_KEY_X : textX + OPTIONS_CTRL_PAD_X) - CURSOR_DRAW_SIZE - 5 + GLOBAL_CURSOR_X_OFFSET + OPTIONS_MAIN_CURSOR_X_OFFSET;
                    this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX3, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
                }

            } else {
                cursorBmp.addLoadListener(() => this.redrawItem(index));
            }
        }
    };
    
    Window_MenuOptionsList.prototype.select = customSelectRefresh;

    Window_MenuOptionsList.prototype.processCursorMove = function() {
        if (this.isCursorMovable()) {
            const lastIndex = this.index();
            
            if (Input.isRepeated("down")) { this.cursorDown(Input.isTriggered("down")); }
            if (Input.isRepeated("up")) { this.cursorUp(Input.isTriggered("up")); }
            if (this.index() !== lastIndex) { SoundManager.playCursor(); }
            
            if (Input.isRepeated("right")) this.cursorRight(Input.isTriggered("right"));
            if (Input.isRepeated("left")) this.cursorLeft(Input.isTriggered("left"));
        }
    };

    Window_MenuOptionsList.prototype.cursorRight = function(trigger) {
        if (!this.active) return;
        const symbol = this.commandSymbol(this.index());
        
        if (this._category === 'general') {
            if (!trigger) return; 
            if (symbol === 'opt_res') { ConfigManager.customResIndex = Math.min(1, (ConfigManager.customResIndex !== undefined ? ConfigManager.customResIndex : 0) + 1); setTimeout(applyResolution, 500); }
            if (symbol === 'opt_skip') ConfigManager.commandRemember = true;
            if (symbol === 'opt_btl') ConfigManager.battleTextSpeed = Math.min(2, (ConfigManager.battleTextSpeed !== undefined ? ConfigManager.battleTextSpeed : 1) + 1);
            if (symbol === 'opt_move') ConfigManager.alwaysDash = true;
            SoundManager.playCursor();
            this.redrawItem(this.index());
        } 
        else if (this._category === 'audio') {
            let amt = trigger ? 1 : 5; 
            if (symbol === 'opt_bgm') { ConfigManager.bgmVolume = Math.min(100, ConfigManager.bgmVolume + amt); AudioManager.playBgm({name: "", volume: ConfigManager.bgmVolume}); }
            if (symbol === 'opt_bgs') ConfigManager.bgsVolume = Math.min(100, ConfigManager.bgsVolume + amt);
            if (symbol === 'opt_me') ConfigManager.meVolume = Math.min(100, ConfigManager.meVolume + amt);
            if (symbol === 'opt_se') ConfigManager.seVolume = Math.min(100, ConfigManager.seVolume + amt);
            SoundManager.playCursor();
            this.redrawItem(this.index());
        }
        else if (this._category === 'controls') { 
            if (!trigger) return;
            this._bindMode = 2;
            SoundManager.playCursor();
            this.redrawItem(this.index());
        }
    };

    Window_MenuOptionsList.prototype.cursorLeft = function(trigger) {
        if (!this.active) return;
        const symbol = this.commandSymbol(this.index());
        
        if (this._category === 'general') {
            if (!trigger) return; 
            if (symbol === 'opt_res') { ConfigManager.customResIndex = Math.max(0, (ConfigManager.customResIndex !== undefined ? ConfigManager.customResIndex : 0) - 1); setTimeout(applyResolution, 500); }
            if (symbol === 'opt_skip') ConfigManager.commandRemember = false;
            if (symbol === 'opt_btl') ConfigManager.battleTextSpeed = Math.max(0, (ConfigManager.battleTextSpeed !== undefined ? ConfigManager.battleTextSpeed : 1) - 1);
            if (symbol === 'opt_move') ConfigManager.alwaysDash = false;
            SoundManager.playCursor();
            this.redrawItem(this.index());
        } 
        else if (this._category === 'audio') {
            let amt = trigger ? 1 : 5; 
            if (symbol === 'opt_bgm') { ConfigManager.bgmVolume = Math.max(0, ConfigManager.bgmVolume - amt); AudioManager.playBgm({name: "", volume: ConfigManager.bgmVolume}); }
            if (symbol === 'opt_bgs') ConfigManager.bgsVolume = Math.max(0, ConfigManager.bgsVolume - amt);
            if (symbol === 'opt_me') ConfigManager.meVolume = Math.max(0, ConfigManager.meVolume - amt);
            if (symbol === 'opt_se') ConfigManager.seVolume = Math.max(0, ConfigManager.seVolume - amt);
            SoundManager.playCursor();
            this.redrawItem(this.index());
        }
        else if (this._category === 'controls') {
            if (!trigger) return;
            this._bindMode = 1;
            SoundManager.playCursor();
            this.redrawItem(this.index());
        }
    };

    Window_MenuOptionsList.prototype.processOk = function() {
        if (!this.isCommandEnabled(this.index())) {
            SoundManager.playBuzzer();
            return;
        }
        const symbol = this.commandSymbol(this.index());
        if (this._category === 'system') {
            if (symbol === 'sys_load') { SoundManager.playOk(); this.callHandler('sys_load'); } 
            else if (symbol === 'sys_title' || symbol === 'sys_exit') { SoundManager.playOk(); this.callHandler('sys_confirm'); }
        } else if (this._category === 'controls') {
            if (symbol === 'key_reset') {
                SoundManager.playOk();
                if (SceneManager._scene && SceneManager._scene.resetOptionsBinding) {
                    SceneManager._scene.resetOptionsBinding(this._bindMode === 2 ? 'gamepad' : 'keyboard');
                }
            } else if (controlActionForSymbol(symbol, this._bindMode === 2 ? 'gamepad' : 'keyboard')) {
                SoundManager.playOk();
                if (SceneManager._scene && SceneManager._scene.startOptionsRebind) {
                    SceneManager._scene.startOptionsRebind(symbol, this._bindMode === 2 ? 'gamepad' : 'keyboard');
                }
            }
        }
    };

    Window_MenuOptionsList.prototype.processCancel = function() {
        Window_Command.prototype.processCancel.call(this);
    };

    // PASS MENU CONTROLLER
    function Window_MenuPass() { this.initialize(...arguments); }
    Window_MenuPass.prototype = Object.create(Window_Selectable.prototype);
    Window_MenuPass.prototype.constructor = Window_MenuPass;
    applySkeletonStyle(Window_MenuPass);

    // FIX: Force MZ to read inputs even if the window list is empty!
    Window_MenuPass.prototype.processCursorMove = function() {
        if (this.active) {
            if (Input.isRepeated("right")) this.cursorRight();
            if (Input.isRepeated("left")) this.cursorLeft();
        }
    };
    Window_MenuPass.prototype.processHandling = function() {
        if (this.active) {
            if (Input.isTriggered("ok")) this.processOk();
            else if (Input.isTriggered("cancel")) this.processCancel();
        }
    };

    Window_MenuPass.prototype.cursorRight = function() {
        if ($gameTemp.passAnimState !== 3) return; // 3 is Idle
        const len = $gameParty.members().length;
        if (len <= 1) return;
        $gameTemp.passLeaderTextVis = false;
        $gameTemp.passPrevIndex = $gameTemp.passSelectedIndex;
        $gameTemp.passSelectedIndex = ($gameTemp.passSelectedIndex + 1) % len;
        $gameTemp.passAnimState = 4; // Shift
        $gameTemp.passAnimTimer = 0;
        SoundManager.playCursor();
    };
    Window_MenuPass.prototype.cursorLeft = function() {
        if ($gameTemp.passAnimState !== 3) return;
        const len = $gameParty.members().length;
        if (len <= 1) return;
        $gameTemp.passLeaderTextVis = false;
        $gameTemp.passPrevIndex = $gameTemp.passSelectedIndex;
        $gameTemp.passSelectedIndex = ($gameTemp.passSelectedIndex - 1 + len) % len;
        $gameTemp.passAnimState = 4; // Shift
        $gameTemp.passAnimTimer = 0;
        SoundManager.playCursor();
    };
    Window_MenuPass.prototype.processOk = function() {
        if (this.active) this.callOkHandler();
    };
    Window_MenuPass.prototype.processCancel = function() {
        if (this.active) this.callCancelHandler();
    };

    Scene_Map.prototype.updatePassAnimations = function() {
        if (!$gameTemp || !$gameTemp.hudShowPass || $gameTemp.passAnimState === 0) return;
        
        $gameTemp.passAnimTimer++;
        const state = $gameTemp.passAnimState;
        
        if (state === 1) { // 1. BG OUT
            const prog = Math.pow($gameTemp.passAnimTimer / PASS_BG_ANIM_MAX, 3);
            $gameTemp.passBgOffsetTop = -150 * prog; // Main Menu UP
            $gameTemp.passBgOffsetBottom = 350 * prog; // Status Cards DOWN
            if ($gameTemp.passAnimTimer >= PASS_BG_ANIM_MAX) {
                $gameTemp.passAnimState = 2;
                $gameTemp.passAnimTimer = 0;
                $gameTemp.passMidCardVis = true;
            }
        }
        else if (state === 2) { // 2. Emerge IN (SWIRLED)
            const rawProg = $gameTemp.passAnimTimer / PASS_ANIM_IN_MAX;
            const prog = 1 - Math.pow(1 - rawProg, 3); // Ease Out
            
            // Math.sin(rawProg * PI) creates an arc that peaks at 50% of the animation
            const arcPower = Math.sin(rawProg * Math.PI) * 150; 

            for (let i = 0; i < 4; i++) {
                const currentSlot = (i - $gameTemp.passSelectedIndex + 4) % 4;
                const startX = passOriginX(currentSlot);
                const startY = passOriginY(currentSlot);
                
                let arcX = 0;
                let arcY = 0;
                // Add an outward bulge to the trajectory based on the target slot
                if (currentSlot === 0) arcX = arcPower;      // Top card arcs Right
                else if (currentSlot === 1) arcY = arcPower; // Right card arcs Down
                else if (currentSlot === 2) arcX = -arcPower;// Bottom card arcs Left
                else if (currentSlot === 3) arcY = -arcPower;// Left card arcs Up

                $gameTemp.passCardX[i] = startX + ((passSlotX(currentSlot) - startX) * prog) + arcX;
                $gameTemp.passCardY[i] = startY + ((passSlotY(currentSlot) - startY) * prog) + arcY;
                $gameTemp.passCardOpacity[i] = 255 * prog;
            }
            if ($gameTemp.passAnimTimer >= PASS_ANIM_IN_MAX) {
                $gameTemp.passAnimState = 3; 
                $gameTemp.passLeaderTextVis = true;
            }
        }
        else if (state === 3) { // 3. Idle
            for (let i = 0; i < 4; i++) {
                const currentSlot = (i - $gameTemp.passSelectedIndex + 4) % 4;
                $gameTemp.passCardX[i] = passSlotX(currentSlot);
                $gameTemp.passCardY[i] = passSlotY(currentSlot);
                $gameTemp.passCardOpacity[i] = 255;
            }
        }
        else if (state === 4) { // 4. Shift Left/Right
            const rawProg = $gameTemp.passAnimTimer / PASS_ANIM_SHIFT_MAX;
            const prog = rawProg < 0.5 ? 4 * rawProg * rawProg * rawProg : 1 - Math.pow(-2 * rawProg + 2, 3) / 2;
            for (let i = 0; i < 4; i++) {
                const prevSlot = (i - $gameTemp.passPrevIndex + 4) % 4;
                const nextSlot = (i - $gameTemp.passSelectedIndex + 4) % 4;
                const startX = passSlotX(prevSlot); const startY = passSlotY(prevSlot);
                const endX = passSlotX(nextSlot);   const endY = passSlotY(nextSlot);
                $gameTemp.passCardX[i] = startX + ((endX - startX) * prog);
                $gameTemp.passCardY[i] = startY + ((endY - startY) * prog);
            }
            if ($gameTemp.passAnimTimer >= PASS_ANIM_SHIFT_MAX) {
                $gameTemp.passAnimState = 3;
                $gameTemp.passLeaderTextVis = true;
            }
        }
        else if (state === 5) { // 5. Cancel OUT (SWIRLED)
            const rawProg = $gameTemp.passAnimTimer / PASS_ANIM_IN_MAX;
            const prog = Math.pow(rawProg, 3); // Ease In
            
            // Reversing the arc power
            const arcPower = Math.sin((1 - rawProg) * Math.PI) * 150;

            for (let i = 0; i < 4; i++) {
                const currentSlot = (i - $gameTemp.passSelectedIndex + 4) % 4;
                const startX = passOriginX(currentSlot);
                const startY = passOriginY(currentSlot);
                
                let arcX = 0;
                let arcY = 0;
                if (currentSlot === 0) arcX = arcPower;      
                else if (currentSlot === 1) arcY = arcPower; 
                else if (currentSlot === 2) arcX = -arcPower;
                else if (currentSlot === 3) arcY = -arcPower;

                $gameTemp.passCardX[i] = passSlotX(currentSlot) + ((startX - passSlotX(currentSlot)) * prog) + arcX;
                $gameTemp.passCardY[i] = passSlotY(currentSlot) + ((startY - passSlotY(currentSlot)) * prog) + arcY;
                $gameTemp.passCardOpacity[i] = 255 * (1 - prog);
            }
            if ($gameTemp.passAnimTimer >= PASS_ANIM_IN_MAX) {
                $gameTemp.passAnimState = 6;
                $gameTemp.passAnimTimer = 0;
                $gameTemp.passMidCardVis = false;
            }
        }
        else if (state === 6) { // 6. BG IN (Cancel Finish)
            if ($gameTemp._directPassMode) {
                $gameTemp.passAnimState = 0;
                $gameTemp.hudShowPass = false;
                this._passWindow.deactivate();
                this.closeCustomOmoriMenu();
            } else {
                const prog = 1 - Math.pow(1 - ($gameTemp.passAnimTimer / PASS_BG_ANIM_MAX), 3); 
                $gameTemp.passBgOffsetTop = -150 * (1 - prog);
                $gameTemp.passBgOffsetBottom = 350 * (1 - prog);
                if ($gameTemp.passAnimTimer >= PASS_BG_ANIM_MAX) {
                    $gameTemp.passAnimState = 0;
                    $gameTemp.hudShowPass = false;
                
                    $gameTemp.passBgOffsetTop = 0;
                    $gameTemp.passBgOffsetBottom = 0;
                    
                    this._commandWindow.activate(); 
                }
            }
        }
        else if (state === 7) { // 7. Enter Confirm Fade
            const prog = $gameTemp.passAnimTimer / PASS_ANIM_FADE_MAX;
            $gameTemp.passMidCardVis = false; 
            for (let i = 0; i < 4; i++) $gameTemp.passCardOpacity[i] = 255 * (1 - prog);
            if ($gameTemp.passAnimTimer >= PASS_ANIM_FADE_MAX) {
                $gameTemp.passAnimState = 8;
                $gameTemp.passAnimTimer = 0;
                $gameTemp.passPhotoVis = true;
            }
        }
        else if (state === 8) { // 8. Photo Drop In
            const prog = 1 - Math.pow(1 - ($gameTemp.passAnimTimer / PASS_ANIM_DROP_MAX), 3); 
            $gameTemp.passPhotoY = -800 + (800 * prog);
            if ($gameTemp.passAnimTimer >= PASS_ANIM_DROP_MAX) {
                $gameTemp.passAnimState = 9;
                $gameTemp.passAnimTimer = 0;
            }
        }
        else if (state === 9) { // 9. Photo Pause
            $gameTemp.passPhotoY = 0;
            if ($gameTemp.passAnimTimer >= PASS_ANIM_WAIT_MAX) {
                $gameTemp.passAnimState = 10;
                $gameTemp.passAnimTimer = 0;
            }
        }
        else if (state === 10) { // 10. Photo Drop Out & Swap
            const prog = Math.pow($gameTemp.passAnimTimer / PASS_ANIM_DROP_MAX, 3);
            $gameTemp.passPhotoY = 800 * prog;
            if ($gameTemp.passAnimTimer >= PASS_ANIM_DROP_MAX) {
                const nextIndex = $gameTemp.passSelectedIndex;
                if (nextIndex > 0 && nextIndex < $gameParty.members().length) {
                    $gameParty.swapOrder(0, nextIndex);
                    $gamePlayer.refresh();
                }
                $gameTemp.passAnimState = 0;
                
                $gameTemp.passPhotoVis = false;
                $gameTemp.passMidCardVis = false;
                $gameTemp.passLeaderTextVis = false;
                for (let i = 0; i < 4; i++) {
                    $gameTemp['passCardVis' + i] = false;
                    $gameTemp.passCardOpacity[i] = 0;
                }
                

                this.closeCustomOmoriMenu();
            }
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
    Window_MenuMementosCat.prototype.customCursorOffsetY = MEMENTOS_CAT_CURSOR_Y_OFFSET;

    // =======================================================
    // 6.5. ABILITIES: CATEGORIES & TABS & LIST
    // =======================================================
    function Window_MenuAbilitiesCat() { this.initialize(...arguments); }
    Window_MenuAbilitiesCat.prototype = Object.create(Window_HorzCommand.prototype);
    Window_MenuAbilitiesCat.prototype.constructor = Window_MenuAbilitiesCat;
    applySkeletonStyle(Window_MenuAbilitiesCat);
    
    Window_MenuAbilitiesCat.prototype.maxCols = function() { return 5; }; 
    Window_MenuAbilitiesCat.prototype.makeCommandList = function() {
        this.addCommand("Skills", 'skills');
        this.addCommand("Bonds", 'bonds');
    };
    Window_MenuAbilitiesCat.prototype.drawItem = customDrawItemWithCursor;
    Window_MenuAbilitiesCat.prototype.select = customSelectRefresh;
    Window_MenuAbilitiesCat.prototype.customCursorOffsetY = MEMENTOS_CAT_CURSOR_Y_OFFSET; 

    function Window_MenuAbilitiesTabs() { this.initialize(...arguments); }
    Window_MenuAbilitiesTabs.prototype = Object.create(Window_Command.prototype);
    Window_MenuAbilitiesTabs.prototype.constructor = Window_MenuAbilitiesTabs;
    applySkeletonStyle(Window_MenuAbilitiesTabs);
    Window_MenuAbilitiesTabs.prototype.resetFontSettings = function() {
        Window_Command.prototype.resetFontSettings.call(this);
        this.contents.fontSize = EQUIP_TABS_FONT_SIZE;
    };
    Window_MenuAbilitiesTabs.prototype.lineHeight = function() { return EQUIP_TABS_ITEM_HEIGHT; };
    Window_MenuAbilitiesTabs.prototype.itemRect = function(index) {
        const x = 0;
        const y = index * (this.itemHeight() + EQUIP_TABS_ITEM_GAP);
        return new Rectangle(x, y, this.innerWidth, this.itemHeight());
    };
    Window_MenuAbilitiesTabs.prototype.setActorAndCategory = function(actor, category) {
        this._actor = actor;
        this._category = category;
        this.refresh();
    };
    Window_MenuAbilitiesTabs.prototype.makeCommandList = function() {
        for (let i = 0; i < 4; i++) {
            let name = "-------";
            if (this._actor) {
                this._actor._equippedSkills = this._actor._equippedSkills || [null, null, null, null];
                this._actor._equippedBonds = this._actor._equippedBonds || [null, null, null, null];
                const arr = this._category === 'skills' ? this._actor._equippedSkills : this._actor._equippedBonds;
                const skillId = arr[i];
                if (skillId && $dataSkills[skillId]) name = $dataSkills[skillId].name;
            }
            this.addCommand(name, 'ability_slot', true, { slotId: i }); 
        }
    };
    Window_MenuAbilitiesTabs.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const clearX = rect.x - CURSOR_DRAW_SIZE - 20;
        const clearW = rect.width + CURSOR_DRAW_SIZE + 40;
        this.contents.clearRect(clearX, rect.y, clearW, rect.height);
        
        const name = this.commandName(index);
        this.changePaintOpacity(this.isCommandEnabled(index));
        const textWidth = this.textWidth(name);
        const textX = rect.x + CURSOR_DRAW_SIZE + 10; 
        if (DEBUG_MODE) this.drawText(name, textX, rect.y, textWidth, 'left');

        if (this.index() === index && this.active) {
            const cursorX = textX - CURSOR_DRAW_SIZE - 5 + EQUIP_TABS_CURSOR_X_OFFSET + GLOBAL_CURSOR_X_OFFSET; 
            const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2 + EQUIP_TABS_CURSOR_Y_OFFSET; 
            const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
            if (cursorBmp.isReady()) {
                this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
            } else {
                cursorBmp.addLoadListener(() => this.redrawItem(index));
            }
        }
    };
    Window_MenuAbilitiesTabs.prototype.select = customSelectRefresh;

    function Window_MenuAbilitiesList() { this.initialize(...arguments); }
    Window_MenuAbilitiesList.prototype = Object.create(Window_ItemList.prototype);
    Window_MenuAbilitiesList.prototype.constructor = Window_MenuAbilitiesList;
    applySkeletonStyle(Window_MenuAbilitiesList);
    
    Window_MenuAbilitiesList.prototype.maxCols = function() { return 2; }; 
    Window_MenuAbilitiesList.prototype.itemHeight = function() { return Math.floor(this.innerHeight / 2); };
    Window_MenuAbilitiesList.prototype.rowSpacing = function() { return 0; };
    Window_MenuAbilitiesList.prototype.colSpacing = function() { return 0; };
    Window_MenuAbilitiesList.prototype.topRow = function() { return Math.round(this.scrollY() / this.itemHeight()); };
    Window_MenuAbilitiesList.prototype.ensureCursorVisible = function(smooth) {
        const row = Math.floor(this.index() / this.maxCols());
        const maxVisible = 2;
        let currentTopRow = this.topRow();
        if (row < currentTopRow) {
            this.scrollTo(0, row * this.itemHeight());
        } else if (row >= currentTopRow + maxVisible) {
            this.scrollTo(0, (row - maxVisible + 1) * this.itemHeight());
        }
    };
    Window_MenuAbilitiesList.prototype.isEnabled = function(item) { return true; };
    Window_MenuAbilitiesList.prototype.setActorAndSlot = function(actor, slotId, category) {
        this._actor = actor;
        this._slotId = slotId;
        this._category = category;
        this.scrollTo(0, 0); 
        this.refresh();
    };
    Window_MenuAbilitiesList.prototype.includes = function(item) {
        if (!item || !this._actor) return false;
        
        const targetStype = this._category === 'skills' ? 2 : 3; 
        if (item.stypeId !== targetStype) return false;

        const equippedArray = this._category === 'skills' ? this._actor._equippedSkills : this._actor._equippedBonds;
        
        if (equippedArray.includes(item.id)) {
            return false;
        }

        return true;
    };

    Window_MenuAbilitiesList.prototype.makeItemList = function() {
        this._data = this._actor ? this._actor.skills().filter(skill => this.includes(skill)) : [];
    };
    Window_MenuAbilitiesList.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        const rect = this.itemLineRect(index); 
        this.contents.clearRect(rect.x - 40, rect.y, rect.width + 80, rect.height);
        
        const itemName = item ? item.name : "";
        const textY = rect.y + (rect.height - this.lineHeight()) / 2;
        if (DEBUG_MODE) this.drawText(itemName, rect.x + CURSOR_DRAW_SIZE + 10, textY, rect.width, 'left');

        if (this.index() === index && this.active && item) {
             const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
             if (cursorBmp.isReady()) {
                 const cursorX = rect.x + 10 + EQUIP_LIST_CURSOR_X_OFFSET + GLOBAL_CURSOR_X_OFFSET;; 
                 const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2 + EQUIP_LIST_CURSOR_Y_OFFSET;
                 this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
             } else {
                 cursorBmp.addLoadListener(() => this.redrawItem(index));
             }
        }
    };
    Window_MenuAbilitiesList.prototype.select = customSelectRefresh;

    // =======================================================
    // 7. MEMENTOS: ITEM LIST & ACTIONS
    // =======================================================
    function Window_MementosItemList() { this.initialize(...arguments); }
    Window_MementosItemList.prototype = Object.create(Window_ItemList.prototype);
    Window_MementosItemList.prototype.constructor = Window_MementosItemList;
    applySkeletonStyle(Window_MementosItemList);
    
    Window_MementosItemList.prototype.maxCols = function() { return 1; };
    
    Window_MementosItemList.prototype.itemHeight = function() {
        return MEMENTOS_LIST_ITEM_HEIGHT;
    };

    Window_MementosItemList.prototype.includes = function(item) {
        if (!item) return false;
        const cat = this._category;
        if (cat === 'goodies') return item.itypeId === 1 && item.meta.Category !== 'Trinkets'; 
        if (cat === 'trinkets') return item.itypeId === 1 && item.meta.Category === 'Trinkets';
        if (cat === 'keepsakes') return item.itypeId === 2; 
        return false;
    };
    
    Window_MementosItemList.prototype.drawItem = function(index) {
        if (this.itemAt(index)) {
            const rect = this.itemLineRect(index); 
            this.contents.clearRect(rect.x - 40, rect.y, rect.width + 80, rect.height);

            if (this.index() === index && this.active) {
                 const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
                 if (cursorBmp.isReady()) {
                     const cursorX = rect.x + 10 + MEMENTOS_LIST_CURSOR_X_OFFSET + GLOBAL_CURSOR_X_OFFSET;; 
                     const cursorY = rect.y + (MEMENTOS_LIST_ITEM_HEIGHT - CURSOR_DRAW_SIZE) / 2 + MEMENTOS_LIST_CURSOR_Y_OFFSET;
                     this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
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
        if (item && item.itypeId === 1 && item.meta.Category !== 'Trinkets') {
            if (item.occasion === 0 || item.occasion === 2) { 
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
    Window_MementosAction.prototype.customCursorOffsetY = MEMENTOS_ACTION_CURSOR_Y_OFFSET;

    function Window_MementosConfirm() { this.initialize(...arguments); }
    Window_MementosConfirm.prototype = Object.create(Window_Command.prototype);
    Window_MementosConfirm.prototype.constructor = Window_MementosConfirm;
    applySkeletonStyle(Window_MementosConfirm);
    
    Window_MementosConfirm.prototype.maxCols = function() { return 2; }; 
    
    Window_MementosConfirm.prototype.itemRect = function(index) {
        const rect = Window_Command.prototype.itemRect.call(this, index);
        rect.y += 36; 
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
    Window_MementosConfirm.prototype.customCursorOffsetY = MEMENTOS_CONFIRM_CURSOR_Y_OFFSET;

    // =======================================================
    // 7.5. EQUIP: TABS & LIST (SKELETONS)
    // =======================================================
    function Window_MenuEquipTabs() { this.initialize(...arguments); }
    Window_MenuEquipTabs.prototype = Object.create(Window_Command.prototype);
    Window_MenuEquipTabs.prototype.constructor = Window_MenuEquipTabs;
    applySkeletonStyle(Window_MenuEquipTabs);
    Window_MenuEquipTabs.prototype.resetFontSettings = function() {
        Window_Command.prototype.resetFontSettings.call(this);
        this.contents.fontSize = EQUIP_TABS_FONT_SIZE;
    };
    Window_MenuEquipTabs.prototype.lineHeight = function() {
        return EQUIP_TABS_ITEM_HEIGHT;
    };
    Window_MenuEquipTabs.prototype.itemRect = function(index) {
        const x = 0;
        const y = index * (this.itemHeight() + EQUIP_TABS_ITEM_GAP);
        const width = this.innerWidth;
        const height = this.itemHeight();
        return new Rectangle(x, y, width, height);
    };
    Window_MenuEquipTabs.prototype.setActor = function(actor) {
        this._actor = actor;
        this.refresh();
    };
    Window_MenuEquipTabs.prototype.makeCommandList = function() {
        let wName = "-------";
        let cName = "-------";
        let canEquip = true;

        if (this._actor) {
            const equips = this._actor.equips();
            if (equips[0]) wName = equips[0].name;
            if (equips[1]) cName = equips[1].name;
            if (this._actor.actorId() === 1) canEquip = false; 
        }

        this.addCommand("Weapon", 'weapon', false); 
        this.addCommand(wName, 'weapon_name', canEquip); 
        this.addCommand("Charm", 'charm', false);   
        this.addCommand(cName, 'charm_name', canEquip);
    };
    Window_MenuEquipTabs.prototype.cursorDown = function(wrap) {
        Window_Selectable.prototype.cursorDown.call(this, wrap);
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'weapon' || symbol === 'charm') {
            Window_Selectable.prototype.cursorDown.call(this, wrap);
        }
    };
    Window_MenuEquipTabs.prototype.cursorUp = function(wrap) {
        Window_Selectable.prototype.cursorUp.call(this, wrap);
        const symbol = this.commandSymbol(this.index());
        if (symbol === 'weapon' || symbol === 'charm') {
            Window_Selectable.prototype.cursorUp.call(this, wrap);
        }
    };
    Window_MenuEquipTabs.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        const clearX = rect.x - CURSOR_DRAW_SIZE - 20;
        const clearW = rect.width + CURSOR_DRAW_SIZE + 40;
        this.contents.clearRect(clearX, rect.y, clearW, rect.height);
        
        const name = this.commandName(index);
        this.changePaintOpacity(this.isCommandEnabled(index));
        const textWidth = this.textWidth(name);
        const textX = rect.x + CURSOR_DRAW_SIZE + 10; 
        if (DEBUG_MODE) this.drawText(name, textX, rect.y, textWidth, 'left');

        if (this.index() === index && this.active) {
            const cursorX = textX - CURSOR_DRAW_SIZE - 5 + EQUIP_TABS_CURSOR_X_OFFSET + GLOBAL_CURSOR_X_OFFSET;; 
            const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2 + EQUIP_TABS_CURSOR_Y_OFFSET; 
            const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
            if (cursorBmp.isReady()) {
                this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
            } else {
                cursorBmp.addLoadListener(() => this.redrawItem(index));
            }
        }
    };
    Window_MenuEquipTabs.prototype.select = customSelectRefresh;

    function Window_MenuEquipList() { this.initialize(...arguments); }
    Window_MenuEquipList.prototype = Object.create(Window_ItemList.prototype);
    Window_MenuEquipList.prototype.constructor = Window_MenuEquipList;
    applySkeletonStyle(Window_MenuEquipList);
    
    Window_MenuEquipList.prototype.maxCols = function() { return 2; }; 
    Window_MenuEquipList.prototype.itemHeight = function() { return Math.floor(this.innerHeight / 2); };
    Window_MenuEquipList.prototype.rowSpacing = function() { return 0; };
    Window_MenuEquipList.prototype.colSpacing = function() { return 0; };
    Window_MenuEquipList.prototype.topRow = function() {
        return Math.round(this.scrollY() / this.itemHeight());
    };
    Window_MenuEquipList.prototype.ensureCursorVisible = function(smooth) {
        const row = Math.floor(this.index() / this.maxCols());
        const maxVisible = 2;
        let currentTopRow = this.topRow();
        
        if (row < currentTopRow) {
            this.scrollTo(0, row * this.itemHeight());
        } else if (row >= currentTopRow + maxVisible) {
            this.scrollTo(0, (row - maxVisible + 1) * this.itemHeight());
        }
    };

    Window_MenuEquipList.prototype.isEnabled = function(item) { return true; };
    Window_MenuEquipList.prototype.setActorAndSlot = function(actor, slotId) {
        this._actor = actor;
        this._slotId = slotId;
        this.scrollTo(0, 0); 
        this.refresh();
    };
    Window_MenuEquipList.prototype.includes = function(item) {
        if (item === null) return true; 
        if (!this._actor) return false;
        const etypeId = this._actor.equipSlots()[this._slotId];
        if (item.etypeId !== etypeId) return false;
        return this._actor.canEquip(item);
    };
    Window_MenuEquipList.prototype.makeItemList = function() {
        this._data = [];
        if (this.includes(null)) this._data.push(null); 
        const items = $gameParty.allItems().filter(item => item !== null && this.includes(item));
        this._data = this._data.concat(items); 
    };

    Window_MenuEquipList.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        const rect = this.itemLineRect(index); 
        this.contents.clearRect(rect.x - 40, rect.y, rect.width + 80, rect.height);
        
        const itemName = item ? item.name : "-------";
        const textY = rect.y + (rect.height - this.lineHeight()) / 2;
        if (DEBUG_MODE) this.drawText(itemName, rect.x + CURSOR_DRAW_SIZE + 10, textY, rect.width, 'left');

        if (this.index() === index && this.active) {
             const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
             if (cursorBmp.isReady()) {
                 const cursorX = rect.x + 10 + EQUIP_LIST_CURSOR_X_OFFSET + GLOBAL_CURSOR_X_OFFSET;; 
                 const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2 + EQUIP_LIST_CURSOR_Y_OFFSET;
                 this.contents.blt(cursorBmp, 0, 0, CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, cursorX, cursorY, CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE);
             } else {
                 cursorBmp.addLoadListener(() => this.redrawItem(index));
             }
        }
    };
    Window_MenuEquipList.prototype.select = customSelectRefresh;

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
        this.createPassWindow();
        
        this.createMementosSubWindow();
        this.createMementosItemList();
        this.createMementosActionWindow();
        this.createMementosConfirmWindow();

        this.createAbilitiesSubWindows();
        this.createEquipSubWindows();

        this.createOptionsSubWindows();

        this._commandWindow.hide();
        this._commandWindow.deactivate();
        this._statusWindow.hide();
        this._statusWindow.deactivate();
    };

    // 3. OPTIONS EXIT CONFIRMATION
    function Window_OptionsConfirm() { this.initialize(...arguments); }
    Window_OptionsConfirm.prototype = Object.create(Window_Command.prototype);
    Window_OptionsConfirm.prototype.constructor = Window_OptionsConfirm;
    applySkeletonStyle(Window_OptionsConfirm);
    Window_OptionsConfirm.prototype.maxCols = function() { return 2; }; 
    Window_OptionsConfirm.prototype.itemRect = function(index) {
        const rect = Window_Command.prototype.itemRect.call(this, index);
        rect.y += 36; 
        return rect;
    };
    Window_OptionsConfirm.prototype.makeCommandList = function() {
        this.addCommand("Yes", 'yes');
        this.addCommand("No", 'no');
    };
    Window_OptionsConfirm.prototype.drawAllItems = function() {
        if (DEBUG_MODE) {
            const title = $gameTemp.optionsConfirmType === 'sys_title' ? "Return to title screen?" : "Do you want to quit?";
            this.drawText(title, 0, 0, this.innerWidth, 'center');
        }
        Window_Selectable.prototype.drawAllItems.call(this);
    };
    Window_OptionsConfirm.prototype.drawItem = customDrawItemWithCursor;
    Window_OptionsConfirm.prototype.select = customSelectRefresh;
    Window_OptionsConfirm.prototype.customCursorOffsetY = MEMENTOS_CONFIRM_CURSOR_Y_OFFSET;

    Scene_Map.prototype.createOptionsSubWindows = function() {
        const cmdH = this.calcWindowHeight(1, true);
        const y = MENU_MARGIN_Y + cmdH; 
        const h = this.calcWindowHeight(6, true);
        const fullWidth = Graphics.boxWidth - (MENU_MARGIN_X * 2);
        
        const catRect = new Rectangle(MENU_MARGIN_X, y, fullWidth, cmdH);
        this._optionsCatWindow = new Window_MenuOptionsCat(catRect);
        this._optionsCatWindow._baseX = catRect.x;
        this._optionsCatWindow._baseY = y; 
        this._optionsCatWindow.setHandler('ok', this.onOptionsCatOk.bind(this));
        this._optionsCatWindow.setHandler('cancel', this.onOptionsCancel.bind(this));
        this.addWindow(this._optionsCatWindow);
        this._optionsCatWindow.hide(); 
        this._optionsCatWindow.deactivate();

        const listY = y + cmdH;
        const listH = Graphics.boxHeight - listY - MENU_MARGIN_Y;
        this._optionsListWindow = new Window_MenuOptionsList(new Rectangle(MENU_MARGIN_X, listY, fullWidth, listH));
        this._optionsListWindow._baseX = MENU_MARGIN_X;
        this._optionsListWindow._baseY = listY; 
        this._optionsListWindow.setHandler('cancel', this.onOptionsListCancel.bind(this));
        this._optionsListWindow.setHandler('sys_load', this.onOptSysLoad.bind(this));
        this._optionsListWindow.setHandler('sys_confirm', this.onOptSysConfirmOpen.bind(this));
        this.addWindow(this._optionsListWindow);
        this._optionsListWindow.hide();
        this._optionsListWindow.deactivate();

        const confW = 400;
        const confH = this.calcWindowHeight(2, true);
        const confX = (Graphics.boxWidth - confW) / 2; // Centers the box X
        const confY = (Graphics.boxHeight - confH) / 2; // Centers the box Y
        this._optionsConfirmWindow = new Window_OptionsConfirm(new Rectangle(confX, confY, confW, confH));
        this._optionsConfirmWindow._baseX = confX;
        this._optionsConfirmWindow._baseY = confY;
        this._optionsConfirmWindow.setHandler('yes', this.onOptConfirmYes.bind(this));
        this._optionsConfirmWindow.setHandler('no', this.onOptConfirmNo.bind(this));
        this._optionsConfirmWindow.setHandler('cancel', this.onOptConfirmNo.bind(this));
        this.addWindow(this._optionsConfirmWindow);
        this._optionsConfirmWindow.hide();
        this._optionsConfirmWindow.deactivate();
    };

    Scene_Map.prototype.commandOptions = function() {
        $gameTemp.activeMenuSymbol = 'options';
        $gameTemp.equipAnimState = 1; 
        $gameTemp.equipAnimTimer = 0;
        this._commandWindow.deactivate();
    };

    Scene_Map.prototype.onOptionsCancel = function() {
        this._optionsCatWindow.deactivate();
        this._optionsCatWindow.deselect();
        this._optionsListWindow._closingDelay = OPT_ANIM_DELAY; 
        $gameTemp.optListOutTimer = OPT_ANIM_DELAY;
        ConfigManager.save(); 
    };

    Scene_Map.prototype.onOptionsCatOk = function() {
        this._optionsCatWindow.deactivate();
        this._optionsListWindow.setCategory(this._optionsCatWindow.currentSymbol());
        this._optionsListWindow.activate();
        this._optionsListWindow.select(0); // SOLVES ISSUE 1 (Missing index on entry)
    };

    Scene_Map.prototype.onOptionsListCancel = function() {
        this._optionsListWindow.deactivate();
        this._optionsCatWindow.activate();
        ConfigManager.save(); 
    };

    Scene_Map.prototype.onOptSysLoad = function() {
        $gameTemp.returnToOmoriMenuAfterLoad = true;
        SceneManager.push(Scene_Load); // Opens native continue screen without Save
    };

    Scene_Map.prototype.onOptSysConfirmOpen = function() {
        $gameTemp.optionsConfirmType = this._optionsListWindow.commandSymbol(this._optionsListWindow.index());
        this._optionsListWindow.deactivate();
        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
        this._optionsConfirmWindow.show();
        this._optionsConfirmWindow.activate();
        this._optionsConfirmWindow.select(1); // Auto-defaults cursor to "No"
        this._optionsConfirmWindow.refresh();
    };

    Scene_Map.prototype.onOptConfirmYes = function() {
        if ($gameTemp.optionsConfirmType === 'sys_title') SceneManager.goto(Scene_Title);
        else if ($gameTemp.optionsConfirmType === 'sys_exit') SceneManager.exit();
    };

    Scene_Map.prototype.onOptConfirmNo = function() {
        this._optionsConfirmWindow.deactivate();
        this._optionsConfirmWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._optionsListWindow.activate();
    };

    Scene_Map.prototype.startOptionsRebind = function(symbol, device) {
        const action = controlActionForSymbol(symbol, device);
        if (!action) return;

        const item = this._optionsListWindow && this._optionsListWindow._list
            ? this._optionsListWindow._list[this._optionsListWindow.index()]
            : null;
        const label = item ? item.name : "";

        this._optionsListWindow.deactivate();
        Input._reverieLastKeyCode = null;
        Input._reverieLastPadButton = null;

        $gameTemp.optionsRebindActive = true;
        $gameTemp.hudShowOptionsBindPrompt = true;
        $gameTemp.optionsRebindDevice = device;
        $gameTemp.optionsRebindSymbol = symbol;
        $gameTemp.optionsRebindPrompt = device === 'gamepad' ? "PRESS A BUTTON" : "PRESS A KEY";
        $gameTemp.optionsRebindTarget = label;
        $gameTemp.optionsRebindCurrent = controlBindingName(symbol, device);
    };

    Scene_Map.prototype.updateOptionsRebind = function() {
        if (!$gameTemp || !$gameTemp.optionsRebindActive) return;

        const device = $gameTemp.optionsRebindDevice;
        let inputCode = null;
        if (device === 'keyboard' && Input._reverieLastKeyCode !== undefined && Input._reverieLastKeyCode !== null) {
            inputCode = Input._reverieLastKeyCode;
            Input._reverieLastKeyCode = null;
        } else if (device === 'gamepad' && Input._reverieLastPadButton !== undefined && Input._reverieLastPadButton !== null) {
            inputCode = Input._reverieLastPadButton;
            Input._reverieLastPadButton = null;
        }

        if (inputCode === null) return;

        if (setReverieControlBinding(device, $gameTemp.optionsRebindSymbol, inputCode)) {
            $gameTemp.optionsRebindCurrent = device === 'gamepad' ? padNameFromButton(inputCode) : keyNameFromCode(inputCode);
            ConfigManager.save();
            SoundManager.playOk();
        } else {
            SoundManager.playBuzzer();
        }
        this.finishOptionsRebind();
    };

    Scene_Map.prototype.finishOptionsRebind = function() {
        $gameTemp.optionsRebindActive = false;
        $gameTemp.hudShowOptionsBindPrompt = false;
        $gameTemp.optionsRebindDevice = "";
        $gameTemp.optionsRebindSymbol = "";
        $gameTemp.optionsRebindPrompt = "";
        $gameTemp.optionsRebindTarget = "";

        if (this._optionsListWindow) {
            this._optionsListWindow.activate();
            this._optionsListWindow.refresh();
        }
        Input._latestButton = null;
        Input._pressedTime = 0;
    };

    Scene_Map.prototype.resetOptionsBinding = function(device) {
        if (device === 'gamepad') {
            ConfigManager.reveriePadBindings = cloneControlBindings(CONTROL_PAD_DEFAULTS);
        } else {
            ConfigManager.reverieKeyBindings = cloneControlBindings(CONTROL_KEY_DEFAULTS);
        }
        applyReverieInputBindings();
        ConfigManager.save();
        if (this._optionsListWindow) this._optionsListWindow.refresh();
    };

    // =======================================================
    // 8A. TITLE SCREEN: OPTIONS-ONLY SCENE
    // =======================================================
    function Scene_ReverieTitleOptions() { this.initialize(...arguments); }
    Scene_ReverieTitleOptions.prototype = Object.create(Scene_Base.prototype);
    Scene_ReverieTitleOptions.prototype.constructor = Scene_ReverieTitleOptions;

    Scene_ReverieTitleOptions.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        if (Scene_Title.prototype.createBackground) {
            Scene_Title.prototype.createBackground.call(this);
        }
        if (Scene_Title.prototype.createTitle) {
            Scene_Title.prototype.createTitle.call(this);
        }
        this.createUltraHUD();
        this.createWindowLayer();
        this.createOptionsSubWindows();
        this.initTitleOptionsState();
    };

    Scene_ReverieTitleOptions.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this.startFadeIn(this.fadeSpeed(), false);
    };

    Scene_ReverieTitleOptions.prototype.terminate = function() {
        this.destroyUltraHUD();
        Scene_Base.prototype.terminate.call(this);
        this.resetTitleOptionsState();
    };

    Scene_ReverieTitleOptions.prototype.createUltraHUD = function() {
        if (typeof Stage_UltraHUDContainer === "undefined") return;
        this._ultraHudContainer = new Stage_UltraHUDContainer(true);
        this._ultraHudContainer.createMapHUD();
        this.addChild(this._ultraHudContainer);
        this.updateUltraHUDContainerVisibility();
    };

    Scene_ReverieTitleOptions.prototype.shouldHUDBeAvailable = function() {
        return true;
    };

    Scene_ReverieTitleOptions.prototype.ultraHUDVisibility = function() {
        const hmu = SRD && SRD.HUDMakerUltra ? SRD.HUDMakerUltra : null;
        const mapFunc = hmu && hmu.mapVisibilityFunc ? hmu.mapVisibilityFunc : null;
        const baseVisible = mapFunc ? mapFunc() : true;
        const globalVisible = typeof $gameUltraHUD === "undefined" ? true : $gameUltraHUD.globalVisibility;
        return baseVisible && globalVisible;
    };

    Scene_ReverieTitleOptions.prototype.updateUltraHUDContainerVisibility = function() {
        if (!this._ultraHudContainer) return;
        this._ultraHudContainer.visible = this.ultraHUDVisibility();
        this._ultraHudContainer.setVisibilityState(true);
    };

    Scene_ReverieTitleOptions.prototype.refreshUltraHUD = function() {
        if (this._ultraHudContainer) this._ultraHudContainer.refreshUltraHUD();
    };

    Scene_ReverieTitleOptions.prototype.destroyUltraHUD = function() {
        if (this._ultraHudContainer) {
            this._ultraHudContainer.destroyCurrentHUD();
            this.removeChild(this._ultraHudContainer);
            this._ultraHudContainer.destroy();
            this._ultraHudContainer = null;
        }
    };

    Scene_ReverieTitleOptions.prototype.initTitleOptionsState = function() {
        if (!$gameTemp) return;
        this._titleOptionsClosing = false;
        this._titleOptionsNoAnim = true;
        $gameTemp._customMenuOpen = true;
        $gameTemp._menuCursorDelay = 0;
        $gameTemp._globalClosingDelay = 0;
        $gameTemp.activeMenuSymbol = 'options';
        $gameTemp.equipAnimState = 0;
        $gameTemp.equipAnimTimer = 0;

        $gameTemp.hudShowOptionsCat = true;
        $gameTemp.hudShowOptionsList = true;
        $gameTemp.hudShowOptionsDesc = false;
        $gameTemp.hudShowOptionsConfirm = false;

        $gameTemp.optCatInTimer = 0;
        $gameTemp.optListInTimer = 0;
        $gameTemp.optDescInTimer = 0;
        $gameTemp.optDescOutTimer = 0;
        $gameTemp.optionsDescOutTimer = 0;
        $gameTemp.optListOutTimer = 0;
        $gameTemp.optCatOutTimer = 0;
        $gameTemp.optCatIsAnimatingIn = false;
        $gameTemp.optListIsAnimatingIn = false;
        $gameTemp.optDescIsAnimatingIn = false;
        $gameTemp.optionsAnimActive = true;

        if (this._optionsCatWindow) {
            this._optionsCatWindow.show();
            this._optionsCatWindow.activate();
            this._optionsCatWindow.select(0);
        }
        if (this._optionsListWindow) {
            this._optionsListWindow.setCategory('general');
            this._optionsListWindow.deselect();
            this._optionsListWindow.show();
        }

        $gameTemp.hudShowOptionsBindPrompt = false;
        $gameTemp.optionsRebindActive = false;
        $gameTemp.optionsRebindDevice = "";
        $gameTemp.optionsRebindSymbol = "";
        $gameTemp.optionsRebindPrompt = "";
        $gameTemp.optionsRebindTarget = "";
        $gameTemp.optionsRebindCurrent = "";
        $gameTemp.optionsConfirmType = "";
    };

    Scene_ReverieTitleOptions.prototype.resetTitleOptionsState = function() {
        if (!$gameTemp) return;
        $gameTemp._customMenuOpen = false;
        $gameTemp._menuCursorDelay = 0;
        $gameTemp._globalClosingDelay = 0;
        $gameTemp.optCatInTimer = 0;
        $gameTemp.optListInTimer = 0;
        $gameTemp.optDescInTimer = 0;
        $gameTemp.optDescOutTimer = 0;
        $gameTemp.optionsDescOutTimer = 0;
        $gameTemp.optListOutTimer = 0;
        $gameTemp.optCatOutTimer = 0;
        $gameTemp.optCatIsAnimatingIn = false;
        $gameTemp.optListIsAnimatingIn = false;
        $gameTemp.optDescIsAnimatingIn = false;
        $gameTemp.optionsAnimActive = false;

        $gameTemp.hudShowOptionsCat = false;
        $gameTemp.hudShowOptionsList = false;
        $gameTemp.hudShowOptionsDesc = false;
        $gameTemp.hudShowOptionsConfirm = false;
        $gameTemp.hudShowOptionsBindPrompt = false;
        $gameTemp.optionsRebindActive = false;
        $gameTemp.optionsRebindDevice = "";
        $gameTemp.optionsRebindSymbol = "";
        $gameTemp.optionsRebindPrompt = "";
        $gameTemp.optionsRebindTarget = "";
        $gameTemp.optionsRebindCurrent = "";
        $gameTemp.optionsConfirmType = "";
    };

    Scene_ReverieTitleOptions.prototype.calcWindowHeight = Scene_Map.prototype.calcWindowHeight;
    Scene_ReverieTitleOptions.prototype.createOptionsSubWindows = Scene_Map.prototype.createOptionsSubWindows;
    Scene_ReverieTitleOptions.prototype.onOptionsCatOk = Scene_Map.prototype.onOptionsCatOk;
    Scene_ReverieTitleOptions.prototype.onOptionsListCancel = Scene_Map.prototype.onOptionsListCancel;
    Scene_ReverieTitleOptions.prototype.onOptSysConfirmOpen = Scene_Map.prototype.onOptSysConfirmOpen;
    Scene_ReverieTitleOptions.prototype.onOptConfirmYes = Scene_Map.prototype.onOptConfirmYes;
    Scene_ReverieTitleOptions.prototype.onOptConfirmNo = Scene_Map.prototype.onOptConfirmNo;
    Scene_ReverieTitleOptions.prototype.startOptionsRebind = Scene_Map.prototype.startOptionsRebind;
    Scene_ReverieTitleOptions.prototype.updateOptionsRebind = Scene_Map.prototype.updateOptionsRebind;
    Scene_ReverieTitleOptions.prototype.finishOptionsRebind = Scene_Map.prototype.finishOptionsRebind;
    Scene_ReverieTitleOptions.prototype.resetOptionsBinding = Scene_Map.prototype.resetOptionsBinding;

    Scene_ReverieTitleOptions.prototype.onOptionsCancel = function() {
        if (this._titleOptionsNoAnim) {
            this._optionsCatWindow.deactivate();
            this._optionsCatWindow.deselect();
            this._optionsCatWindow.hide();
            this._optionsListWindow.deactivate();
            this._optionsListWindow.hide();
            if (this._optionsConfirmWindow) {
                this._optionsConfirmWindow.deactivate();
                this._optionsConfirmWindow.hide();
            }
            $gameTemp.hudShowOptionsCat = false;
            $gameTemp.hudShowOptionsList = false;
            $gameTemp.hudShowOptionsDesc = false;
            $gameTemp.hudShowOptionsConfirm = false;
            ConfigManager.save();
            SceneManager.pop();
            return;
        }
        this._titleOptionsClosing = true;
        this._optionsCatWindow.deactivate();
        this._optionsCatWindow.deselect();
        this._optionsListWindow._closingDelay = OPT_ANIM_DELAY;
        $gameTemp.optListOutTimer = OPT_ANIM_DELAY;
        ConfigManager.save();
    };

    Scene_ReverieTitleOptions.prototype.onOptSysLoad = function() {
        SceneManager.push(Scene_Load);
    };

    Scene_ReverieTitleOptions.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (!$gameTemp) return;

        if (this._bg && this._bg.opacity < 255) {
            this._bg.opacity += 3;
        }

        this.updateOptionsRebind();

        if (this._titleOptionsNoAnim) {
            if (Scene_Map.prototype.updateHUDMakerBridge) {
                Scene_Map.prototype.updateHUDMakerBridge.call(this);
            }
            this.updateTitleOptionsHUD();
            return;
        }

        if ($gameTemp._menuCursorDelay > 0) {
            $gameTemp._menuCursorDelay--;
        }

        if ($gameTemp.optCatInTimer > 0) {
            $gameTemp.optCatInTimer--;
            if ($gameTemp.optCatInTimer === 0) {
                $gameTemp.hudShowOptionsCat = true;
                $gameTemp.optCatIsAnimatingIn = true;

                $gameTemp._menuCursorDelay = OPT_ANIM_DELAY;
                this._optionsCatWindow.show();

                $gameTemp.optListInTimer = OPT_ANIM_DELAY;
            }
        }
        if ($gameTemp.optListInTimer > 0) {
            $gameTemp.optListInTimer--;
            if ($gameTemp.optListInTimer === 0) {
                $gameTemp.optCatIsAnimatingIn = false;
                $gameTemp.hudShowOptionsList = true;
                $gameTemp.optListIsAnimatingIn = true;

                $gameTemp._menuCursorDelay = OPT_ANIM_DELAY;
                this._optionsListWindow.setCategory('general');
                this._optionsListWindow.deselect();
                this._optionsListWindow.show();
            }
        }

        if ($gameTemp.optListIsAnimatingIn && $gameTemp._menuCursorDelay === 0) {
            $gameTemp.optListIsAnimatingIn = false;
            $gameTemp.optionsAnimActive = true;
            this._optionsCatWindow.activate();
            this._optionsCatWindow.select(0);
        }

        if ($gameTemp.optListOutTimer > 0) {
            $gameTemp.optListOutTimer--;
            if ($gameTemp.optListOutTimer === 0) {
                $gameTemp.hudShowOptionsList = false;
                this._optionsCatWindow._closingDelay = OPT_ANIM_DELAY;
                $gameTemp.optCatOutTimer = OPT_ANIM_DELAY;
            }
        }
        if ($gameTemp.optCatOutTimer > 0) {
            $gameTemp.optCatOutTimer--;
            if ($gameTemp.optCatOutTimer === 0) {
                $gameTemp.hudShowOptionsCat = false;
                $gameTemp.optionsAnimActive = false;
                if (this._titleOptionsClosing) {
                    this._titleOptionsClosing = false;
                    SceneManager.pop();
                }
            }
        }

        if (Scene_Map.prototype.updateHUDMakerBridge) {
            Scene_Map.prototype.updateHUDMakerBridge.call(this);
        }
        this.updateTitleOptionsHUD();
    };

    Scene_ReverieTitleOptions.prototype.updateTitleOptionsHUD = function() {
        if (!$gameTemp) return;
        forceUltraHUDVisible(this);

        hijackHUDMakerNode(this, "MainMenu", () => false, () => false, null, 0, 0, () => false, OPT_ANIM_DELAY);
        hijackHUDMakerNode(this, "StatusCards", () => false, () => false, null, 0, 0, () => false, OPT_ANIM_DELAY);

        if (this._optionsCatWindow && (this._optionsCatWindow.visible || this._optionsCatWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
            const isOptCatClosing = () => $gameTemp.optCatOutTimer > 0 || $gameTemp._globalClosingDelay > 0;
            const optCatDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.optCatOutTimer;
            hijackHUDMakerNode(this, HMU_OPTIONS_CAT_GROUP, () => $gameTemp.optCatIsAnimatingIn, isOptCatClosing, optCatDelay, 0, SLIDE_Y_OFFSET_CAT, () => $gameTemp.hudShowOptionsCat, OPT_ANIM_DELAY);
        }
        if (this._optionsListWindow && (this._optionsListWindow.visible || this._optionsListWindow._closingDelay > 0 || $gameTemp._globalClosingDelay > 0)) {
            const isOptListClosing = () => $gameTemp.optListOutTimer > 0 || $gameTemp._globalClosingDelay > 0;
            const optListDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.optListOutTimer;
            hijackHUDMakerNode(this, HMU_OPTIONS_LIST_GROUP, () => $gameTemp.optListIsAnimatingIn, isOptListClosing, optListDelay, 0, SLIDE_Y_OFFSET_OPT_LIST, () => $gameTemp.hudShowOptionsList, OPT_ANIM_DELAY);
        }

        const isOptDescClosing = () => $gameTemp.optionsDescOutTimer > 0 || $gameTemp._globalClosingDelay > 0;
        const optDescDelay = () => $gameTemp._globalClosingDelay > 0 ? $gameTemp._globalClosingDelay : $gameTemp.optionsDescOutTimer;
        hijackHUDMakerNode(this, HMU_OPTIONS_DESC_GROUP, () => $gameTemp.optDescIsAnimatingIn, isOptDescClosing, optDescDelay, 0, SLIDE_Y_OFFSET_OPT_LIST, () => $gameTemp.hudShowOptionsDesc, OPT_ANIM_DELAY);
    };

    window.Scene_ReverieTitleOptions = Scene_ReverieTitleOptions;

    Scene_Map.prototype.createEquipSubWindows = function() {
        const w = Graphics.boxWidth - (MENU_MARGIN_X * 2);
        const h = this.calcWindowHeight(4, true);
        
        this._equipTabsWindow = new Window_MenuEquipTabs(new Rectangle(MENU_MARGIN_X, EQUIP_TABS_RESTING_Y, w, EQUIP_TABS_HEIGHT));
        this._equipTabsWindow._baseX = this._equipTabsWindow.x;
        this._equipTabsWindow._baseY = this._equipTabsWindow.y;

        const listW = EQUIP_LIST_WIDTH; 
        const listX = EQUIP_LIST_RESTING_X;
        this._equipListWindow = new Window_MenuEquipList(new Rectangle(listX, EQUIP_LIST_RESTING_Y, listW, EQUIP_LIST_HEIGHT));
        this._equipListWindow._baseX = this._equipListWindow.x;
        this._equipListWindow._baseY = this._equipListWindow.y;

        this._equipTabsWindow.setHandler('weapon_name', this.onEquipTabOk.bind(this));
        this._equipTabsWindow.setHandler('charm_name', this.onEquipTabOk.bind(this));
        this._equipTabsWindow.setHandler('cancel', this.onEquipTabsCancel.bind(this));
        
        this._equipListWindow.setHandler('ok', this.onEquipListOk.bind(this));
        this._equipListWindow.setHandler('cancel', this.onEquipListCancel.bind(this));
        
        this.addWindow(this._equipTabsWindow);
        this.addWindow(this._equipListWindow);
        this._equipTabsWindow.hide();
        this._equipListWindow.hide();
    };

    Scene_Map.prototype.createAbilitiesSubWindows = function() {
        const h = this.calcWindowHeight(1, true);
        const y = MENU_MARGIN_Y + h; 
        
        const fullWidth = Graphics.boxWidth - (MENU_MARGIN_X * 2);
        const catRect = new Rectangle(MENU_MARGIN_X, y, fullWidth, h);
        
        this._abilitiesCatWindow = new Window_MenuAbilitiesCat(catRect);
        this._abilitiesCatWindow._baseX = catRect.x;
        this._abilitiesCatWindow._baseY = y; 
        this._abilitiesCatWindow.setHandler('ok', this.onAbilitiesCatOk.bind(this));
        this._abilitiesCatWindow.setHandler('cancel', this.onAbilitiesCancel.bind(this));
        this.addWindow(this._abilitiesCatWindow);
        this._abilitiesCatWindow.hide(); 
        this._abilitiesCatWindow.deactivate();

        const tabsH = this.calcWindowHeight(4, true);
        this._abilitiesTabsWindow = new Window_MenuAbilitiesTabs(new Rectangle(MENU_MARGIN_X, EQUIP_TABS_RESTING_Y, fullWidth, EQUIP_TABS_HEIGHT));
        this._abilitiesTabsWindow._baseX = this._abilitiesTabsWindow.x;
        this._abilitiesTabsWindow._baseY = this._abilitiesTabsWindow.y;
        this._abilitiesTabsWindow.setHandler('ability_slot', this.onAbilitiesTabsOk.bind(this));
        this._abilitiesTabsWindow.setHandler('cancel', this.onAbilitiesTabsCancel.bind(this));
        this.addWindow(this._abilitiesTabsWindow);
        this._abilitiesTabsWindow.hide();
        this._abilitiesTabsWindow.deactivate();

        const listW = EQUIP_LIST_WIDTH; 
        const listX = EQUIP_LIST_RESTING_X;
        this._abilitiesListWindow = new Window_MenuAbilitiesList(new Rectangle(listX, EQUIP_LIST_RESTING_Y, listW, EQUIP_LIST_HEIGHT));
        this._abilitiesListWindow._baseX = this._abilitiesListWindow.x;
        this._abilitiesListWindow._baseY = this._abilitiesListWindow.y;
        this._abilitiesListWindow.setHandler('ok', this.onAbilitiesListOk.bind(this));
        this._abilitiesListWindow.setHandler('cancel', this.onAbilitiesListCancel.bind(this));
        this.addWindow(this._abilitiesListWindow);
        this._abilitiesListWindow.hide();
        this._abilitiesListWindow.deactivate();
    };

    Scene_Map.prototype.createCommandWindow = function() {
        const rect = this.commandWindowRect();
        this._commandWindow = new Window_MenuCommand(rect);
        
        this._commandWindow._baseX = this._commandWindow.x;
        this._commandWindow._baseY = this._commandWindow.y;
        
        this._commandWindow.setHandler('pass', this.commandPass.bind(this));
        this._commandWindow.setHandler('equip', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('mementos', this.commandMementos.bind(this));
        this._commandWindow.setHandler('abilities', this.commandPersonal.bind(this));
        this._commandWindow.setHandler('options', this.commandOptions.bind(this));
        this._commandWindow.setHandler('cancel', this.closeCustomOmoriMenu.bind(this));
        this.addWindow(this._commandWindow);
    };

    Scene_Map.prototype.createPassWindow = function() {
        this._passWindow = new Window_MenuPass(new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight));
        this._passWindow._baseX = 0;
        this._passWindow._baseY = 0;
        this._passWindow.setHandler('ok', this.onPassOk.bind(this));
        this._passWindow.setHandler('cancel', this.onPassCancel.bind(this));
        this.addWindow(this._passWindow);
        this._passWindow.hide();
        this._passWindow.deactivate();
    };

    Scene_Map.prototype.onPassOk = function() {
        if ($gameTemp.passAnimState !== 3) {
            this._passWindow.activate();
            return;
        }
        if ($gameTemp.passSelectedIndex === 0) {
            SoundManager.playBuzzer(); 
            this._passWindow.activate();
            return;
        }
        $gameTemp.passLeaderTextVis = false;
        const curName = $gameParty.members()[0].name().toLowerCase();
        const nextName = $gameParty.members()[$gameTemp.passSelectedIndex].name().toLowerCase();
        
        $gameTemp.passPhotoName = "img/pictures/pass_" + curName + "_to_" + nextName + ".png";
        
        $gameTemp.passAnimState = 7;
        $gameTemp.passAnimTimer = 0;
        SoundManager.playOk();
    };

    Scene_Map.prototype.onPassCancel = function() {
        if ($gameTemp.passAnimState !== 3) {
            this._passWindow.activate();
            return;
        }
        $gameTemp.passLeaderTextVis = false;
        $gameTemp.passAnimState = 5;
        $gameTemp.passAnimTimer = 0;
        SoundManager.playCancel();
    };

    Scene_Map.prototype.commandPass = function() {
        this._commandWindow.deactivate();
        hijackPassNode(this);
        hijackActorCardNode(this);
        hijackMainMenuGroup(this);

        $gameTemp.passSelectedIndex = 0;
        $gameTemp.passPrevIndex = 0;
        $gameTemp.passAnimTimer = 0;
        preparePassCardsAtOrigin();

        if ($gameTemp._directPassMode) {
            $gameTemp.passAnimState = 2; 
            $gameTemp.passBgOffsetTop = -150;
            $gameTemp.passBgOffsetBottom = 350;
            $gameTemp.passMidCardVis = true;
        } else {
            $gameTemp.passAnimState = 1; 
            $gameTemp.passBgOffsetTop = 0;
            $gameTemp.passBgOffsetBottom = 0;
            $gameTemp.passMidCardVis = false;
        }
        
        $gameTemp.hudShowPass = true;
        this._passWindow.activate(); 
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
        this._mementosCatWindow._baseX = rect.x;
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
        const y = this._mementosCatWindow.y + MEMENTOS_LIST_Y_OFFSET; 
        
        const itemH = MEMENTOS_LIST_ITEM_HEIGHT + MEMENTOS_LIST_ITEM_PADDING;
        const h = (itemH * MEMENTOS_LIST_VISIBLE_ITEMS) + ($gameSystem.windowPadding() * 2);
        
        this._mementosItemWindow = new Window_MementosItemList(new Rectangle(x, y, w, h));
        this._mementosItemWindow._baseX = x;
        this._mementosItemWindow._baseY = y; 
        this._mementosItemWindow.setHandler('ok', this.onMementosItemOk.bind(this));
        this._mementosItemWindow.setHandler('cancel', this.onMementosItemCancel.bind(this));
        this.addWindow(this._mementosItemWindow);
        this._mementosItemWindow.hide();
        this._mementosItemWindow.deactivate();
    };

    Scene_Map.prototype.createMementosActionWindow = function() {
        const w = 200;
        const h = this.calcWindowHeight(2, true);
        
        const x = this._mementosCatWindow.x; 
        const y = this._mementosItemWindow.y + this._mementosItemWindow.height + MEMENTOS_ACTION_Y_OFFSET;
        
        this._mementosActionWindow = new Window_MementosAction(new Rectangle(x, y, w, h));
        this._mementosActionWindow._baseX = x;
        this._mementosActionWindow._baseY = y; 
        this._mementosActionWindow.setHandler('use', this.onMementosActionUse.bind(this));
        this._mementosActionWindow.setHandler('trash', this.onMementosActionTrash.bind(this));
        this._mementosActionWindow.setHandler('cancel', this.onMementosActionCancel.bind(this));
        this.addWindow(this._mementosActionWindow);
        this._mementosActionWindow.hide();
        this._mementosActionWindow.deactivate();
    };

    Scene_Map.prototype.createMementosConfirmWindow = function() {
        const w = 200;
        const h = this.calcWindowHeight(2, true); 
        
        const x = this._mementosActionWindow.x + this._mementosActionWindow.width; 
        const y = this._mementosActionWindow.y + MEMENTOS_CONFIRM_Y_OFFSET;
        
        this._mementosConfirmWindow = new Window_MementosConfirm(new Rectangle(x, y, w, h));
        this._mementosConfirmWindow._baseX = x;
        this._mementosConfirmWindow._baseY = y; 
        this._mementosConfirmWindow.setHandler('yes', this.onMementosConfirmYes.bind(this));
        this._mementosConfirmWindow.setHandler('no', this.onMementosConfirmCancel.bind(this));
        this._mementosConfirmWindow.setHandler('cancel', this.onMementosConfirmCancel.bind(this));
        this.addWindow(this._mementosConfirmWindow);
        this._mementosConfirmWindow.hide();
        this._mementosConfirmWindow.deactivate();
    };

    // --- OVERLAY LOGIC HANDLERS ---
    Scene_Map.prototype.openCustomOmoriMenu = function(directPassMode = false) {
        $gameTemp._customMenuOpen = true;
        $gameTemp._directPassMode = !!directPassMode;
        $gameTemp.hudShowMainMenu = !directPassMode;
        $gameTemp._globalClosingDelay = 0;
        $gameTemp._menuCursorDelay = 0; 
        forceUltraHUDVisible(this);
        
        $gameTemp.equipAnimState = 0;
        $gameTemp.equipAnimTimer = 0;
        $gameTemp.equipAnimProgress = 0.0;
        $gameTemp.equipSelectedActor = -1;
        
        $gameTemp.hudShowEquipDesc = false; 
        $gameTemp.equipDescOutDelay = 0;
        $gameTemp.hudShowEquipStat = false; 
        $gameTemp.equipStatOutDelay = 0;   
        $gameTemp.equipStatInTimer = 0;     
        $gameTemp.equipStatIsAnimatingIn = false; 

        $gameTemp.abilTabsInTimer = 0;
        $gameTemp.abilDescInTimer = 0;
        $gameTemp.abilDescOutDelay = 0;
        $gameTemp.abilCatInTimer = 0;

        // Reset Options Animation states
        $gameTemp.optCatInTimer = 0;
        $gameTemp.optListInTimer = 0;
        $gameTemp.optDescInTimer = 0;
        $gameTemp.optDescOutTimer = 0;
        $gameTemp.optListOutTimer = 0;
        $gameTemp.optCatOutTimer = 0;
        $gameTemp.optCatIsAnimatingIn = false;
        $gameTemp.optListIsAnimatingIn = false;
        $gameTemp.optDescIsAnimatingIn = false;
        $gameTemp.optionsAnimActive = false;
        $gameTemp.hudShowOptionsBindPrompt = false;
        $gameTemp.optionsRebindActive = false;
        $gameTemp.optionsRebindDevice = "";
        $gameTemp.optionsRebindSymbol = "";
        $gameTemp.optionsRebindPrompt = "";
        $gameTemp.optionsRebindTarget = "";
        $gameTemp.optionsRebindCurrent = "";

        $gameTemp.hudShowPass = false;
        $gameTemp.passAnimState = 0; 
        $gameTemp.passAnimTimer = 0;
        $gameTemp.passSelectedIndex = 0;
        $gameTemp.passPrevIndex = 0;
        $gameTemp.passMidCardVis = false;
        $gameTemp.passLeaderTextVis = false;
        $gameTemp.passPhotoVis = false;
        $gameTemp.passCardX = [0,0,0,0];
        $gameTemp.passCardY = [0,0,0,0];
        $gameTemp.passCardOpacity = [0,0,0,0];

        $gameTemp.passPhotoY = -800;

        if (!this._reverieBlurFilter) {
            this._reverieBlurFilter = new PIXI.filters.BlurFilter();
            this._reverieBlurFilter.blur = 8; 
        }
        if (this._spriteset) {
            const filters = this._spriteset.filters || [];
            if (!filters.includes(this._reverieBlurFilter)) {
                filters.push(this._reverieBlurFilter);
                this._spriteset.filters = filters;
            }
        }
        
        this._commandWindow.show();
        this._commandWindow.activate();
        this._commandWindow.select(0);
        this._statusWindow.show();      
        this._statusWindow.deselect();  
    };

    Scene_Map.prototype.closeCustomOmoriMenu = function() {
        $gameTemp.mementosUseMode = false;
        $gameTemp._globalClosingDelay = CURSOR_ANIMATION_DELAY;
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
        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
        this._mementosCatWindow.show();
        this._mementosCatWindow.activate();
        this._mementosCatWindow.select(0); 
    };

    Scene_Map.prototype.onMementosCatOk = function() {
        this._mementosCatWindow.deactivate(); 
        
        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
        
        this._mementosItemWindow.setCategory(this._mementosCatWindow.currentSymbol());
        this._mementosItemWindow.show();
        this._mementosItemWindow.activate();
        this._mementosItemWindow.select(0);
    };

    Scene_Map.prototype.onMementosCancel = function() {
        this._mementosCatWindow.deactivate();
        this._mementosCatWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._commandWindow.activate();
    };

    Scene_Map.prototype.onMementosItemOk = function() {
        const item = this._mementosItemWindow.item();
        if (item) {
            this._mementosItemWindow.deactivate();
            
            $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
            
            this._mementosActionWindow.setItem(item);
            this._mementosActionWindow.show();
            this._mementosActionWindow.activate();
            this._mementosActionWindow.select(0);
        } else {
            this._mementosItemWindow.activate();
        }
    };

    Scene_Map.prototype.onMementosItemCancel = function() {
        this._mementosItemWindow.deactivate();
        this._mementosItemWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._mementosCatWindow.activate();
    };

    Scene_Map.prototype.onMementosActionUse = function() {
        $gameTemp.mementosUseMode = true; 
        this._statusWindow.activate();
        this._statusWindow.select(0);
    };

    Scene_Map.prototype.onMementosActionTrash = function() {
        this._mementosActionWindow.deactivate();
        
        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
        
        this._mementosConfirmWindow.show();
        this._mementosConfirmWindow.activate();
        this._mementosConfirmWindow.select(0);
    };

    Scene_Map.prototype.onMementosActionCancel = function() {
        this._mementosActionWindow.deactivate();
        this._mementosActionWindow._closingDelay = CURSOR_ANIMATION_DELAY;
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
        this._mementosConfirmWindow.deactivate();
        this._mementosConfirmWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._mementosActionWindow.deactivate();
        this._mementosActionWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._mementosItemWindow.activate();
    };

    Scene_Map.prototype.onMementosConfirmCancel = function() {
        this._mementosConfirmWindow.deactivate();
        this._mementosConfirmWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._mementosActionWindow.activate();
    };

    Scene_Map.prototype.onAbilitiesCatOk = function() {
        this._abilitiesCatWindow.deactivate();
        this._abilitiesCatWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        
        $gameTemp.abilTabsInTimer = CURSOR_ANIMATION_DELAY;
        $gameTemp.currentAbilityCategory = this._abilitiesCatWindow.currentSymbol();
        
        const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
        this._abilitiesTabsWindow.setActorAndCategory(actor, $gameTemp.currentAbilityCategory);
    };

    Scene_Map.prototype.onAbilitiesCancel = function() {
        this._abilitiesCatWindow.deactivate();
        this._abilitiesCatWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        $gameTemp.equipAnimState = 5; 
        $gameTemp.equipAnimTimer = 0;
    };

    Scene_Map.prototype.onAbilitiesTabsOk = function() {
        this._abilitiesTabsWindow.deactivate();
        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY;
        
        const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
        const slotId = this._abilitiesTabsWindow.currentExt().slotId;
        this._abilitiesListWindow.setActorAndSlot(actor, slotId, $gameTemp.currentAbilityCategory);
        
        this._abilitiesListWindow.show();
        this._abilitiesListWindow.activate();
        this._abilitiesListWindow.select(0);
    };

    Scene_Map.prototype.onAbilitiesTabsCancel = function() {
        this._abilitiesTabsWindow.deactivate();
        $gameTemp.abilDescOutDelay = CURSOR_ANIMATION_DELAY;
    };

    Scene_Map.prototype.onAbilitiesListOk = function() {
        const item = this._abilitiesListWindow.item();
        
        if (!item) {
            SoundManager.playBuzzer();
            this._abilitiesListWindow.activate();
            return;
        }

        SoundManager.playEquip();
        const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
        const slotId = this._abilitiesListWindow._slotId;
        
        const targetArr = $gameTemp.currentAbilityCategory === 'skills' ? actor._equippedSkills : actor._equippedBonds;
        targetArr[slotId] = item.id;
        
        this._abilitiesTabsWindow.refresh();
        this._abilitiesListWindow.refresh();
        this._abilitiesListWindow.activate();
    };

    Scene_Map.prototype.onAbilitiesListCancel = function() {
        this._abilitiesListWindow.deactivate();
        this._abilitiesListWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._abilitiesTabsWindow.activate();
    };

    Scene_Map.prototype.onEquipTabOk = function() {
        this._equipTabsWindow.deactivate();
        $gameTemp._menuCursorDelay = CURSOR_ANIMATION_DELAY; 
        
        const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
        const symbol = this._equipTabsWindow.currentSymbol();
        const slotId = symbol === 'weapon_name' ? 0 : 1;
        this._equipListWindow.setActorAndSlot(actor, slotId);

        this._equipListWindow.show();
        this._equipListWindow.activate();
        this._equipListWindow.select(0);
    };

    Scene_Map.prototype.onEquipListOk = function() {
        SoundManager.playEquip();
        const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
        const item = this._equipListWindow.item(); 
        const slotId = this._equipListWindow._slotId;
        
        actor.changeEquip(slotId, item);
        
        this._equipTabsWindow.refresh();
        this._equipListWindow.refresh();
        this._statusWindow.refresh(); 
        
        this._equipListWindow.activate(); 
    };

    Scene_Map.prototype.onEquipListCancel = function() {
        this._equipListWindow.deactivate();
        this._equipListWindow._closingDelay = CURSOR_ANIMATION_DELAY;
        this._equipTabsWindow.activate();
    };

    Scene_Map.prototype.onEquipTabsCancel = function() {
        this._equipTabsWindow.deactivate();
        $gameTemp.equipStatOutDelay = CURSOR_ANIMATION_DELAY;
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
        
        if (actorIndex < 0) {
            this._statusWindow.activate();
            return;
        }

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
                    this._mementosActionWindow.deactivate();
                    this._mementosActionWindow._closingDelay = CURSOR_ANIMATION_DELAY;
                    this._mementosItemWindow.activate();
                } else {
                    this._statusWindow.activate(); 
                }
            } else {
                SoundManager.playBuzzer();
                this._statusWindow.activate();
            }
        } else if (symbol === 'equip') {
            $gameTemp.activeMenuSymbol = 'equip';
            $gameTemp.equipSelectedActor = actorIndex;
            $gameTemp.equipAnimState = 1; 
            $gameTemp.equipAnimTimer = 0;
            this._equipTabsWindow.setActor(actor); 
            this._statusWindow.deselect();
            this._statusWindow.deactivate();
        } else if (symbol === 'abilities') {
            $gameTemp.activeMenuSymbol = 'abilities';
            $gameTemp.equipSelectedActor = actorIndex; 
            $gameTemp.equipAnimState = 1; 
            $gameTemp.equipAnimTimer = 0;
            this._statusWindow.deselect();
            this._statusWindow.deactivate();
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

        $gameTemp.hudShowMainMenu = $gameTemp._customMenuOpen && !$gameTemp.hudShowOptionsCat && !$gameTemp.hudShowOptionsList && !$gameTemp._directPassMode;

        $gameTemp.hudShowMementos = !!(this._mementosCatWindow && (this._mementosCatWindow.visible || this._mementosCatWindow._closingDelay > 0));
        $gameTemp.hudShowMementosList = !!(this._mementosItemWindow && (this._mementosItemWindow.visible || this._mementosItemWindow._closingDelay > 0));
        
        const showAction = !!(this._mementosActionWindow && (this._mementosActionWindow.visible || this._mementosActionWindow._closingDelay > 0));
        $gameTemp.hudShowMementosAction = showAction && !$gameTemp.mementosUseMode;
        
        $gameTemp.hudShowMementosConfirm = !!(this._mementosConfirmWindow && (this._mementosConfirmWindow.visible || this._mementosConfirmWindow._closingDelay > 0));

        $gameTemp.hudShowAbilitiesCat = !!(this._abilitiesCatWindow && (this._abilitiesCatWindow.visible || this._abilitiesCatWindow._closingDelay > 0));
        $gameTemp.hudShowAbilitiesTabs = !!(this._abilitiesTabsWindow && (this._abilitiesTabsWindow.visible || this._abilitiesTabsWindow._closingDelay > 0));
        $gameTemp.hudShowAbilitiesList = !!(this._abilitiesListWindow && (this._abilitiesListWindow.visible || this._abilitiesListWindow._closingDelay > 0));

        $gameTemp.hudShowEquipTabs = !!(this._equipTabsWindow && (this._equipTabsWindow.visible || this._equipTabsWindow._closingDelay > 0));
        $gameTemp.hudShowEquipList = !!(this._equipListWindow && (this._equipListWindow.visible || this._equipListWindow._closingDelay > 0));

        $gameTemp.hudShowOptionsCat = !!(this._optionsCatWindow && (this._optionsCatWindow.visible || this._optionsCatWindow._closingDelay > 0));
        $gameTemp.hudShowOptionsList = !!(this._optionsListWindow && (this._optionsListWindow.visible || this._optionsListWindow._closingDelay > 0));

        const leader = $gameParty.members()[0];
        $gameTemp.passMidImage = leader ? "img/pictures/" + leader.name().toLowerCase() + "_bg_black.png" : "img/pictures/sora_bg_black.png";
        for (let i = 0; i < 4; i++) {
            const actor = $gameParty.members()[i];
            $gameTemp['passCardVis' + i] = !!actor; 
            $gameTemp['passCardImage' + i] = actor ? "img/pictures/" + actor.name().toLowerCase() + "_bg_black.png" : "img/pictures/sora_bg_black.png";
        }
        if (!$gameTemp.passPhotoName || $gameTemp.passPhotoName === "") {
            $gameTemp.passPhotoName = "img/pictures/pass_sora_to_gin.png";
        }

        if ($gameTemp.equipSelectedActor >= 0 && $gameParty.members()[$gameTemp.equipSelectedActor]) {
            const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
            const equips = actor.equips();
            $gameTemp.equipCurrentWeaponName = equips[0] ? equips[0].name : "-------";
            $gameTemp.equipCurrentCharmName = equips[1] ? equips[1].name : "-------";
            
            actor._equippedSkills = actor._equippedSkills || [null, null, null, null];
            actor._equippedBonds = actor._equippedBonds || [null, null, null, null];
            const targetArr = $gameTemp.currentAbilityCategory === 'skills' ? actor._equippedSkills : actor._equippedBonds;
            for (let i = 0; i < 4; i++) {
                const sId = targetArr[i];
                $gameTemp['abilTabName' + i] = (sId && $dataSkills[sId]) ? $dataSkills[sId].name : "-------";
            }
        } else {
            $gameTemp.equipCurrentWeaponName = "";
            $gameTemp.equipCurrentCharmName = "";
            for (let i = 0; i < 4; i++) $gameTemp['abilTabName' + i] = "";
        }

        if (this._equipListWindow && this._equipListWindow._data) {
            let cursorRow = Math.floor(this._equipListWindow.index() / this._equipListWindow.maxCols());
            if (cursorRow < 0) cursorRow = 0;
            let logicalTopRow = cursorRow > 1 ? cursorRow - 1 : 0;
            const topIndex = logicalTopRow * this._equipListWindow.maxCols(); 
            for (let i = 0; i < 4; i++) {
                const item = this._equipListWindow._data[topIndex + i];
                if (item === undefined) $gameTemp['equipListSlot' + i] = "";
                else if (item === null) $gameTemp['equipListSlot' + i] = "-------";
                else $gameTemp['equipListSlot' + i] = item.name;
            }
        }
        
        if (this._abilitiesListWindow && this._abilitiesListWindow._data) {
            let cursorRow = Math.floor(this._abilitiesListWindow.index() / this._abilitiesListWindow.maxCols());
            if (cursorRow < 0) cursorRow = 0;
            let logicalTopRow = cursorRow > 1 ? cursorRow - 1 : 0;
            const topIndex = logicalTopRow * this._abilitiesListWindow.maxCols(); 
            for (let i = 0; i < 4; i++) {
                const item = this._abilitiesListWindow._data[topIndex + i];
                if (item === undefined) $gameTemp['abilListSlot' + i] = "";
                else $gameTemp['abilListSlot' + i] = item.name; 
            }
        }

        // 2C. TRACK OPTIONS MENU FOR HMU
        if (this._optionsCatWindow) {
            $gameTemp.optionsCatIndex = this._optionsCatWindow.index();
        }
        
        if (this._optionsListWindow && this._optionsListWindow._list) {
            const maxOptions = 10; 
            for (let i = 0; i < maxOptions; i++) {
                const item = this._optionsListWindow._list[i];
                if (item) {
                    $gameTemp['optionName' + i] = item.name;
                    $gameTemp['optionIsBind' + i] = (item.ext === 'bind');
                    
                    if (this._optionsListWindow._category === 'general') {
                        let choices = [];
                        let activeIdx = 0;
                        if (item.symbol === 'opt_res') { choices = ["1x", "Fullscreen"]; activeIdx = ConfigManager.customResIndex !== undefined ? ConfigManager.customResIndex : 0; }
                        if (item.symbol === 'opt_skip') { choices = ["OFF", "ON"]; activeIdx = ConfigManager.commandRemember ? 1 : 0; }
                        if (item.symbol === 'opt_btl') { choices = ["Fast", "Medium", "Slow"]; activeIdx = ConfigManager.battleTextSpeed !== undefined ? ConfigManager.battleTextSpeed : 1; }
                        if (item.symbol === 'opt_move') { choices = ["Walk", "Dash"]; activeIdx = ConfigManager.alwaysDash ? 1 : 0; }
                        $gameTemp['optionChoice1_' + i] = choices[0] || "";
                        $gameTemp['optionChoice2_' + i] = choices[1] || "";
                        $gameTemp['optionChoice3_' + i] = choices[2] || "";
                        $gameTemp['optionActiveIdx_' + i] = activeIdx;
                    } else if (this._optionsListWindow._category === 'audio') {
                        let vol = 0;
                        if (item.symbol === 'opt_bgm') vol = ConfigManager.bgmVolume;
                        if (item.symbol === 'opt_bgs') vol = ConfigManager.bgsVolume;
                        if (item.symbol === 'opt_me') vol = ConfigManager.meVolume;
                        if (item.symbol === 'opt_se') vol = ConfigManager.seVolume;
                        $gameTemp['optionAudioVol_' + i] = vol + "%";
                    } else if (this._optionsListWindow._category === 'controls') {
                        if (item.symbol === 'key_reset') {
                            $gameTemp['optionKey_' + i] = "RESET KEYS";
                            $gameTemp['optionPad_' + i] = "RESET PAD";
                        } else if (item.symbol.startsWith('key_')) {
                            $gameTemp['optionKey_' + i] = "[" + controlBindingName(item.symbol, 'keyboard') + "]";
                            $gameTemp['optionPad_' + i] = "(" + controlBindingName(item.symbol, 'gamepad') + ")";
                        } else {
                            $gameTemp['optionKey_' + i] = "";
                            $gameTemp['optionPad_' + i] = "";
                        }
                    }
                } else {
                    $gameTemp['optionName' + i] = "";
                    $gameTemp['optionChoice1_' + i] = "";
                    $gameTemp['optionChoice2_' + i] = "";
                    $gameTemp['optionChoice3_' + i] = "";
                    $gameTemp['optionAudioVol_' + i] = "";
                    $gameTemp['optionKey_' + i] = "";
                    $gameTemp['optionPad_' + i] = "";
                    $gameTemp['optionActiveIdx_' + i] = 0;
                    $gameTemp['optionIsBind' + i] = false;
                }
            }
            $gameTemp.optionsCursorIndex = this._optionsListWindow.index();
            $gameTemp.optionsCurrentCat = this._optionsListWindow._category;
            $gameTemp.optionsBindMode = this._optionsListWindow._bindMode;
            
            if (this._optionsListWindow.active && this._optionsListWindow.index() >= 0) {
                const symbol = this._optionsListWindow.commandSymbol(this._optionsListWindow.index());
                let desc = "";
                if (symbol && symbol.includes('res')) desc = "Change the game's display size.";
                else if (symbol && symbol.includes('skip')) desc = "Toggle holding Confirm to fast-forward dialogue.";
                else if (symbol && symbol.includes('btl')) desc = "Change the speed of battle messages.";
                else if (symbol && symbol.includes('move')) desc = "Toggle Default Dash.";
                else if (symbol && symbol.includes('bgm')) desc = "Adjust the background music volume.";
                else if (symbol && symbol.includes('bgs')) desc = "Adjust the background sound volume.";
                else if (symbol && symbol.includes('me')) desc = "Adjust the musical effect volume.";
                else if (symbol && symbol.includes('se')) desc = "Adjust the sound effect volume.";
                else if (symbol && symbol.includes('key')) desc = "Remap game controls.";
                else if (symbol && symbol.includes('sys')) desc = "System commands.";
                
                $gameTemp.optionsHoverDesc = desc;
            } else {
                $gameTemp.optionsHoverDesc = "";
            }
        }

        let hoveredEquipItem = null;
        let isHoveringNothing = false;
        
        let hoveredAbilItem = null;
        let isAbilHoveringNothing = false;

        if (this._equipListWindow && this._equipListWindow.active) {
            hoveredEquipItem = this._equipListWindow.item();
            if (hoveredEquipItem === null) isHoveringNothing = true; 
        } else if (this._equipTabsWindow && this._equipTabsWindow.active && $gameTemp.equipSelectedActor >= 0) {
            const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
            const index = this._equipTabsWindow.index();
            if (index === 1) { 
                hoveredEquipItem = actor.equips()[0];
                if (!hoveredEquipItem) isHoveringNothing = true;
            } else if (index === 3) { 
                hoveredEquipItem = actor.equips()[1];
                if (!hoveredEquipItem) isHoveringNothing = true;
            }
        }
        
        if (this._abilitiesListWindow && this._abilitiesListWindow.active) {
            hoveredAbilItem = this._abilitiesListWindow.item();
        } else if (this._abilitiesTabsWindow && this._abilitiesTabsWindow.active && $gameTemp.equipSelectedActor >= 0) {
            const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
            const arr = $gameTemp.currentAbilityCategory === 'skills' ? actor._equippedSkills : actor._equippedBonds;
            const sId = arr[this._abilitiesTabsWindow.index()];
            if (sId) hoveredAbilItem = $dataSkills[sId];
            else isAbilHoveringNothing = true;
        }

        if (hoveredEquipItem) {
            $gameTemp.equipHoverName = hoveredEquipItem.name;
            if (hoveredEquipItem.description) {
                if (hoveredEquipItem.description.includes('\n')) {
                    const descParts = hoveredEquipItem.description.split('\n');
                    $gameTemp.equipHoverDesc1 = descParts[0] || "";
                    $gameTemp.equipHoverDesc2 = descParts[1] || "";
                } else if (hoveredEquipItem.description.length > 50) {
                    let splitIndex = hoveredEquipItem.description.lastIndexOf(' ', 50);
                    if (splitIndex === -1) splitIndex = 50; 
                    
                    $gameTemp.equipHoverDesc1 = hoveredEquipItem.description.substring(0, splitIndex).trim();
                    $gameTemp.equipHoverDesc2 = hoveredEquipItem.description.substring(splitIndex).trim();
                } else {
                    $gameTemp.equipHoverDesc1 = hoveredEquipItem.description;
                    $gameTemp.equipHoverDesc2 = "";
                }
            } else {
                $gameTemp.equipHoverDesc1 = "";
                $gameTemp.equipHoverDesc2 = "";
            }
        } else if (isHoveringNothing) {
            $gameTemp.equipHoverName = "-------";
            $gameTemp.equipHoverDesc1 = "";
            $gameTemp.equipHoverDesc2 = "";
        } else {
            $gameTemp.equipHoverName = "";
            $gameTemp.equipHoverDesc1 = "";
            $gameTemp.equipHoverDesc2 = "";
        }
        
        const formatAbilDesc = (text) => {
            if (!text) return ["", "", ""];
            let lines = text.split('\n');
            let result = [];
            const maxLen = 45; 

            for (let line of lines) {
                while (line.length > maxLen) {
                    let splitIdx = line.lastIndexOf(' ', maxLen);
                    if (splitIdx === -1) splitIdx = maxLen; 
                    result.push(line.substring(0, splitIdx).trim());
                    line = line.substring(splitIdx).trim();
                }
                result.push(line.trim());
            }
            return [result[0] || "", result[1] || "", result[2] || ""];
        };

        if (hoveredAbilItem) {
            $gameTemp.abilHoverName = hoveredAbilItem.name;
            const descLines = formatAbilDesc(hoveredAbilItem.description);
            $gameTemp.abilHoverDesc1 = descLines[0];
            $gameTemp.abilHoverDesc2 = descLines[1];
            $gameTemp.abilHoverDesc3 = descLines[2];
            
            const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
            if (actor) {
                $gameTemp.abilHoverMpCost = actor.skillMpCost(hoveredAbilItem);
            } else {
                $gameTemp.abilHoverMpCost = hoveredAbilItem.mpCost;
            }
            $gameTemp.abilHasMpCost = $gameTemp.abilHoverMpCost > 0;

        } else if (isAbilHoveringNothing) {
            $gameTemp.abilHoverName = "-------";
            $gameTemp.abilHoverDesc1 = "";
            $gameTemp.abilHoverDesc2 = "";
            $gameTemp.abilHoverDesc3 = "";
            $gameTemp.abilHoverMpCost = 0;
            $gameTemp.abilHasMpCost = false;
        } else {
            $gameTemp.abilHoverName = "";
            $gameTemp.abilHoverDesc1 = "";
            $gameTemp.abilHoverDesc2 = "";
            $gameTemp.abilHoverDesc3 = "";
            $gameTemp.abilHoverMpCost = 0;
            $gameTemp.abilHasMpCost = false;
        }

        if (this._mementosItemWindow && this._mementosItemWindow.active) {
            const item = this._mementosItemWindow.item();
            $gameTemp.mementosItemName = item ? item.name : "";
            
            if (item && item.description) {
                if (item.description.includes('\n')) {
                    const descParts = item.description.split('\n');
                    $gameTemp.mementosItemDesc1 = descParts[0] || "";
                    $gameTemp.mementosItemDesc2 = descParts[1] || "";
                } else if (item.description.length > 35) {
                    let splitIndex = item.description.lastIndexOf(' ', 35);
                    if (splitIndex === -1) splitIndex = 35; 
                    
                    $gameTemp.mementosItemDesc1 = item.description.substring(0, splitIndex).trim();
                    $gameTemp.mementosItemDesc2 = item.description.substring(splitIndex).trim();
                } else {
                    $gameTemp.mementosItemDesc1 = item.description;
                    $gameTemp.mementosItemDesc2 = "";
                }
            } else {
                $gameTemp.mementosItemDesc1 = "";
                $gameTemp.mementosItemDesc2 = "";
            }
            
            $gameTemp.mementosItemAmount = item ? $gameParty.numItems(item) : 0;
        } else if (!this._mementosItemWindow || (!this._mementosItemWindow.visible && this._mementosItemWindow._closingDelay === 0)) {
            $gameTemp.mementosItemName = "";
            $gameTemp.mementosItemDesc1 = "";
            $gameTemp.mementosItemDesc2 = "";
            $gameTemp.mementosItemAmount = 0;
        }

        if (this._equipTabsWindow || this._equipListWindow) {
            let statMode = 0;
            if (this._equipListWindow && this._equipListWindow.active && $gameTemp.equipSelectedActor >= 0) {
                statMode = 1;
            }

            for (let i = 0; i < 8; i++) { 
                if ($gameTemp.equipSelectedActor < 0 || !$gameParty.members()[$gameTemp.equipSelectedActor]) {
                    $gameTemp['equipStatCurrent' + i] = "";
                    $gameTemp['equipStatState' + i] = -1;
                    $gameTemp['equipStatValue' + i] = "";
                } else {
                    const actor = $gameParty.members()[$gameTemp.equipSelectedActor];
                    const currentVal = actor.param(i);
                    
                    $gameTemp['equipStatCurrent' + i] = currentVal; 

                    if (statMode === 0) {
                        $gameTemp['equipStatState' + i] = -1;
                        $gameTemp['equipStatValue' + i] = "---";
                    } else {
                        const slotId = this._equipListWindow._slotId;
                        const oldItem = actor.equips()[slotId];
                        const newItem = hoveredEquipItem;
                        
                        const diff = (newItem ? newItem.params[i] : 0) - (oldItem ? oldItem.params[i] : 0);
                        const newVal = currentVal + diff;

                        $gameTemp['equipStatValue' + i] = newVal;
                        if (diff > 0) $gameTemp['equipStatState' + i] = 2;
                        else if (diff < 0) $gameTemp['equipStatState' + i] = 3;
                        else $gameTemp['equipStatState' + i] = 1;
                    }
                }
            }
        }
    };

})();
