/*:
 * @target MZ
 * @plugindesc Reverie - Gin-only swimming interaction for configurable water regions.
 * @author Safmica
 *
 * @param ginActorId
 * @text Gin Actor ID
 * @type actor
 * @default 6
 *
 * @param swimRegionId
 * @text Swimmable Water Regions
 * @type string
 * @default 247
 * @desc One or more region IDs. Use commas for multiple regions, e.g. 247,250,251.
 *
 * @param shoreRegionId
 * @text Shore Regions
 * @type string
 * @default 248
 * @desc One or more shore region IDs. Use commas for multiple regions.
 *
 * @param deepRegionId
 * @text Deep Water Regions
 * @type string
 * @default 249
 * @desc One or more blocked deep-water region IDs. Use commas for multiple regions.
 *
 * @param swimCharacterName
 * @text Gin Swim Character
 * @type file
 * @dir img/characters
 * @default $Gin_Skill
 *
 * @param swimCharacterIndex
 * @text Gin Swim Character Index
 * @type number
 * @default 0
 *
 * @param normalCharacterName
 * @text Gin Normal Character
 * @type file
 * @dir img/characters
 * @default ActorReverie
 *
 * @param normalCharacterIndex
 * @text Gin Normal Character Index
 * @type number
 * @default 3
 *
 * @param fadeFrames
 * @text Fade Duration
 * @type number
 * @default 24
 *
 * @param notGinMessage
 * @text Not Gin Message
 * @type string
 * @default It seems like only Gin can do this
 *
 * @param deepWaterMessage
 * @text Deep Water Message
 * @type string
 * @default The water is too deep and the flow is too strong for swimming
 *
 * @help GinSkill.js
 *
 * Region setup:
 *   swimRegionId = swimmable water regions, e.g. 247 or 247,250,251
 *   shoreRegionId = shore/edge regions where Gin can enter and exit
 *   deepRegionId = deep water regions that block swimming
 *
 * Press OK/Enter/gamepad confirm while the player stands on a shore region
 * and faces a swim region. If the party leader is Gin, the screen fades to black,
 * the party is reduced to Gin, Gin's character sprite changes, and the player
 * is placed one tile forward onto the water.
 *
 * While swimming, swim regions ignore tile passability for the player. Moving
 * toward a deep region is blocked with a warning. Moving toward a shore region fades
 * the screen, restores the original party, restores Gin's normal sprite, and
 * places the player on the shore tile.
 *
 * No plugin commands are required.
 */

(() => {
    "use strict";

    const pluginName = "GinSkill";
    const params = PluginManager.parameters(pluginName);

    const numberParam = function(name, defaultValue) {
        const value = Number(params[name]);
        return Number.isFinite(value) ? value : defaultValue;
    };

    const regionSetParam = function(name, defaultValue) {
        const rawValue = params[name] !== undefined && params[name] !== "" ?
            params[name] :
            String(defaultValue);
        const regions = String(rawValue)
            .split(/[\s,;|/]+/)
            .map(regionId => Number(regionId.trim()))
            .filter(regionId => Number.isInteger(regionId) && regionId > 0);
        if (regions.length === 0) {
            regions.push(defaultValue);
        }
        return new Set(regions);
    };

    const stringParam = function(name, defaultValue) {
        const value = params[name];
        return value !== undefined && value !== "" ? String(value) : defaultValue;
    };

    const CONFIG = {
        ginActorId: numberParam("ginActorId", 6),
        swimRegionIds: regionSetParam("swimRegionId", 247),
        shoreRegionIds: regionSetParam("shoreRegionId", 248),
        deepRegionIds: regionSetParam("deepRegionId", 249),
        swimCharacterName: stringParam("swimCharacterName", "$Gin_Skill"),
        swimCharacterIndex: numberParam("swimCharacterIndex", 0),
        normalCharacterName: stringParam("normalCharacterName", "ActorReverie"),
        normalCharacterIndex: numberParam("normalCharacterIndex", 3),
        fadeFrames: Math.max(1, numberParam("fadeFrames", 24)),
        notGinMessage: stringParam(
            "notGinMessage",
            "It seems like only Gin can do this"
        ),
        deepWaterMessage: stringParam(
            "deepWaterMessage",
            "The water is too deep and the flow is too strong for swimming"
        )
    };

    const GinSkill = {
        _transition: null,

        makeState() {
            return {
                active: false,
                partyActorIds: [],
                ginCharacterName: CONFIG.normalCharacterName,
                ginCharacterIndex: CONFIG.normalCharacterIndex
            };
        },

        state() {
            if (!$gameSystem._ginSkill) {
                $gameSystem._ginSkill = this.makeState();
            }
            return $gameSystem._ginSkill;
        },

        isSwimming() {
            return !!this.state().active;
        },

        isTransitioning() {
            return !!this._transition;
        },

        leaderIsGin() {
            const leader = $gameParty.leader();
            return leader && leader.actorId() === CONFIG.ginActorId;
        },

        regionAt(x, y) {
            return $gameMap.isValid(x, y) ? $gameMap.regionId(x, y) : 0;
        },

        playerRegion() {
            return this.regionAt($gamePlayer.x, $gamePlayer.y);
        },

        isSwimRegion(regionId) {
            return CONFIG.swimRegionIds.has(regionId);
        },

        isShoreRegion(regionId) {
            return CONFIG.shoreRegionIds.has(regionId);
        },

        isDeepRegion(regionId) {
            return CONFIG.deepRegionIds.has(regionId);
        },

        frontPosition(direction) {
            const d = direction || $gamePlayer.direction();
            return {
                x: $gameMap.roundXWithDirection($gamePlayer.x, d),
                y: $gameMap.roundYWithDirection($gamePlayer.y, d),
                direction: d
            };
        },

        showMessage(text) {
            if (text && !$gameMessage.isBusy()) {
                $gameMessage.add(text);
            }
        },

        tryStartFromAction() {
            if (this.isTransitioning() || this.isSwimming()) {
                return false;
            }
            if (!this.isShoreRegion(this.playerRegion())) {
                return false;
            }

            const front = this.frontPosition();
            if (!this.isSwimRegion(this.regionAt(front.x, front.y))) {
                return false;
            }

            if (!this.leaderIsGin()) {
                this.showMessage(CONFIG.notGinMessage);
                return true;
            }

            this.startTransition("enter", front.x, front.y, front.direction);
            return true;
        },

        onBeforeMoveStraight(player, direction) {
            if (!this.isSwimming() || this.isTransitioning()) {
                return null;
            }

            const front = this.frontPosition(direction);
            const regionId = this.regionAt(front.x, front.y);
            if (this.isDeepRegion(regionId)) {
                player.setDirection(direction);
                player.setMovementSuccess(false);
                this.showMessage(CONFIG.deepWaterMessage);
                return "blocked";
            }

            if (this.isShoreRegion(regionId)) {
                player.setDirection(direction);
                player.setMovementSuccess(false);
                this.startTransition("exit", front.x, front.y, direction);
                return "transition";
            }

            return null;
        },

        playerMapPassability(x, y, direction) {
            const x2 = $gameMap.roundXWithDirection(x, direction);
            const y2 = $gameMap.roundYWithDirection(y, direction);
            if (!$gameMap.isValid(x2, y2)) {
                return false;
            }

            const targetRegionId = this.regionAt(x2, y2);
            if (this.isSwimming()) {
                if (this.isDeepRegion(targetRegionId)) {
                    return false;
                }
                if (
                    this.isSwimRegion(targetRegionId) ||
                    this.isShoreRegion(targetRegionId)
                ) {
                    return true;
                }
                return false;
            }

            if (this.isSwimRegion(targetRegionId)) {
                return false;
            }

            return null;
        },

        startTransition(type, x, y, direction) {
            if (this.isTransitioning()) {
                return;
            }
            this._transition = {
                type,
                x,
                y,
                direction,
                phase: "fadeOut"
            };
            $gameTemp.clearDestination();
            $gameScreen.startFadeOut(CONFIG.fadeFrames);
        },

        updateTransition() {
            const transition = this._transition;
            if (!transition) {
                return;
            }

            if (transition.phase === "fadeOut") {
                if ($gameScreen.brightness() > 0) {
                    return;
                }

                if (transition.type === "enter") {
                    this.applyEnterTransition(transition);
                } else {
                    this.applyExitTransition(transition);
                }

                transition.phase = "fadeIn";
                $gameScreen.startFadeIn(CONFIG.fadeFrames);
                return;
            }

            if (transition.phase === "fadeIn" && $gameScreen.brightness() >= 255) {
                this._transition = null;
            }
        },

        applyEnterTransition(transition) {
            const state = this.state();
            const gin = $gameActors.actor(CONFIG.ginActorId);

            state.active = true;
            state.partyActorIds = this.currentPartyActorIds();
            if (gin) {
                state.ginCharacterName = gin.characterName() || CONFIG.normalCharacterName;
                state.ginCharacterIndex = gin.characterIndex();
                gin.setCharacterImage(CONFIG.swimCharacterName, CONFIG.swimCharacterIndex);
            }

            this.setPartyActorIds([CONFIG.ginActorId]);
            this.placePlayer(transition.x, transition.y, transition.direction);
            this.refreshSwimmingVisuals();
        },

        applyExitTransition(transition) {
            const state = this.state();
            const actorIds = state.partyActorIds.length > 0 ?
                state.partyActorIds.slice() :
                [CONFIG.ginActorId];
            const gin = $gameActors.actor(CONFIG.ginActorId);

            if (gin) {
                gin.setCharacterImage(
                    state.ginCharacterName || CONFIG.normalCharacterName,
                    Number.isFinite(Number(state.ginCharacterIndex)) ?
                        Number(state.ginCharacterIndex) :
                        CONFIG.normalCharacterIndex
                );
            }

            state.active = false;
            state.partyActorIds = [];
            state.ginCharacterName = CONFIG.normalCharacterName;
            state.ginCharacterIndex = CONFIG.normalCharacterIndex;

            this.setPartyActorIds(actorIds);
            this.placePlayer(transition.x, transition.y, transition.direction);
            $gamePlayer.followers().show();
            this.refreshMapActors();
        },

        currentPartyActorIds() {
            return $gameParty._actors ? $gameParty._actors.slice() : [];
        },

        setPartyActorIds(actorIds) {
            const validActorIds = actorIds
                .map(actorId => Number(actorId))
                .filter(actorId => $gameActors.actor(actorId));
            $gameParty._actors = validActorIds.length > 0 ?
                validActorIds :
                [CONFIG.ginActorId];
            this.refreshMapActors();
        },

        placePlayer(x, y, direction) {
            $gamePlayer.setDirection(direction);
            $gamePlayer.locate(x, y);
            $gamePlayer.setDirection(direction);
            $gamePlayer.followers().synchronize(x, y, direction);
        },

        refreshMapActors() {
            $gamePlayer.refresh();
            $gameMap.requestRefresh();
            $gameTemp.requestBattleRefresh();
        },

        refreshSwimmingVisuals() {
            if (!this.isSwimming()) {
                return;
            }
            $gamePlayer.setImage(CONFIG.swimCharacterName, CONFIG.swimCharacterIndex);
            $gamePlayer.followers().hide();
            this.refreshMapActors();
        },

        syncAfterLoad() {
            if (!this.isSwimming()) {
                return;
            }
            const gin = $gameActors.actor(CONFIG.ginActorId);
            if (gin) {
                gin.setCharacterImage(CONFIG.swimCharacterName, CONFIG.swimCharacterIndex);
            }
            this.setPartyActorIds([CONFIG.ginActorId]);
            $gamePlayer.followers().hide();
            $gamePlayer.setImage(CONFIG.swimCharacterName, CONFIG.swimCharacterIndex);
        }
    };

    window.GinSkill = GinSkill;

    const _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._ginSkill = GinSkill.makeState();
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        GinSkill.syncAfterLoad();
    };

    const _Scene_Map_updateMain = Scene_Map.prototype.updateMain;
    Scene_Map.prototype.updateMain = function() {
        _Scene_Map_updateMain.call(this);
        GinSkill.updateTransition();
    };

    const _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        if (GinSkill.isTransitioning()) {
            return false;
        }
        return _Scene_Map_isMenuEnabled.call(this);
    };

    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (GinSkill.isTransitioning()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        if (Input.isTriggered("ok") && GinSkill.tryStartFromAction()) {
            return true;
        }
        return _Game_Player_triggerButtonAction.call(this);
    };

    const _Game_Player_isMapPassable = Game_Player.prototype.isMapPassable;
    Game_Player.prototype.isMapPassable = function(x, y, direction) {
        const passability = GinSkill.playerMapPassability(x, y, direction);
        if (passability !== null) {
            return passability;
        }
        return _Game_Player_isMapPassable.call(this, x, y, direction);
    };

    const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function(direction) {
        if (GinSkill.onBeforeMoveStraight(this, direction)) {
            return;
        }
        _Game_Player_moveStraight.call(this, direction);
    };

    const _Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        _Game_Player_refresh.call(this);
        if (GinSkill.isSwimming()) {
            this.setImage(CONFIG.swimCharacterName, CONFIG.swimCharacterIndex);
            this.followers().hide();
        }
    };
})();
