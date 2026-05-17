/*:
@target MZ
@plugindesc Reverie - Complete Battle UI Override (other override hud was made using HUD Maker Ultra, not in this plugin)
@help must be placed under VisuMZ_0_CoreEngine and VisuMZ_1_BattleCore for proper functionality
@author Aristel
*/

(() => {
const CUSTOM_FONT = '"BattleUIFont", sans-serif';
const SMALL_FONT_SIZE = 20;

const CURSOR_IMAGE_NAME = "FingerCursor";
const CURSOR_NATIVE_SIZE = 14; 
const CURSOR_DRAW_SIZE = 28;
const AFRAID_STATE_ID = 9;
const BASE_EMOTION_STATE_IDS = [3, 4, 5];
const EMOTION_STATE_IDS = [3, 4, 5, 6, 7, 8];
const PROTECTED_EMOTION_STATE_IDS = [6, 7, 8, AFRAID_STATE_ID];
const BOND_SKILL_TYPE_ID = 3;
const ENEMY_HUD_MAX_SLOTS = 9;
const ENEMY_HUD_GROUP_X_OFFSET = 0;
const ENEMY_HUD_GROUP_Y_OFFSET = -20;
const BATTLE_SUBMENU_HEADER_HEIGHT = 34;
const BATTLE_SUBMENU_HEIGHT_REDUCTION = 22;
const BATTLE_SUBMENU_BOTTOM_OFFSET = 10;
const ACTOR_COMMAND_REST_Y_OFFSET = 24;
const ACTOR_COMMAND_SLIDE_EASE = 0.2;
const ACTOR_COMMAND_SLIDE_MIN_STEP = 5;
const ACTOR_COMMAND_SLIDE_SNAP = 1;
const BATTLE_CHOICE_WINDOW_REST_Y_OFFSET = 0;
const BATTLE_CHOICE_WINDOW_SLIDE_EASE = 0.2;
const BATTLE_CHOICE_WINDOW_SLIDE_MIN_STEP = 5;
const BATTLE_CHOICE_WINDOW_SLIDE_SNAP = 1;
const BUFF_HUD_PARAM_IDS = {
    atk: 2,
    attack: 2,
    def: 3,
    defense: 3,
    agi: 6,
    agility: 6
};
const BUFF_HUD_PARAMS = [
    { key: "atk", paramId: 2 },
    { key: "def", paramId: 3 },
    { key: "agi", paramId: 6 }
];
const BUFF_HUD_EMPTY_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
const FIXED_BATTLE_ACTOR_LAYOUT = [
    { actorId: 6, x: 0, y: 0 }, // Gin
    { actorId: 4, x: 1, y: 0 }, // Ann
    { actorId: 1, x: 0, y: 1 }, // Sora
    { actorId: 7, x: 1, y: 1 }  // Zuko
];

FontManager.load("BattleUIFont", "KleeOne-SemiBold.ttf");

function cleanText(text) {
    if (!text) return "";
    return text.replace(/\\[a-zA-Z]+\[.*?\]/g, '') 
               .replace(/[\x00-\x1F\x7F-\x9F]/g, '') 
               .replace(/I\[\d+\]/g, '') 
               .trim();
}

function enemyOriginalDisplayName(enemy) {
    if (!enemy) return "";
    return enemy.originalName ? cleanText(enemy.originalName()) : cleanText(enemy.name());
}

function enemyHasDuplicateOriginalName(enemy, members) {
    const originalName = enemyOriginalDisplayName(enemy);
    if (!originalName) return false;

    return members.filter(other => enemyOriginalDisplayName(other) === originalName).length > 1;
}

function uncachedEnemyBattleDisplayName(enemy, members) {
    const name = cleanText(enemy.name());
    const originalName = enemyOriginalDisplayName(enemy);
    const letter = cleanText(enemy._letter || "");

    if (!enemyHasDuplicateOriginalName(enemy, members)) {
        return originalName || name;
    }

    if (letter && originalName && name === originalName) {
        return originalName + " " + letter;
    }

    return name;
}

function battleLogName(battler) {
    if (!battler || !battler.name) return "";

    if (battler.isEnemy && battler.isEnemy()) {
        if (battler._reverieBattleDisplayName) {
            return battler._reverieBattleDisplayName;
        }

        const members = $gameTroop && $gameTroop.members ? $gameTroop.members() : [battler];
        return uncachedEnemyBattleDisplayName(battler, members);
    }

    return cleanText(battler.name());
}

function cacheEnemyBattleDisplayName(enemy, members) {
    if (!enemy || !enemy.isEnemy || !enemy.isEnemy() || enemy._reverieBattleDisplayName) return;
    enemy._reverieBattleDisplayName = uncachedEnemyBattleDisplayName(enemy, members);
}

function rememberBuffHudChange(battler, paramId) {
    if (!battler) return;
    battler._reverieBuffHudOrder = battler._reverieBuffHudOrder || {};

    if (battler.buff && battler.buff(paramId) !== 0) {
        battler._reverieBuffHudOrder[paramId] = Graphics.frameCount || Date.now();
    } else {
        delete battler._reverieBuffHudOrder[paramId];
    }
}

const BuffHud = {
    _iconCache: {},
    _allowTurnDecay: false,

    battlerActor(actorId) {
        const actor = $gameActors && $gameActors.actor ? $gameActors.actor(Number(actorId)) : null;
        if (!actor || !$gameParty || !$gameParty.inBattle || !$gameParty.inBattle()) return null;
        return $gameParty.battleMembers().includes(actor) ? actor : null;
    },

    battlerEnemy(index) {
        if (!$gameTroop || !$gameTroop.members) return null;
        const enemy = $gameTroop.members()[Number(index)];
        if (!enemy || (enemy.isHidden && enemy.isHidden())) return null;
        return enemy;
    },

    paramId(param) {
        if (typeof param === "number") return param;
        return BUFF_HUD_PARAM_IDS[String(param || "").toLowerCase()] ?? -1;
    },

    kindSign(kind) {
        return String(kind || "").toLowerCase() === "down" ? -1 : 1;
    },

    level(battler, param, kind) {
        const paramId = this.paramId(param);
        if (!battler || paramId < 0 || !battler.buff) return 0;
        if (this.rawTurns(battler, paramId) <= 0) return 0;

        const level = Number(battler.buff(paramId) || 0);
        const sign = this.kindSign(kind);
        return level * sign > 0 ? Math.abs(level) : 0;
    },

    has(battler, param, kind) {
        return this.level(battler, param, kind) > 0;
    },

    turns(battler, param, kind) {
        if (!this.has(battler, param, kind)) return "";
        const paramId = this.paramId(param);
        const turns = this.rawTurns(battler, paramId);
        return turns > 0 ? turns : "";
    },

    rawTurns(battler, paramId) {
        return battler && battler._buffTurns ? Number(battler._buffTurns[paramId] || 0) : 0;
    },

    iconIndex(battler, param, kind) {
        const paramId = this.paramId(param);
        if (!battler || paramId < 0 || !battler.buffIconIndex) return 0;

        const buffLevel = Number(battler.buff(paramId) || 0);
        if (buffLevel === 0) return 0;
        if (this.rawTurns(battler, paramId) <= 0) return 0;
        if (kind && !this.has(battler, param, kind)) return 0;

        return battler.buffIconIndex(buffLevel, paramId);
    },

    iconDataUrl(iconIndex) {
        iconIndex = Number(iconIndex || 0);
        if (iconIndex <= 0) return BUFF_HUD_EMPTY_IMAGE;
        if (this._iconCache[iconIndex]) return this._iconCache[iconIndex];

        const iconSet = ImageManager.loadSystem("IconSet");
        if (!iconSet || !iconSet.isReady || !iconSet.isReady()) return BUFF_HUD_EMPTY_IMAGE;

        try {
            const width = ImageManager.iconWidth;
            const height = ImageManager.iconHeight;
            const sx = (iconIndex % 16) * width;
            const sy = Math.floor(iconIndex / 16) * height;
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;
            context.drawImage(iconSet.canvas, sx, sy, width, height, 0, 0, width, height);
            this._iconCache[iconIndex] = canvas.toDataURL("image/png");
            return this._iconCache[iconIndex];
        } catch (e) {
            return BUFF_HUD_EMPTY_IMAGE;
        }
    },

    icon(battler, param, kind) {
        return this.iconDataUrl(this.iconIndex(battler, param, kind));
    },

    entries(battler) {
        if (!battler || !battler.buff) return [];

        const entries = [];
        for (const data of BUFF_HUD_PARAMS) {
            const level = Number(battler.buff(data.paramId) || 0);
            const turns = this.rawTurns(battler, data.paramId);
            if (level === 0) continue;
            if (turns <= 0) continue;
            entries.push({
                key: data.key,
                paramId: data.paramId,
                kind: level > 0 ? "up" : "down",
                level: Math.abs(level),
                turns,
                iconIndex: battler.buffIconIndex(level, data.paramId)
            });
        }

        return entries.sort((a, b) => {
            const order = battler._reverieBuffHudOrder || {};
            const orderDiff = Number(order[b.paramId] || 0) - Number(order[a.paramId] || 0);
            return orderDiff || a.paramId - b.paramId;
        });
    },

    entry(battler, slotIndex) {
        return this.entries(battler)[Number(slotIndex)] || null;
    },

    hasActor(actorId, param, kind) {
        return this.has(this.battlerActor(actorId), param, kind);
    },

    hasEnemy(enemyIndex, param, kind) {
        return this.has(this.battlerEnemy(enemyIndex), param, kind);
    },

    turnsActor(actorId, param, kind) {
        return this.turns(this.battlerActor(actorId), param, kind);
    },

    turnsEnemy(enemyIndex, param, kind) {
        return this.turns(this.battlerEnemy(enemyIndex), param, kind);
    },

    iconActor(actorId, param, kind) {
        return this.icon(this.battlerActor(actorId), param, kind);
    },

    iconEnemy(enemyIndex, param, kind) {
        return this.icon(this.battlerEnemy(enemyIndex), param, kind);
    },

    hasEntryActor(actorId, slotIndex) {
        return !!this.entry(this.battlerActor(actorId), slotIndex);
    },

    hasEntryEnemy(enemyIndex, slotIndex) {
        return !!this.entry(this.battlerEnemy(enemyIndex), slotIndex);
    },

    entryIconActor(actorId, slotIndex) {
        const entry = this.entry(this.battlerActor(actorId), slotIndex);
        return this.iconDataUrl(entry ? entry.iconIndex : 0);
    },

    entryIconEnemy(enemyIndex, slotIndex) {
        const entry = this.entry(this.battlerEnemy(enemyIndex), slotIndex);
        return this.iconDataUrl(entry ? entry.iconIndex : 0);
    },

    entryTurnsActor(actorId, slotIndex) {
        const entry = this.entry(this.battlerActor(actorId), slotIndex);
        return entry && entry.turns > 0 ? entry.turns : "";
    },

    entryTurnsEnemy(enemyIndex, slotIndex) {
        const entry = this.entry(this.battlerEnemy(enemyIndex), slotIndex);
        return entry && entry.turns > 0 ? entry.turns : "";
    }
};

globalThis.ReverieBuffHud = BuffHud;

const _Game_Battler_addBuff_ReverieBuffHud = Game_Battler.prototype.addBuff;
Game_Battler.prototype.addBuff = function(paramId, turns) {
    _Game_Battler_addBuff_ReverieBuffHud.call(this, paramId, turns);
    if (this.buff && this.buff(paramId) === 0 && this._buffTurns) {
        this._buffTurns[paramId] = 0;
    }
    rememberBuffHudChange(this, paramId);
};

const _Game_Battler_addDebuff_ReverieBuffHud = Game_Battler.prototype.addDebuff;
Game_Battler.prototype.addDebuff = function(paramId, turns) {
    _Game_Battler_addDebuff_ReverieBuffHud.call(this, paramId, turns);
    if (this.buff && this.buff(paramId) === 0 && this._buffTurns) {
        this._buffTurns[paramId] = 0;
    }
    rememberBuffHudChange(this, paramId);
};

const _Game_Battler_removeBuff_ReverieBuffHud = Game_Battler.prototype.removeBuff;
Game_Battler.prototype.removeBuff = function(paramId) {
    _Game_Battler_removeBuff_ReverieBuffHud.call(this, paramId);
    rememberBuffHudChange(this, paramId);
};

const _Game_BattlerBase_updateBuffTurns_ReverieBuffHud = Game_BattlerBase.prototype.updateBuffTurns;
Game_BattlerBase.prototype.updateBuffTurns = function() {
    if ($gameParty && $gameParty.inBattle && $gameParty.inBattle() && !BuffHud._allowTurnDecay) {
        return;
    }
    _Game_BattlerBase_updateBuffTurns_ReverieBuffHud.call(this);
};

const _BattleManager_endAllBattlersTurn_ReverieBuffHud = BattleManager.endAllBattlersTurn;
BattleManager.endAllBattlersTurn = function() {
    BuffHud._allowTurnDecay = true;
    try {
        _BattleManager_endAllBattlersTurn_ReverieBuffHud.call(this);
    } finally {
        BuffHud._allowTurnDecay = false;
    }
};

const _Game_Troop_setup_ReverieEnemyDisplayNames = Game_Troop.prototype.setup;
Game_Troop.prototype.setup = function(troopId) {
    _Game_Troop_setup_ReverieEnemyDisplayNames.call(this, troopId);
    const members = this.members();
    members.forEach(enemy => cacheEnemyBattleDisplayName(enemy, members));
};

function isEmotionStateId(stateId) {
    return EMOTION_STATE_IDS.includes(Number(stateId));
}

function isBaseEmotionStateId(stateId) {
    return BASE_EMOTION_STATE_IDS.includes(Number(stateId));
}

function hasProtectedEmotionState(battler) {
    return !!(battler && battler.isStateAffected &&
        PROTECTED_EMOTION_STATE_IDS.some(stateId => battler.isStateAffected(stateId)));
}

function rememberBlockedEmotionState(battler, stateId) {
    if (!battler) return;
    battler._reverieBlockedEmotionStateId = Number(stateId);
}

function takeBlockedEmotionState(battler) {
    if (!battler) return 0;
    const stateId = Number(battler._reverieBlockedEmotionStateId || 0);
    battler._reverieBlockedEmotionStateId = 0;
    return stateId;
}

function isAfraidAttackAction(action) {
    const subject = action && action.subject ? action.subject() : null;
    return !!(action && action.isAttack && action.isAttack() && subject && subject.isStateAffected(AFRAID_STATE_ID));
}

function fixedBattleActorTargetEntries() {
    const members = $gameParty && $gameParty.battleMembers ? $gameParty.battleMembers() : [];
    return FIXED_BATTLE_ACTOR_LAYOUT.map(slot => {
        const actor = $gameActors.actor(slot.actorId);
        const index = members.indexOf(actor);
        if (index < 0) return null;
        return { actor, index, x: slot.x, y: slot.y };
    }).filter(Boolean);
}

function selectedBattleActor(window) {
    if (!window || window.index() < 0) return null;
    return window.actor(window.index());
}

function nearestFixedBattleActorTarget(current, entries, direction, wrap) {
    const others = entries.filter(entry => entry.actor !== current.actor);
    if (others.length <= 0) return null;

    const axisDistance = entry => {
        if (direction === "right") return entry.x - current.x;
        if (direction === "left") return current.x - entry.x;
        if (direction === "down") return entry.y - current.y;
        return current.y - entry.y;
    };
    const crossDistance = entry => {
        if (direction === "right" || direction === "left") return Math.abs(entry.y - current.y);
        return Math.abs(entry.x - current.x);
    };
    const sameLine = entry => {
        if (direction === "right" || direction === "left") return entry.y === current.y;
        return entry.x === current.x;
    };
    const inDirection = entry => axisDistance(entry) > 0;
    const sortNearest = (a, b) => {
        const axis = axisDistance(a) - axisDistance(b);
        if (axis !== 0) return axis;
        return crossDistance(a) - crossDistance(b);
    };

    const direct = others.filter(entry => sameLine(entry) && inDirection(entry)).sort(sortNearest)[0];
    if (direct) return direct;

    const diagonal = others.filter(inDirection).sort(sortNearest)[0];
    if (diagonal) return diagonal;

    if (!wrap) return null;

    return others
        .filter(sameLine)
        .sort((a, b) => crossDistance(a) - crossDistance(b))[0] || null;
}

function moveFixedBattleActorTarget(window, direction, wrap) {
    const actor = selectedBattleActor(window);
    if (!actor) return false;

    const entries = fixedBattleActorTargetEntries();
    const current = entries.find(entry => entry.actor === actor);
    if (!current) return false;

    const target = nearestFixedBattleActorTarget(current, entries, direction, wrap);
    if (!target) return true;

    window.smoothSelect(target.index);
    return true;
}

function enemySpriteForBattler(enemy) {
    const scene = SceneManager._scene;
    const sprites = scene && scene._spriteset && scene._spriteset._enemySprites;
    if (!enemy || !Array.isArray(sprites)) return null;
    return sprites.find(sprite => sprite && sprite._enemy === enemy) || null;
}

function enemySpriteScreenPosition(enemy) {
    const sprite = enemySpriteForBattler(enemy);
    if (!sprite) {
        return enemy ? { x: enemy.screenX(), y: enemy.screenY() } : { x: 0, y: 0 };
    }

    if (sprite.getGlobalPosition && typeof PIXI !== "undefined" && PIXI.Point) {
        const point = sprite.getGlobalPosition(new PIXI.Point());
        return { x: point.x, y: point.y };
    }

    return { x: sprite.x, y: sprite.y };
}

function selectedBattleEnemy(window) {
    if (!window || window.index() < 0 || !window.enemy) return null;
    return window.enemy();
}

function battleEnemyTargetEntries(window) {
    const enemies = window && Array.isArray(window._enemies)
        ? window._enemies
        : ($gameTroop && $gameTroop.aliveMembers ? $gameTroop.aliveMembers() : []);

    return enemies.map((enemy, index) => {
        const pos = enemySpriteScreenPosition(enemy);
        return { enemy, index, x: pos.x, y: pos.y };
    }).filter(entry => !!entry.enemy);
}

function nearestBattleEnemyTarget(current, entries, direction, wrap) {
    const others = entries.filter(entry => entry.enemy !== current.enemy);
    if (others.length <= 0) return null;

    const axisDistance = entry => {
        if (direction === "right") return entry.x - current.x;
        if (direction === "left") return current.x - entry.x;
        if (direction === "down") return entry.y - current.y;
        return current.y - entry.y;
    };
    const crossDistance = entry => {
        if (direction === "right" || direction === "left") return Math.abs(entry.y - current.y);
        return Math.abs(entry.x - current.x);
    };
    const inDirection = entry => axisDistance(entry) > 0;
    const sortNearest = (a, b) => {
        const axis = axisDistance(a) - axisDistance(b);
        if (axis !== 0) return axis;
        return crossDistance(a) - crossDistance(b);
    };

    const direct = others.filter(inDirection).sort(sortNearest)[0];
    if (direct) return direct;

    if (!wrap) return null;

    if (direction === "right") return others.sort((a, b) => a.x - b.x || crossDistance(a) - crossDistance(b))[0] || null;
    if (direction === "left") return others.sort((a, b) => b.x - a.x || crossDistance(a) - crossDistance(b))[0] || null;
    if (direction === "down") return others.sort((a, b) => a.y - b.y || crossDistance(a) - crossDistance(b))[0] || null;
    return others.sort((a, b) => b.y - a.y || crossDistance(a) - crossDistance(b))[0] || null;
}

function moveBattleEnemyTarget(window, direction, wrap) {
    const enemy = selectedBattleEnemy(window);
    if (!enemy) return false;

    const entries = battleEnemyTargetEntries(window);
    const current = entries.find(entry => entry.enemy === enemy);
    if (!current) return false;

    const target = nearestBattleEnemyTarget(current, entries, direction, wrap);
    if (!target) return true;

    window.smoothSelect(target.index);
    return true;
}

function hmuNodeNameParts(node) {
    const parts = [];
    const add = value => {
        if (typeof value === "string") parts.push(value.toLowerCase());
    };

    add(node && node.name);
    if (node && node._component) add(node._component.name);
    if (node && node.component) add(node.component.name);
    if (node && node._data) {
        add(node._data.name);
        add(node._data.Name);
        add(node._data.id);
    }
    if (node && node.data) {
        add(node.data.name);
        add(node.data.Name);
        add(node.data.id);
    }

    return parts;
}

function hmuEnemyHudIndex(node) {
    const parts = hmuNodeNameParts(node);
    for (const part of parts) {
        const exactSingleEnemy = part.trim() === "enemy";
        const match = part.match(/(?:^|[^a-z0-9])(enemy|enemyhud|enemy_hud)[ _-]?(\d+)(?:[^a-z0-9]|$)/i) ||
            part.match(/^(enemy|enemyhud|enemy_hud)[ _-]?(\d+)/i);
        if (!match) {
            if (exactSingleEnemy) return 0;
            continue;
        }
        const index = Number(match[2]);
        if (Number.isInteger(index) && index >= 0 && index < ENEMY_HUD_MAX_SLOTS) {
            return index;
        }
    }
    return -1;
}

function hmuLocalPoint(parent, x, y) {
    if (parent && parent.toLocal && typeof PIXI !== "undefined" && PIXI.Point) {
        return parent.toLocal(new PIXI.Point(x, y));
    }
    return { x, y };
}

function hijackEnemyHudNode(parent) {
    if (!parent || !parent.children) return;

    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        const enemyHudIndex = hmuEnemyHudIndex(child);

        if (enemyHudIndex >= 0 && !child._reverieEnemyHudHijacked) {
            child._reverieEnemyHudHijacked = true;
            child._reverieEnemyHudIndex = enemyHudIndex;

            const originalRender = child.render;
            const originalRenderCanvas = child.renderCanvas;

            const renderAtEnemyHudPosition = function(target, renderer, originalMethod) {
                const originalX = target.x;
                const originalY = target.y;

                const index = target._reverieEnemyHudIndex;
                const exists = !!($gameTemp && $gameTemp["enemyHudExists" + index]);
                const selected = !!($gameTemp && $gameTemp["enemyHudSelected" + index]);

                if (exists && selected) {
                    const x = Number($gameTemp["enemyHudX" + index] || 0);
                    const y = Number($gameTemp["enemyHudY" + index] || 0);
                    const local = hmuLocalPoint(target.parent, x, y);

                    target.x = local.x;
                    target.y = local.y;
                    target.updateTransform();
                    if (originalMethod) originalMethod.call(target, renderer);
                }

                target.x = originalX;
                target.y = originalY;
                target.updateTransform();
            };

            if (originalRender) {
                child.render = function(renderer) {
                    renderAtEnemyHudPosition(this, renderer, originalRender);
                };
            }

            if (originalRenderCanvas) {
                child.renderCanvas = function(renderer) {
                    renderAtEnemyHudPosition(this, renderer, originalRenderCanvas);
                };
            }
        }

        hijackEnemyHudNode(child);
    }
}

function syncEnemyHudNodePositions(parent) {
    if (!parent || !parent.children || !$gameTemp) return;

    for (let i = 0; i < parent.children.length; i++) {
        const child = parent.children[i];
        const enemyHudIndex = hmuEnemyHudIndex(child);

        if (enemyHudIndex >= 0) {
            const exists = !!$gameTemp["enemyHudExists" + enemyHudIndex];
            const selected = !!$gameTemp["enemyHudSelected" + enemyHudIndex];
            const shouldShow = exists && selected;

            if (shouldShow) {
                const x = Number($gameTemp["enemyHudX" + enemyHudIndex] || 0);
                const y = Number($gameTemp["enemyHudY" + enemyHudIndex] || 0);
                const local = hmuLocalPoint(child.parent, x, y);

                child.x = local.x;
                child.y = local.y;
            }

            child.visible = shouldShow;
        }

        syncEnemyHudNodePositions(child);
    }
}

function forceHideTarget(target) {
    if (!target) return;
    target.visible = false;
    target.alpha = 0;
    target.opacity = 0;
    target.contentsOpacity = 0;
    if (target.hide) target.hide();
}

function hideEnemyNativeStateIcon(enemySprite) {
    if (!enemySprite || !enemySprite._stateIconSprite) return;
    forceHideTarget(enemySprite._stateIconSprite);
}

function applyEnemyNameHiddenSettings(settings) {
    if (!settings) return;
    settings.NameAlwaysHidden = true;
    settings.NameAlwaysVisible = false;
    settings.NameAsTarget = false;
    settings.NameAlwaysSelectOnly = false;
    settings.NameDamageVisibility = 0;
}

function disableBattleCoreEnemyNameSettings() {
    if (typeof VisuMZ === "undefined" || !VisuMZ.BattleCore || !VisuMZ.BattleCore.Settings) return;

    const settings = VisuMZ.BattleCore.Settings;
    applyEnemyNameHiddenSettings(settings);
    applyEnemyNameHiddenSettings(settings.Enemy);

    if (typeof Sprite_EnemyName !== "undefined" && Sprite_EnemyName.SETTINGS) {
        applyEnemyNameHiddenSettings(Sprite_EnemyName.SETTINGS);
        applyEnemyNameHiddenSettings(Sprite_EnemyName.SETTINGS.Enemy);
    }
}

function isEnemyNameOverlaySprite(sprite) {
    if (!sprite) return false;

    const constructorName = sprite.constructor && sprite.constructor.name
        ? sprite.constructor.name.toLowerCase()
        : "";
    const nameParts = hmuNodeNameParts(sprite).join("|");

    return /enemy.*name|name.*enemy/.test(constructorName) ||
        /enemy.*name|name.*enemy/.test(nameParts);
}

function hideEnemyNameOverlaySprites(parent) {
    if (!parent || !parent.children) return;

    for (const child of parent.children) {
        if (isEnemyNameOverlaySprite(child)) {
            forceHideTarget(child);
        }
        hideEnemyNameOverlaySprites(child);
    }
}

disableBattleCoreEnemyNameSettings();

const _Sprite_Enemy_update_ReverieEnemyNames = Sprite_Enemy.prototype.update;
Sprite_Enemy.prototype.update = function() {
    _Sprite_Enemy_update_ReverieEnemyNames.call(this);
    disableBattleCoreEnemyNameSettings();
    hideEnemyNativeStateIcon(this);

    for (const key of ["_nameSprite", "_enemyNameSprite", "_enemyName", "_nameWindow", "_enemyNameWindow"]) {
        forceHideTarget(this[key]);
    }
    hideEnemyNameOverlaySprites(this);
};

const _Spriteset_Battle_update_ReverieEnemyNames = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function() {
    _Spriteset_Battle_update_ReverieEnemyNames.call(this);
    hideEnemyNameOverlaySprites(this._battleField);
};

const _Game_Battler_addState = Game_Battler.prototype.addState;
Game_Battler.prototype.addState = function(stateId) {
    stateId = Number(stateId);

    if (isBaseEmotionStateId(stateId) && hasProtectedEmotionState(this)) {
        rememberBlockedEmotionState(this, stateId);
        return;
    }

    if (isEmotionStateId(stateId) && this.isStateAffected(AFRAID_STATE_ID)) {
        return;
    }

    if (stateId === AFRAID_STATE_ID && this.isStateAddable(stateId)) {
        for (const emotionStateId of EMOTION_STATE_IDS) {
            this.removeState(emotionStateId);
        }
    }

    _Game_Battler_addState.call(this, stateId);

    if (isBaseEmotionStateId(stateId) && this.isStateAffected(stateId)) {
        for (const emotionStateId of BASE_EMOTION_STATE_IDS) {
            if (emotionStateId !== stateId) {
                this.removeState(emotionStateId);
            }
        }
    }
};

const _Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    if (isAfraidAttackAction(this)) {
        this._reverieAfraidAttack = true;
        return 0;
    }
    return _Game_Action_makeDamageValue.call(this, target, critical);
};

const _Game_Action_itemHit = Game_Action.prototype.itemHit;
Game_Action.prototype.itemHit = function(target) {
    if (isAfraidAttackAction(this)) return 1;
    return _Game_Action_itemHit.call(this, target);
};

const _Game_Action_itemEva = Game_Action.prototype.itemEva;
Game_Action.prototype.itemEva = function(target) {
    if (isAfraidAttackAction(this)) return 0;
    return _Game_Action_itemEva.call(this, target);
};

const _BattleManager_invokeAction = BattleManager.invokeAction;
BattleManager.invokeAction = function(subject, target) {
    if (subject && subject.isStateAffected(AFRAID_STATE_ID) && this._action && this._action.isAttack()) {
        this._logWindow.push("pushBaseLine");
        this.invokeNormalAction(subject, target);
        subject.setLastTarget(target);
        return;
    }
    _BattleManager_invokeAction.call(this, subject, target);
};

function currentTroopAddsAfraidToWholeParty() {
    const troop = $gameTroop && $gameTroop.troop ? $gameTroop.troop() : null;
    if (!troop || !Array.isArray(troop.pages)) return false;

    return troop.pages.some(page => {
        if ($gameTroop.meetsConditions && !$gameTroop.meetsConditions(page)) return false;
        return page.list && page.list.some(command => {
            const params = command.parameters || [];
            return command.code === 313 &&
                params[0] === 0 &&
                params[1] === 0 &&
                params[2] === 0 &&
                params[3] === AFRAID_STATE_ID;
        });
    });
}

const _BattleManager_startBattle = BattleManager.startBattle;
BattleManager.startBattle = function() {
    if (currentTroopAddsAfraidToWholeParty()) {
        for (const actor of $gameParty.battleMembers()) {
            actor.addState(AFRAID_STATE_ID);
        }
    }
    _BattleManager_startBattle.call(this);
};

function actorCommandEscapeChanceText() {
    let percent = 0;
    const canEscape = BattleManager.reverieCanEscape ? BattleManager.reverieCanEscape() : (!BattleManager.canEscape || BattleManager.canEscape());
    const actor = BattleManager.actor ? BattleManager.actor() : null;

    if (canEscape) {
        if (BattleManager.reverieEscapePercent) {
            percent = BattleManager.reverieEscapePercent(actor);
        } else {
            const rate = Number(BattleManager._escapeRatio || 0);
            percent = Math.round(Math.max(0, Math.min(1, rate)) * 100);
        }
    }

    percent = Math.max(0, Math.min(100, Number(percent) || 0));
    return percent + "%";
}

function actorCommandEscapeDescription() {
    if (BattleManager.reverieIsElementorBattle && BattleManager.reverieIsElementorBattle()) {
        const unlocked = BattleManager.reverieElementorEscapeUnlocked && BattleManager.reverieElementorEscapeUnlocked();
        return unlocked
            ? "The Elementor's form is broken. Escape is guaranteed."
            : "The Elementor blocks the escape route. Break its form to escape.";
    }

    return "Attempt to flee from battle. Chance: " + actorCommandEscapeChanceText() + ".";
}

function battleSubMenuItemCostText(window, item) {
    if (!item) return "";

    if (DataManager.isItem(item)) {
        return "Hold: " + $gameParty.numItems(item) + " x";
    }

    if (DataManager.isSkill(item)) {
        const actor = window && window._actor ? window._actor : null;
        const mpCost = actor && actor.skillMpCost ? actor.skillMpCost(item) : Number(item.mpCost || 0);
        const tpCost = actor && actor.skillTpCost ? actor.skillTpCost(item) : Number(item.tpCost || 0);

        if (mpCost > 0) return "Cost: " + mpCost + " MP";
        if (tpCost > 0) return "Cost: " + tpCost + " TP";
        return "Cost: 0 MP";
    }

    return "";
}

function battleSubMenuHelpText(window, item) {
    if (!item) return "";

    return cleanText(item.description || "");
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

        const targetActor = this._actorWindow && this._actorWindow.active ? selectedBattleActor(this._actorWindow) : null;
        if (targetActor) {
            $gameVariables.setValue(102, targetActor.actorId());
        } else {
            $gameVariables.setValue(102, 0);
        }
    }

    this.updateReverieEnemyHudBridge();
    syncEnemyHudNodePositions(this);
    if (this._ultraHudContainer) {
        syncEnemyHudNodePositions(this._ultraHudContainer);
    }
    hijackEnemyHudNode(this);
    if (this._ultraHudContainer) {
        hijackEnemyHudNode(this._ultraHudContainer);
    }
};

Scene_Battle.prototype.updateReverieEnemyHudBridge = function() {
    if (!$gameTemp || !$gameTroop) return;

    const enemies = $gameTroop.members ? $gameTroop.members() : [];
    const selectedEnemy = this._enemyWindow && this._enemyWindow.active ? selectedBattleEnemy(this._enemyWindow) : null;
    const aliveEnemies = $gameTroop.aliveMembers ? $gameTroop.aliveMembers() : enemies.filter(enemy => enemy && enemy.isAlive && enemy.isAlive());

    $gameTemp.enemyHudCount = enemies.length;
    $gameTemp.enemyHudAliveCount = aliveEnemies.length;
    $gameTemp.enemyHudSelectedIndex = selectedEnemy ? enemies.indexOf(selectedEnemy) : -1;
    $gameTemp.enemyHudAnySelected = !!selectedEnemy;

    for (let i = 0; i < ENEMY_HUD_MAX_SLOTS; i++) {
        const enemy = enemies[i];
        const sprite = enemySpriteForBattler(enemy);
        const pos = enemy ? enemySpriteScreenPosition(enemy) : { x: 0, y: 0 };
        if (enemy) {
            cacheEnemyBattleDisplayName(enemy, enemies);
        }
        const visible = !!(enemy &&
            (!enemy.isHidden || !enemy.isHidden()) &&
            (!sprite || (sprite.visible && sprite.opacity > 0)));

        $gameTemp["enemyHudExists" + i] = visible;
        $gameTemp["enemyHudSelected" + i] = !!(enemy && enemy === selectedEnemy);
        $gameTemp["enemyHudName" + i] = enemy ? battleLogName(enemy) : "";
        $gameTemp["enemyHudHp" + i] = enemy ? enemy.hp : 0;
        $gameTemp["enemyHudMhp" + i] = enemy ? Math.max(1, enemy.mhp) : 1;
        $gameTemp["enemyHudEscapeValue" + i] = enemy ? Math.max(0, enemy.mhp - enemy.hp) : 0;
        $gameTemp["enemyHudX" + i] = Math.round(pos.x + ENEMY_HUD_GROUP_X_OFFSET);
        $gameTemp["enemyHudY" + i] = Math.round(pos.y + ENEMY_HUD_GROUP_Y_OFFSET);
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

Scene_Battle.prototype.closeCommandWindows = function() {
    if (this._partyCommandWindow) {
        this._partyCommandWindow.deactivate();
        this._partyCommandWindow.close();
    }
    if (this._actorCommandWindow) {
        this._actorCommandWindow.deactivate();
        if (this._actorCommandWindow.reverieSlideOut) {
            this._actorCommandWindow.reverieSlideOut();
        } else {
            this._actorCommandWindow.close();
        }
    }
};

const _Scene_Battle_startActorCommandSelection_ReverieSlide = Scene_Battle.prototype.startActorCommandSelection;
Scene_Battle.prototype.startActorCommandSelection = function() {
    if (!BattleManager.isInputting() || !BattleManager.actor()) {
        if (this._actorCommandWindow && this._actorCommandWindow.reverieSlideOut) {
            this._actorCommandWindow.reverieSlideOut();
        }
        return;
    }

    _Scene_Battle_startActorCommandSelection_ReverieSlide.call(this);
    if (this._actorCommandWindow && this._actorCommandWindow.reverieSlideIn) {
        this._actorCommandWindow.reverieSlideIn();
    }
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
    const windowHeight = 120; 
    return new Rectangle(x, 0, w, windowHeight); 
};

Scene_Battle.prototype.helpWindowRect = topBoxRect;
Scene_Battle.prototype.logWindowRect = topBoxRect;

applyBlackBox(Window_Help);
applyBlackBox(Window_BattleLog);

Window_BattleLog.prototype.lineHeight = function() { return 28; }; 
Window_BattleLog.prototype.maxLines = function() { return 3; }; 
Window_BattleLog.prototype.messageSpeed = function() {
    const speed = ConfigManager.battleTextSpeed !== undefined ? ConfigManager.battleTextSpeed : 1;
    if (speed === 0) return 4;
    if (speed === 2) return 40;
    return 20;
};

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
    this._reverieCommandHomeY = rect.y;
    this._reverieCommandTargetY = rect.y;
    this._reverieCommandSlideHiding = false;
};

Window_ActorCommand.prototype.reverieCommandHiddenY = function() {
    return Graphics.boxHeight + 12;
};

Window_ActorCommand.prototype.reverieCommandRestY = function() {
    const scene = SceneManager._scene;
    const baseY = scene && scene.actorCommandWindowRect
        ? scene.actorCommandWindowRect().y
        : this._reverieCommandHomeY;
    return baseY + ACTOR_COMMAND_REST_Y_OFFSET;
};

Window_ActorCommand.prototype.reverieSlideIn = function() {
    if (this._reverieCommandHomeY === undefined) {
        this._reverieCommandHomeY = this.y;
    }
    if (!this.visible || this.openness <= 0 || this.y >= this.reverieCommandHiddenY() - ACTOR_COMMAND_SLIDE_SNAP) {
        this.y = this.reverieCommandHiddenY();
    }
    this._reverieCommandTargetY = this.reverieCommandRestY();
    this._reverieCommandSlideHiding = false;
    this.show();
    this.open();
    this.openness = 255;
    this._opening = false;
    this._closing = false;
};

Window_ActorCommand.prototype.reverieSlideOut = function() {
    if (this._reverieCommandHomeY === undefined) {
        this._reverieCommandHomeY = this.y;
    }
    this._reverieCommandTargetY = this.reverieCommandHiddenY();
    this._reverieCommandSlideHiding = true;
    this.show();
    this.open();
    this.openness = 255;
    this._opening = false;
    this._closing = false;
};

Window_ActorCommand.prototype.updateReverieSlide = function() {
    if (this._reverieCommandTargetY === undefined) return;
    if (!BattleManager.isInputting() && !this.active && this.visible && !this._reverieCommandSlideHiding) {
        this.reverieSlideOut();
    }
    if (!this._reverieCommandSlideHiding && this.visible) {
        this._reverieCommandTargetY = this.reverieCommandRestY();
    }

    const delta = this._reverieCommandTargetY - this.y;
    if (Math.abs(delta) <= ACTOR_COMMAND_SLIDE_SNAP) {
        this.y = this._reverieCommandTargetY;
        if (this._reverieCommandSlideHiding) {
            this.hide();
            this._reverieCommandSlideHiding = false;
        }
        return;
    }

    const step = Math.max(ACTOR_COMMAND_SLIDE_MIN_STEP, Math.ceil(Math.abs(delta) * ACTOR_COMMAND_SLIDE_EASE));
    this.y += Math.sign(delta) * Math.min(Math.abs(delta), step);
};

const _Window_ActorCommand_update_ReverieSlide = Window_ActorCommand.prototype.update;
Window_ActorCommand.prototype.update = function() {
    _Window_ActorCommand_update_ReverieSlide.call(this);
    this.updateReverieSlide();
};

Window_ActorCommand.prototype.maxCols = function() { return 2; };
Window_ActorCommand.prototype.numVisibleRows = function() { return 3; };
Window_ActorCommand.prototype.lineHeight = function() { return 36; };
Window_ActorCommand.prototype.drawItemBackground = function(index) {}; 
Window_ActorCommand.prototype.refreshCursor = function() { this.setCursorRect(0, 0, 0, 0); }; 

function isAfraidCommandAllowed(commandWindow, index) {
    const actor = commandWindow.actor ? commandWindow.actor() : commandWindow._actor;
    if (!actor || !actor.isStateAffected(AFRAID_STATE_ID)) return true;

    const symbol = commandWindow.commandSymbol(index);
    const name = cleanText(commandWindow.commandName(index)).toLowerCase();
    return symbol === "attack" || symbol === "escape" || name.includes("attack") || name.includes("escape");
}

function actorCommandExt(commandWindow, index) {
    if (!commandWindow || !commandWindow._list || !commandWindow._list[index]) return null;
    return commandWindow._list[index].ext;
}

function isBondActorCommand(commandWindow, index, commandText) {
    return commandText.includes("bond") ||
        (commandWindow.commandSymbol(index) === "skill" &&
        Number(actorCommandExt(commandWindow, index)) === BOND_SKILL_TYPE_ID);
}

function afraidLockedCommandDescription(commandName, commandWindow, index) {
    const name = cleanText(commandName).toLowerCase();
    if (commandWindow && isBondActorCommand(commandWindow, index, name)) return "You are too scared to use bonds.";
    if (name.includes("skill")) return "You are too scared to use skills.";
    if (name.includes("mementos")) return "You are too scared to use mementos.";
    if (name.includes("guard")) return "You are too scared to guard.";
    return "You are too scared to do that.";
}

const _Window_ActorCommand_isCommandEnabled = Window_ActorCommand.prototype.isCommandEnabled;
Window_ActorCommand.prototype.isCommandEnabled = function(index) {
    if (!isAfraidCommandAllowed(this, index)) {
        return false;
    }
    return _Window_ActorCommand_isCommandEnabled.call(this, index);
};

const _Window_ActorCommand_isCurrentItemEnabled = Window_ActorCommand.prototype.isCurrentItemEnabled;
Window_ActorCommand.prototype.isCurrentItemEnabled = function() {
    if (!isAfraidCommandAllowed(this, this.index())) {
        return false;
    }
    return _Window_ActorCommand_isCurrentItemEnabled.call(this);
};

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
            const commandText = commandName.toLowerCase();
            const commandSymbol = this.commandSymbol(this.index());
            let desc = "Select an action.";
            if (!isAfraidCommandAllowed(this, this.index())) {
                desc = afraidLockedCommandDescription(commandName, this, this.index());
            } else if (commandSymbol === "attack" || commandText.includes("attack") || commandText.includes("fight")) {
                desc = "Perform a standard attack on an enemy.";
            } else if (isBondActorCommand(this, this.index(), commandText)) {
                desc = "Use a cooperative bond ability to assist an ally.";
            } else if (commandSymbol === "skill" || commandText.includes("skill")) {
                desc = "Use a character-specific skill.";
            } else if (commandSymbol === "guard" || commandText.includes("guard")) {
                desc = "Defend to reduce incoming damage this turn.";
            } else if (commandSymbol === "item" || commandText.includes("mementos")) {
                desc = "Use a consumable mementos from the party's shared inventory.";
            } else if (commandSymbol === "escape" || commandText.includes("escape")) {
                desc = actorCommandEscapeDescription();
            }
            
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
        this._headerSprite = new Sprite(new Bitmap(rect.width, BATTLE_SUBMENU_HEADER_HEIGHT));
        this.addChild(this._headerSprite);
        forceHideTarget(this._upArrowSprite);
        forceHideTarget(this._downArrowSprite);
    };

    windowClass.prototype.maxCols = function() { return 2; };
    windowClass.prototype.numVisibleRows = function() { return 2; }; 
    windowClass.prototype.drawItemBackground = function(index) {}; 
    windowClass.prototype.refreshCursor = function() { this.setCursorRect(0, 0, 0, 0); }; 

    windowClass.prototype._updateArrows = function() {
        this.downArrowVisible = false;
        this.upArrowVisible = false;
        forceHideTarget(this._upArrowSprite);
        forceHideTarget(this._downArrowSprite);
    };

    windowClass.prototype.cursorDown = function(wrap) { Window_Selectable.prototype.cursorDown.call(this, true); };
    windowClass.prototype.cursorUp = function(wrap) { Window_Selectable.prototype.cursorUp.call(this, true); };
    windowClass.prototype.cursorRight = function(wrap) { Window_Selectable.prototype.cursorRight.call(this, true); };
    windowClass.prototype.cursorLeft = function(wrap) { Window_Selectable.prototype.cursorLeft.call(this, true); };

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
        const y = displayRow * itemHeight + rowSpacing / 2 + BATTLE_SUBMENU_HEADER_HEIGHT;
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
        this.contents.clearRect(0, 0, this.contentsWidth(), BATTLE_SUBMENU_HEADER_HEIGHT);
        
        const item = this.item();
        if (!item) return;

        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = 18;
        this.contents.textColor = '#ffffff';
        this.contents.outlineColor = 'rgba(0,0,0,1)';
        this.contents.outlineWidth = 4;

        this.drawText(
            battleSubMenuItemCostText(this, item),
            0,
            2,
            this.contentsWidth(),
            'center'
        );
    };

    windowClass.prototype.updateHelp = function() {
        if (!this._helpWindow) return;
        this._helpWindow.setText(battleSubMenuHelpText(this, this.item()));
    };

    windowClass.prototype.drawItem = function(index) {
        const item = this.itemAt(index);
        if (!item) return;

        const rect = this.itemLineRect(index);
        
        if (rect.y < BATTLE_SUBMENU_HEADER_HEIGHT || rect.y > this.contentsHeight()) return;
        
        this.contents.clearRect(rect.x - 25, rect.y - 4, rect.width + 50, rect.height + 8);

        let cleanName = cleanText(item.name);

        this.contents.fontFace = CUSTOM_FONT;
        this.contents.fontSize = 18; 
        
        this.contents.textColor = "#ffffff"; 
        this.contents.outlineColor = "rgba(0, 0, 0, 0.9)";
        this.contents.outlineWidth = 4;

        this.changePaintOpacity(this.isEnabled(item));

        const textStartX = 35;      
        const cursorStartX = 0;    

        const textX = rect.x + textStartX;
        
        const actualTextW = this.textWidth(cleanName);

        this.drawText(cleanName, textX, rect.y, actualTextW, 'left'); 

        if (this.index() === index) {
            // Apply your custom cursor position here
            const cursorX = rect.x + cursorStartX; 
            const cursorY = rect.y + (rect.height - CURSOR_DRAW_SIZE) / 2; 
            
            const cursorBmp = ImageManager.loadSystem(CURSOR_IMAGE_NAME);
            
            if (cursorBmp.isReady()) {
                // .blt(image, SrcX, SrcY, SrcW, SrcH, DestX, DestY, DestW, DestH)
                this.contents.blt(
                    cursorBmp, 
                    0, 0, 
                    CURSOR_NATIVE_SIZE, CURSOR_NATIVE_SIZE, 
                    cursorX, cursorY, 
                    CURSOR_DRAW_SIZE, CURSOR_DRAW_SIZE 
                );
            } else {
                cursorBmp.addLoadListener(() => this.redrawItem(index));
            }
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
        this.updateHelp();
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

const setupSlidingBattleChoiceWindow = function(windowClass) {
    const _initialize = windowClass.prototype.initialize;
    windowClass.prototype.initialize = function(rect) {
        this._reverieChoiceInitializing = true;
        _initialize.call(this, rect);
        this._reverieChoiceHomeY = rect.y;
        this._reverieChoiceTargetY = rect.y;
        this._reverieChoiceSlideHiding = false;
        this._reverieChoiceInitializing = false;
        this.hide();
    };

    windowClass.prototype.reverieChoiceHiddenY = function() {
        return Graphics.boxHeight + 12;
    };

    windowClass.prototype.reverieChoiceRestY = function() {
        return this._reverieChoiceHomeY + BATTLE_CHOICE_WINDOW_REST_Y_OFFSET;
    };

    const _show = windowClass.prototype.show;
    windowClass.prototype.show = function() {
        const hiddenY = this.reverieChoiceHiddenY();
        const shouldSlideIn = !this.visible ||
            this._reverieChoiceSlideHiding ||
            this.y >= hiddenY - BATTLE_CHOICE_WINDOW_SLIDE_SNAP;

        _show.call(this);
        if (shouldSlideIn) {
            this.y = hiddenY;
        }
        this._reverieChoiceTargetY = this.reverieChoiceRestY();
        this._reverieChoiceSlideHiding = false;
        this.openness = 255;
        this._opening = false;
        this._closing = false;
    };

    const _hide = windowClass.prototype.hide;
    windowClass.prototype.hide = function() {
        if (this._reverieChoiceInitializing || !SceneManager._scene || !SceneManager._scene._actorCommandWindow) {
            this._reverieChoiceSlideHiding = false;
            _hide.call(this);
            return;
        }

        if (!this.visible && !this._reverieChoiceSlideHiding) {
            _hide.call(this);
            return;
        }

        if (this.hideHelpWindow) {
            this.hideHelpWindow();
        }
        this.deactivate();
        this.visible = true;
        this.openness = 255;
        this._opening = false;
        this._closing = false;
        this._reverieChoiceTargetY = this.reverieChoiceHiddenY();
        this._reverieChoiceSlideHiding = true;
    };

    const _update = windowClass.prototype.update;
    windowClass.prototype.update = function() {
        _update.call(this);
        this.updateReverieChoiceSlide();
    };

    windowClass.prototype.updateReverieChoiceSlide = function() {
        if (this._reverieChoiceTargetY === undefined) return;
        if (!this._reverieChoiceSlideHiding && this.visible) {
            this._reverieChoiceTargetY = this.reverieChoiceRestY();
        }

        const delta = this._reverieChoiceTargetY - this.y;
        if (Math.abs(delta) <= BATTLE_CHOICE_WINDOW_SLIDE_SNAP) {
            this.y = this._reverieChoiceTargetY;
            if (this._reverieChoiceSlideHiding) {
                this._reverieChoiceSlideHiding = false;
                _hide.call(this);
            }
            return;
        }

        const step = Math.max(
            BATTLE_CHOICE_WINDOW_SLIDE_MIN_STEP,
            Math.ceil(Math.abs(delta) * BATTLE_CHOICE_WINDOW_SLIDE_EASE)
        );
        this.y += Math.sign(delta) * Math.min(Math.abs(delta), step);
    };
};

setupSlidingBattleChoiceWindow(Window_BattleSkill);
setupSlidingBattleChoiceWindow(Window_BattleItem);

const gridRectSub = function() {
    const w = Graphics.boxWidth * 0.6; 
    const actorCommandHeight = this.actorCommandWindowRect
        ? this.actorCommandWindowRect().height
        : this.calcWindowHeight(3, true);
    const h = Math.max(this.calcWindowHeight(2, true), actorCommandHeight - BATTLE_SUBMENU_HEIGHT_REDUCTION);
    const x = (Graphics.boxWidth - w) / 2;
    const y = Graphics.boxHeight - h - BATTLE_SUBMENU_BOTTOM_OFFSET;
    return new Rectangle(x, y, w, h);
};
Scene_Battle.prototype.skillWindowRect = gridRectSub;
Scene_Battle.prototype.itemWindowRect = gridRectSub;

const setupInvisibleTarget = function(windowClass) {
    const _initialize = windowClass.prototype.initialize;
    windowClass.prototype.initialize = function(rect) {
        _initialize.call(this, rect);
        this.opacity = 0;
        this.backOpacity = 0;
        this.contentsOpacity = 0;
        this.frameVisible = false;
        if (this.contents) this.contents.clear();
    };
    const _update = windowClass.prototype.update;
    windowClass.prototype.update = function() {
        _update.call(this);
        this.opacity = 0;
        this.backOpacity = 0;
        this.contentsOpacity = 0;
        this.frameVisible = false;
        if (this.contents) this.contents.clear();
        forceHideTarget(this._upArrowSprite);
        forceHideTarget(this._downArrowSprite);
    };
    const _refresh = windowClass.prototype.refresh;
    windowClass.prototype.refresh = function() {
        _refresh.call(this);
        if (this.contents) this.contents.clear();
    };
    windowClass.prototype.drawItemBackground = function(index) {};
    windowClass.prototype.refreshCursor = function() { this.setCursorRect(0, 0, 0, 0); };
    windowClass.prototype.drawAllItems = function() {};
    windowClass.prototype.drawItem = function(index) {}; 
    windowClass.prototype.drawText = function() {};
    windowClass.prototype.drawTextEx = function() { return 0; };
};

setupInvisibleTarget(Window_BattleEnemy);
setupInvisibleTarget(Window_BattleActor);

Window_BattleEnemy.prototype.cursorRight = function(wrap) {
    if (!moveBattleEnemyTarget(this, "right", wrap)) {
        Window_Selectable.prototype.cursorRight.call(this, wrap);
    }
};

Window_BattleEnemy.prototype.cursorLeft = function(wrap) {
    if (!moveBattleEnemyTarget(this, "left", wrap)) {
        Window_Selectable.prototype.cursorLeft.call(this, wrap);
    }
};

Window_BattleEnemy.prototype.cursorDown = function(wrap) {
    if (!moveBattleEnemyTarget(this, "down", wrap)) {
        Window_Selectable.prototype.cursorDown.call(this, wrap);
    }
};

Window_BattleEnemy.prototype.cursorUp = function(wrap) {
    if (!moveBattleEnemyTarget(this, "up", wrap)) {
        Window_Selectable.prototype.cursorUp.call(this, wrap);
    }
};

Window_BattleEnemy.prototype.updateHelp = function() {
    if (this._helpWindow) this._helpWindow.clear();
};

Window_BattleActor.prototype.cursorRight = function(wrap) {
    if (!moveFixedBattleActorTarget(this, "right", wrap)) {
        Window_BattleStatus.prototype.cursorRight.call(this, wrap);
    }
};

Window_BattleActor.prototype.cursorLeft = function(wrap) {
    if (!moveFixedBattleActorTarget(this, "left", wrap)) {
        Window_BattleStatus.prototype.cursorLeft.call(this, wrap);
    }
};

Window_BattleActor.prototype.cursorDown = function(wrap) {
    if (!moveFixedBattleActorTarget(this, "down", wrap)) {
        Window_BattleStatus.prototype.cursorDown.call(this, wrap);
    }
};

Window_BattleActor.prototype.cursorUp = function(wrap) {
    if (!moveFixedBattleActorTarget(this, "up", wrap)) {
        Window_BattleStatus.prototype.cursorUp.call(this, wrap);
    }
};

Window_BattleActor.prototype.updateHelp = function() {
    const actor = selectedBattleActor(this);
    if (this._helpWindow && actor) {
        this._helpWindow.setText("💚 Target: " + cleanText(actor.name()));
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
        } else if (sName.includes("mock") || sName.includes("hype up") || sName.includes("paranoia")) {
            if (hasUpgraded) isFailed = true;
        } else if (sName.includes("overwhelm")) {
            if (!hasBase) isFailed = true;
        } else if (sName.includes("snapback")) {
            if (!target.isStateAffected(8)) isFailed = true;
        } else if (sName.includes("bear hug")) {
            if (!target.isStateAffected(7)) isFailed = true;
        } else if (sName.includes("clinical facts")) {
            if (!target.isStateAffected(6) && !target.isStateAffected(3)) isFailed = true;
        } else if (sName.includes("take it from here")) {
            const userLocked = subject && (
                subject.isStateAffected(6) ||
                subject.isStateAffected(7) ||
                subject.isStateAffected(8) ||
                subject.isStateAffected(9)
            );
            if (target === subject || !hasBase || userLocked || target.isStateAffected(9)) isFailed = true;
        }
    }

    let msg1 = "";
    let msg2 = "";

    if (item) {
        if (DataManager.isSkill(item)) {
            msg1 = item.message1 ? item.message1 : "";
            msg2 = (isFailed && item.message2) ? item.message2 : "";
        } else if (DataManager.isItem(item)) {
            msg1 = "{USER} uses " + item.name + "!";
        }
    }

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
            let wasUpgraded = target.isStateAffected(6);
            let recoveryRate = target.rec;

            let hpAmount = Math.floor(target.mhp * 0.15 * recoveryRate);
            let mpAmount = Math.floor(target.mmp * 0.15 * recoveryRate);
            this.push('addText', tName + " recovered " + hpAmount + " HP!");
            this.push('wait'); 
            this.push('wait');
            this.push('wait');
            this.push('addText', tName + " recovered " + mpAmount + " MP!");

            if (wasUpgraded) {
                this.push('wait');
                this.push('wait');
                this.push('addText', tName + " becomes Heroic!");
            }
        } else if (sName.includes("snapback")) {
            let hpAmount = Math.floor(target.mhp * 0.40 * target.rec);
            this.push('addText', tName + " recovered " + hpAmount + " HP!");
            this.push('wait');
            this.push('wait');
            this.push('addText', tName + " becomes Hopeless!");
        } else if (sName.includes("bear hug")) {
            let mpAmount = Math.floor(target.mmp * 0.40 * target.rec);
            this.push('addText', tName + " recovered " + mpAmount + " MP!");
            this.push('wait');
            this.push('wait');
            this.push('addText', tName + " becomes Frantic!");
        }
    }
    
    // STANDARD DELAY FOR ALL ACTIONS
    this.push('wait');
    this.push('wait');
};

// OVERRIDE DAMAGE & RECOVERY FORMATTING
Window_BattleLog.prototype.takePendingDespairReflectMethods = function() {
    const pending = [];

    for (;;) {
        const lashIndex = this._methods.findIndex(method => {
            return method.name === 'addText' &&
                typeof method.params[0] === 'string' &&
                method.params[0].includes("'s despair lashes out at ");
        });

        if (lashIndex < 0) break;

        let startIndex = lashIndex;
        while (startIndex > 0 && this._methods[startIndex - 1].name === 'wait' && lashIndex - startIndex < 2) {
            startIndex--;
        }

        let reflectEndIndex = lashIndex + 1;
        let endIndex = lashIndex + 1;
        while (endIndex < this._methods.length) {
            const methodName = this._methods[endIndex].name;
            endIndex++;
            if (methodName === 'performDespairReflect') {
                reflectEndIndex = endIndex;
                while (endIndex < this._methods.length && this._methods[endIndex].name === 'wait') {
                    endIndex++;
                }
                break;
            }
        }

        const removed = this._methods.splice(startIndex, endIndex - startIndex);
        const pendingStart = lashIndex - startIndex;
        const pendingEnd = pendingStart + (reflectEndIndex - lashIndex);
        const reflectMethods = removed.slice(pendingStart, pendingEnd);
        pending.push(...reflectMethods);
        pending.push({ name: 'wait', params: [] });
        pending.push({ name: 'wait', params: [] });
        pending.push({ name: 'wait', params: [] });
        pending.push({ name: 'wait', params: [] });
    }

    return pending;
};

Window_BattleLog.prototype.displayHpDamage = function(target) {
    if (target.result().hpAffected) {
        const despairReflectMethods = this.takePendingDespairReflectMethods();
        const afraidAction = BattleManager._action && BattleManager._action._reverieAfraidAttack;
        const afraidSubject = BattleManager._action && BattleManager._action.subject ? BattleManager._action.subject() : null;

        if (afraidAction && target.result().hpDamage === 0) {
            const name = afraidSubject ? cleanText(afraidSubject.name()) : "Someone";
            this.push('addText', name + "'s attack did nothing!");
        } else if (target.result().hpDamage > 0 && !target.result().drain) {
            this.push('addText', cleanText(target.name()) + " takes " + target.result().hpDamage + " damage!");
        } else if (target.result().hpDamage < 0) {
            this.push('addText', cleanText(target.name()) + " recovered " + Math.abs(target.result().hpDamage) + " HP!");
        } else {
            this.push('addText', cleanText(target.name()) + " takes 0 damage!");
        }
        this.push('wait');
        this.push('wait');

        if (despairReflectMethods.length > 0) {
            this._methods.push(...despairReflectMethods);
        }
    }
};

Window_BattleLog.prototype.displayMpDamage = function(target) {
    const damage = target.result().mpDamage;
    if (damage !== 0) {
        const mpName = TextManager.mpA || "MP";
        if (damage > 0) {
            this.push('addText', cleanText(target.name()) + " lost " + damage + " " + mpName + "!");
        } else {
            this.push('addText', cleanText(target.name()) + " recovered " + Math.abs(damage) + " " + mpName + "!");
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
        this.push('addText', cleanText(target.name()) + " revived with 30% HP!");
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

function reverieBuffChangeText(target, paramId, kind) {
    const targetName = battleLogName(target);
    const paramName = TextManager.param(paramId);
    const currentLevel = target.buff ? Number(target.buff(paramId) || 0) : 0;

    if (currentLevel === 0 || kind === "remove") {
        return TextManager.buffRemove.format(targetName, paramName);
    }

    if (kind === "buff") {
        return TextManager.buffAdd.format(targetName, paramName);
    }

    return TextManager.debuffAdd.format(targetName, paramName);
}

function pushReverieBuffText(logWindow, text) {
    logWindow.push('addText', text);
    logWindow.push('wait');
    logWindow.push('wait');
    logWindow.push('wait');
    logWindow.push('wait');
}

function pushReverieEmotionBlockedText(logWindow, target) {
    logWindow.push('addText', battleLogName(target) + "'s current state would not change!");
    logWindow.push('wait');
    logWindow.push('wait');
    logWindow.push('wait');
    logWindow.push('wait');
}

const _Window_BattleLog_displayActionResults_ReverieEmotionBlock = Window_BattleLog.prototype.displayActionResults;
Window_BattleLog.prototype.displayActionResults = function(subject, target) {
    _Window_BattleLog_displayActionResults_ReverieEmotionBlock.call(this, subject, target);

    if (takeBlockedEmotionState(target)) {
        pushReverieEmotionBlockedText(this, target);
    }
};

Window_BattleLog.prototype.displayChangedBuffs = function(target) {
    const result = target.result();

    for (const paramId of result.addedBuffs) {
        pushReverieBuffText(this, reverieBuffChangeText(target, paramId, "buff"));
    }

    for (const paramId of result.addedDebuffs) {
        pushReverieBuffText(this, reverieBuffChangeText(target, paramId, "debuff"));
    }

    for (const paramId of result.removedBuffs) {
        pushReverieBuffText(this, reverieBuffChangeText(target, paramId, "remove"));
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
        
        this.addText(cleanText(target.name()) + " takes " + damage + " backlash damage!");
    }
}

// DEATH MESSAGE CATCHER (HOOKED TO COLLAPSE ANIMATION)
const _Game_Battler_performCollapse = Game_Battler.prototype.performCollapse;
Game_Battler.prototype.performCollapse = function() {
    // 1. Run the normal collapse animation so the sprite fades out
    _Game_Battler_performCollapse.call(this);
    
    // 2. Guarantee we are in combat and the custom Log Window is ready
    if ($gameParty.inBattle() && BattleManager._logWindow) {
        
        // 3. Clean the name and preserve enemy letter suffixes for duplicate troops.
        let cName = battleLogName(this);
        
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

// COMPLETELY KILL MOUSE/TOUCH INPUT IN BATTLE
const _TouchInput_update = TouchInput.update;
TouchInput.update = function() {
    if ($gameParty && $gameParty.inBattle()) {
        this.clear(); // Instantly wipes all mouse clicks and touch data
        return;
    }
    _TouchInput_update.call(this);
};

// THE  "FAILED TO LOAD" CRASH BYPASS
Bitmap.prototype._onError = function() {
    this._hasError = false;
    
    this._isLoading = false;
    this._loadingState = 'loaded'; 
    
    if (this.resize) this.resize(1, 1);
    
    if (this._callLoadListeners) this._callLoadListeners();
};

})();
