/*:
 * @target MZ
 * @plugindesc Trigger named map events from player region action/touch comments.
 * @author Codex
 *
 * @help RegionToEvent.js
 *
 * Put one or more comments on an active event page:
 *
 *   <RegToEvent: 2, A, EVA_0001>
 *   <RegToEvent: 5, T, EVA_0002>
 *
 * Format:
 *   <RegToEvent: regionId, triggerType, targetEventName>
 *
 * Trigger types:
 *   A = Action. Press OK/Enter/gamepad confirm while standing on the region.
 *   T = Touch. Finish a move onto a tile with the region.
 *
 * A parallel "hub" event can contain many RegToEvent comments. The target is
 * matched by the map event name, so keep target event names unique on a map.
 */

(() => {
    "use strict";

    const TAG_REGEX = /<RegToEvent\s*:\s*(\d+)\s*,\s*([AaTt])\s*,\s*([^>]+?)\s*>/g;

    const RegionToEvent = {
        _lastTouchKey: "",

        mapEntries() {
            const entries = [];
            for (const event of $gameMap.events()) {
                entries.push(...this.entriesFromEvent(event));
            }
            return entries;
        },

        entriesFromEvent(event) {
            const list = event && event.page && event.page() && event.list ? event.list() : null;
            const entries = [];
            if (!list) {
                return entries;
            }

            for (const command of list) {
                if (!command || (command.code !== 108 && command.code !== 408)) {
                    continue;
                }

                const text = String(command.parameters[0] || "");
                TAG_REGEX.lastIndex = 0;
                let match;
                while ((match = TAG_REGEX.exec(text)) !== null) {
                    entries.push({
                        regionId: Number(match[1]),
                        triggerType: String(match[2]).toUpperCase(),
                        targetName: String(match[3]).trim(),
                        sourceEventId: event.eventId()
                    });
                }
            }

            return entries;
        },

        matchingEntries(triggerType) {
            const regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
            return this.mapEntries().filter(entry => {
                return (
                    entry.regionId === regionId &&
                    entry.triggerType === triggerType &&
                    entry.targetName.length > 0
                );
            });
        },

        tryActionTrigger() {
            return this.triggerMatchingEvents("A");
        },

        tryTouchTrigger() {
            const key = [
                $gameMap.mapId(),
                $gamePlayer.x,
                $gamePlayer.y,
                $gameMap.regionId($gamePlayer.x, $gamePlayer.y)
            ].join(":");

            if (this._lastTouchKey === key) {
                return false;
            }

            this._lastTouchKey = key;
            return this.triggerMatchingEvents("T");
        },

        triggerMatchingEvents(triggerType) {
            const entries = this.matchingEntries(triggerType);
            const startedEventIds = new Set();
            let started = false;

            for (const entry of entries) {
                const target = this.findEventByName(entry.targetName);
                if (!target || startedEventIds.has(target.eventId())) {
                    this.warnMissingTarget(entry, target);
                    continue;
                }

                if (this.startEvent(target)) {
                    startedEventIds.add(target.eventId());
                    started = true;
                }
            }

            return started;
        },

        findEventByName(name) {
            const wanted = String(name).trim();
            const events = $gameMap.events();
            const exact = events.find(event => event.event().name === wanted);
            if (exact) {
                return exact;
            }

            const lowerWanted = wanted.toLowerCase();
            return events.find(event => event.event().name.toLowerCase() === lowerWanted);
        },

        startEvent(event) {
            const list = event && event.page && event.page() ? event.list() : null;
            if (!list || list.length <= 1) {
                return false;
            }

            event.start();
            return true;
        },

        warnMissingTarget(entry, target) {
            if (!$gameTemp || !$gameTemp.isPlaytest || !$gameTemp.isPlaytest()) {
                return;
            }
            if (target) {
                return;
            }

            console.warn(
                `RegionToEvent: target event "${entry.targetName}" not found ` +
                `for region ${entry.regionId} on event ${entry.sourceEventId}.`
            );
        }
    };

    window.RegionToEvent = RegionToEvent;

    const _Game_Player_triggerButtonAction = Game_Player.prototype.triggerButtonAction;
    Game_Player.prototype.triggerButtonAction = function() {
        if (Input.isTriggered("ok") && RegionToEvent.tryActionTrigger()) {
            $gameMap.setupStartingEvent();
            return true;
        }
        return _Game_Player_triggerButtonAction.call(this);
    };

    const _Game_Player_updateNonmoving = Game_Player.prototype.updateNonmoving;
    Game_Player.prototype.updateNonmoving = function(wasMoving, sceneActive) {
        if (!$gameMap.isEventRunning() && wasMoving) {
            if (RegionToEvent.tryTouchTrigger()) {
                if ($gameMap.setupStartingEvent()) {
                    return;
                }
            }
        }
        _Game_Player_updateNonmoving.call(this, wasMoving, sceneActive);
    };
})();
