/*:
 * @target MZ
 * @plugindesc Fixed-path rolling rock traps with variable-based state and adjustable hitboxes.
 * @author Aristel
 *
 * @command Start
 * @text Start Rock
 * @desc Sets the rock state variable to rolling if it is still idle.
 *
 * @arg variableId
 * @text State Variable
 * @type variable
 * @desc Variable used by the rock. 0 = idle, 1 = rolling, 2 = finished.
 *
 * @command Reset
 * @text Reset Rock
 * @desc Sets the rock state variable back to idle.
 *
 * @arg variableId
 * @text State Variable
 * @type variable
 * @desc Variable used by the rock. 0 = idle, 1 = rolling, 2 = finished.
 *
 * @command Finish
 * @text Finish Rock
 * @desc Sets the rock state variable to finished.
 *
 * @arg variableId
 * @text State Variable
 * @type variable
 * @desc Variable used by the rock. 0 = idle, 1 = rolling, 2 = finished.
 *
 * @help RollingRockTrap.js
 *
 * This plugin adds fixed-path rolling rock traps.
 *
 * State variable values:
 * 0 = idle / not triggered yet
 * 1 = rolling / dangerous
 * 2 = finished / resting, no longer dangerous
 *
 * Rock event tags:
 * <RollingRock: VariableId>
 * <RollingRockPath: R6,D2,L1,U1>
 * <RollingRockSpeed: 5>
 * <RollingRockSize: 1,1>
 * <RollingRockOffset: 0,0>
 *
 * Trigger zone event tags:
 * <RollingRockTrigger: VariableId>
 * <RollingRockTriggerSize: Left,Right,Up,Down>
 * <RollingRockTriggerOffset: 0,0>
 *
 * RollingRockTriggerSize includes the trigger event's current tile.
 * <RollingRockTriggerSize: 0,0,1,0> covers the event tile and 1 tile up.
 * <RollingRockTriggerSize: 0010> is also accepted for single-digit values.
 *
 * Directions for RollingRockPath:
 * R or 6 = right
 * L or 4 = left
 * D or 2 = down
 * U or 8 = up
 *
 * Examples:
 * <RollingRockPath: R8>
 * <RollingRockPath: R4,D2,R3>
 *
 * For a 2x2 rock whose sprite extends one tile upward from the event origin:
 * <RollingRockSize: 2,2>
 * <RollingRockOffset: 0,-1>
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "RollingRockTrap";

    const STATE_IDLE = 0;
    const STATE_ROLLING = 1;
    const STATE_FINISHED = 2;

    const DEFAULT_ROCK_SPEED = 5;
    const DEFAULT_ROCK_WIDTH = 1;
    const DEFAULT_ROCK_HEIGHT = 1;
    const DEFAULT_ROCK_OFFSET_X = 0;
    const DEFAULT_ROCK_OFFSET_Y = 0;

    const DEFAULT_TRIGGER_LEFT = 0;
    const DEFAULT_TRIGGER_RIGHT = 0;
    const DEFAULT_TRIGGER_UP = 0;
    const DEFAULT_TRIGGER_DOWN = 0;
    const DEFAULT_TRIGGER_OFFSET_X = 0;
    const DEFAULT_TRIGGER_OFFSET_Y = 0;

    const directionMap = {
        R: 6,
        L: 4,
        D: 2,
        U: 8,
        "6": 6,
        "4": 4,
        "2": 2,
        "8": 8
    };

    const toNumber = (value, fallback) => {
        const text = normalize(value);
        if (!text) return fallback;
        const number = Number(text);
        return Number.isFinite(number) ? number : fallback;
    };

    const toInteger = (value, fallback, minValue) => {
        const number = Math.floor(toNumber(value, fallback));
        return Math.max(minValue, number);
    };

    const normalize = (value) => {
        if (value === undefined || value === null) return "";
        return String(value).trim();
    };

    const parsePair = (value, defaultA, defaultB, minValue) => {
        const parts = normalize(value).split(",").map(part => normalize(part));
        return {
            a: toInteger(parts[0], defaultA, minValue),
            b: toInteger(parts[1], defaultB, minValue)
        };
    };

    const parseTriggerSize = (value) => {
        const text = normalize(value);
        if (!text) {
            return {
                left: DEFAULT_TRIGGER_LEFT,
                right: DEFAULT_TRIGGER_RIGHT,
                up: DEFAULT_TRIGGER_UP,
                down: DEFAULT_TRIGGER_DOWN
            };
        }

        const compactMatch = text.match(/^(\d)(\d)(\d)(\d)$/);
        if (compactMatch) {
            return {
                left: Number(compactMatch[1]),
                right: Number(compactMatch[2]),
                up: Number(compactMatch[3]),
                down: Number(compactMatch[4])
            };
        }

        const parts = text.split(",").map(part => normalize(part));
        if (parts.length >= 4) {
            return {
                left: toInteger(parts[0], DEFAULT_TRIGGER_LEFT, 0),
                right: toInteger(parts[1], DEFAULT_TRIGGER_RIGHT, 0),
                up: toInteger(parts[2], DEFAULT_TRIGGER_UP, 0),
                down: toInteger(parts[3], DEFAULT_TRIGGER_DOWN, 0)
            };
        }

        const width = toInteger(parts[0], 1, 1);
        const height = toInteger(parts[1], 1, 1);
        return {
            left: 0,
            right: width - 1,
            up: 0,
            down: height - 1
        };
    };

    const readTag = (text, tagName) => {
        const regex = new RegExp("<" + tagName + "(?:\\s*:\\s*([^>]*))?>", "i");
        const match = text.match(regex);
        if (!match) return null;
        return normalize(match[1]);
    };

    const commentText = (event) => {
        const lines = [];
        if (event.event().note) {
            lines.push(event.event().note);
        }
        const list = event.page && event.page() ? event.list() : null;
        if (list) {
            for (const command of list) {
                if (command && (command.code === 108 || command.code === 408)) {
                    lines.push(String(command.parameters[0] || ""));
                }
            }
        }
        return lines.join("\n");
    };

    const parsePath = (value) => {
        const text = normalize(value);
        if (!text) return [];
        const tokens = text.split(/[\s,]+/).map(token => normalize(token)).filter(Boolean);
        const path = [];
        for (const token of tokens) {
            const match = token.match(/^([RLDU2468])(\d*)$/i);
            if (!match) continue;
            const direction = directionMap[match[1].toUpperCase()];
            const count = Math.max(1, toInteger(match[2], 1, 1));
            for (let i = 0; i < count; i++) {
                path.push(direction);
            }
        }
        return path;
    };

    const pathEndPosition = (startX, startY, path) => {
        let x = startX;
        let y = startY;
        for (const direction of path) {
            if (direction === 2) y++;
            if (direction === 4) x--;
            if (direction === 6) x++;
            if (direction === 8) y--;
        }
        return { x, y };
    };

    const stateValue = (variableId) => {
        if (!$gameVariables || variableId <= 0) return STATE_IDLE;
        return Number($gameVariables.value(variableId) || 0);
    };

    const setStateValue = (variableId, value) => {
        if (!$gameVariables || variableId <= 0) return;
        $gameVariables.setValue(variableId, value);
        if ($gameMap) {
            $gameMap.requestRefresh();
        }
    };

    const startRock = (variableId) => {
        const id = toInteger(variableId, 0, 0);
        if (id > 0 && stateValue(id) === STATE_IDLE) {
            setStateValue(id, STATE_ROLLING);
        }
    };

    const rectContains = (rect, x, y) => {
        return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const partyCharacters = () => {
        const characters = [];
        if ($gamePlayer) {
            characters.push($gamePlayer);
            const followers = $gamePlayer.followers && $gamePlayer.followers();
            if (followers && followers.visibleFollowers) {
                characters.push(...followers.visibleFollowers());
            }
        }
        return characters;
    };

    const partyTouchesRect = (rect) => {
        return partyCharacters().some(character => {
            return character && rectContains(rect, character.x, character.y);
        });
    };

    const setupCommand = (name, value) => {
        PluginManager.registerCommand(PLUGIN_NAME, name, args => {
            const variableId = toInteger(args.variableId, 0, 0);
            if (variableId <= 0) return;
            setStateValue(variableId, value);
        });
    };

    setupCommand("Reset", STATE_IDLE);
    setupCommand("Finish", STATE_FINISHED);

    PluginManager.registerCommand(PLUGIN_NAME, "Start", args => {
        startRock(args.variableId);
    });

    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.apply(this, arguments);
        this._rollingRockTrapGameOverStarted = false;
    };

    Game_Temp.prototype.startRollingRockTrapGameOver = function () {
        if (this._rollingRockTrapGameOverStarted) return;
        this._rollingRockTrapGameOverStarted = true;
        if ($gameParty) {
            for (const actor of $gameParty.members()) {
                if (actor) actor.setHp(0);
            }
        }
        SceneManager.goto(Scene_Gameover);
    };

    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function () {
        _Game_Event_initMembers.apply(this, arguments);
        this._rollingRockTrap = null;
        this._rollingRockTrigger = null;
        this._rollingRockPathIndex = 0;
        this._rollingRockActive = false;
    };

    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function () {
        const previousRock = this._rollingRockTrap;
        const previousPathIndex = this._rollingRockPathIndex || 0;
        const previousActive = !!this._rollingRockActive;

        _Game_Event_setupPage.apply(this, arguments);
        this.setupRollingRockTrap(previousRock, previousPathIndex, previousActive);
    };

    Game_Event.prototype.setupRollingRockTrap = function (previousRock, previousPathIndex, previousActive) {
        this._rollingRockTrap = null;
        this._rollingRockTrigger = null;
        this._rollingRockPathIndex = 0;
        this._rollingRockActive = false;

        const text = commentText(this);

        const rockVariableText = readTag(text, "RollingRock");
        if (rockVariableText !== null) {
            const variableId = toInteger(rockVariableText, 0, 0);
            const path = parsePath(readTag(text, "RollingRockPath"));
            const size = parsePair(readTag(text, "RollingRockSize"), DEFAULT_ROCK_WIDTH, DEFAULT_ROCK_HEIGHT, 1);
            const offset = parsePair(readTag(text, "RollingRockOffset"), DEFAULT_ROCK_OFFSET_X, DEFAULT_ROCK_OFFSET_Y, -9999);
            const speed = toNumber(readTag(text, "RollingRockSpeed"), DEFAULT_ROCK_SPEED);
            const startX = this.event().x;
            const startY = this.event().y;
            const end = pathEndPosition(startX, startY, path);

            this._rollingRockTrap = {
                variableId,
                path,
                speed,
                width: size.a,
                height: size.b,
                offsetX: offset.a,
                offsetY: offset.b,
                startX,
                startY,
                endX: end.x,
                endY: end.y
            };

            const state = stateValue(variableId);
            if (state >= STATE_FINISHED) {
                this.setPosition(end.x, end.y);
            } else if (state <= STATE_IDLE) {
                this.setPosition(startX, startY);
            } else if (previousRock && previousRock.variableId === variableId) {
                this._rollingRockPathIndex = previousPathIndex;
                this._rollingRockActive = previousActive;
            }
        }

        const triggerVariableText = readTag(text, "RollingRockTrigger");
        if (triggerVariableText !== null) {
            const variableId = toInteger(triggerVariableText, 0, 0);
            const size = parseTriggerSize(readTag(text, "RollingRockTriggerSize"));
            const offset = parsePair(readTag(text, "RollingRockTriggerOffset"), DEFAULT_TRIGGER_OFFSET_X, DEFAULT_TRIGGER_OFFSET_Y, -9999);
            this._rollingRockTrigger = {
                variableId,
                left: size.left,
                right: size.right,
                up: size.up,
                down: size.down,
                offsetX: offset.a,
                offsetY: offset.b
            };
        }
    };

    Game_Event.prototype.rollingRockRect = function (x, y) {
        const settings = this._rollingRockTrap;
        const left = x + settings.offsetX;
        const top = y + settings.offsetY;
        return {
            left,
            top,
            right: left + settings.width - 1,
            bottom: top + settings.height - 1
        };
    };

    Game_Event.prototype.rollingRockTriggerRect = function () {
        const settings = this._rollingRockTrigger;
        const originX = this.x + settings.offsetX;
        const originY = this.y + settings.offsetY;
        return {
            left: originX - settings.left,
            top: originY - settings.up,
            right: originX + settings.right,
            bottom: originY + settings.down
        };
    };

    Game_Event.prototype.isRollingRockDangerous = function () {
        const settings = this._rollingRockTrap;
        return !!settings && stateValue(settings.variableId) === STATE_ROLLING;
    };

    Game_Event.prototype.isRollingRockTriggerFor = function (variableId) {
        return !!this._rollingRockTrigger && this._rollingRockTrigger.variableId === variableId;
    };

    Game_Event.prototype.rollingRockHitsPosition = function (x, y) {
        if (!this.isRollingRockDangerous()) return false;
        return rectContains(this.rollingRockRect(this.x, this.y), x, y);
    };

    Game_Event.prototype.rollingRockHitsPartyAt = function (x, y) {
        if (!this.isRollingRockDangerous()) return false;
        return partyTouchesRect(this.rollingRockRect(x, y));
    };

    Game_Event.prototype.rollingRockPartyBlocksPosition = function (x, y) {
        return $gamePlayer && $gamePlayer.isCollided(x, y);
    };

    Game_Event.prototype.triggerRollingRockGameOver = function () {
        if ($gameTemp) {
            $gameTemp.startRollingRockTrapGameOver();
        }
    };

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function () {
        if (this._rollingRockTrap) return;
        _Game_Event_start.apply(this, arguments);
    };

    Game_Event.prototype.updateRollingRockTrigger = function () {
        const settings = this._rollingRockTrigger;
        if (!settings || !$gamePlayer) return;
        if (stateValue(settings.variableId) !== STATE_IDLE) return;
        if (rectContains(this.rollingRockTriggerRect(), $gamePlayer.x, $gamePlayer.y)) {
            startRock(settings.variableId);
        }
    };

    Game_Event.prototype.updateRollingRockTrap = function () {
        const settings = this._rollingRockTrap;
        if (!settings || !$gamePlayer) return;

        const state = stateValue(settings.variableId);
        if (state <= STATE_IDLE) return;
        if (state >= STATE_FINISHED) {
            this._rollingRockActive = false;
            return;
        }

        if (this.rollingRockHitsPartyAt(this.x, this.y)) {
            this.triggerRollingRockGameOver();
            return;
        }

        if (!this._rollingRockActive) {
            this._rollingRockActive = true;
            this.setMoveSpeed(settings.speed);
        }

        if (this.isMoving()) return;

        if (this._rollingRockPathIndex >= settings.path.length) {
            this._rollingRockActive = false;
            setStateValue(settings.variableId, STATE_FINISHED);
            return;
        }

        const direction = settings.path[this._rollingRockPathIndex];
        const nextX = $gameMap.roundXWithDirection(this.x, direction);
        const nextY = $gameMap.roundYWithDirection(this.y, direction);

        if (this.rollingRockHitsPartyAt(nextX, nextY) || this.rollingRockPartyBlocksPosition(nextX, nextY)) {
            this.triggerRollingRockGameOver();
            return;
        }

        this.moveStraight(direction);
        if (this.isMovementSucceeded()) {
            this._rollingRockPathIndex++;
        }
    };

    const _Game_Event_update = Game_Event.prototype.update;
    Game_Event.prototype.update = function () {
        _Game_Event_update.apply(this, arguments);
        this.updateRollingRockTrigger();
        this.updateRollingRockTrap();
    };

    if (Game_Event.prototype.eventsXyNt) {
        const _Game_Event_eventsXyNt = Game_Event.prototype.eventsXyNt;
        Game_Event.prototype.eventsXyNt = function (x, y) {
            const events = _Game_Event_eventsXyNt.call(this, x, y);
            const settings = this._rollingRockTrap;
            if (!settings) return events;
            return events.filter(event => {
                return !(event && event.isRollingRockTriggerFor && event.isRollingRockTriggerFor(settings.variableId));
            });
        };
    }

    const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function (direction) {
        const nextX = $gameMap.roundXWithDirection(this.x, direction);
        const nextY = $gameMap.roundYWithDirection(this.y, direction);
        const rock = $gameMap.events().find(event => {
            return event &&
                event.rollingRockHitsPosition &&
                event.rollingRockHitsPosition(nextX, nextY);
        });

        if (rock) {
            rock.triggerRollingRockGameOver();
            return;
        }

        _Game_Player_moveStraight.call(this, direction);
    };
})();
