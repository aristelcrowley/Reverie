/*:
 * @target MZ
 * @plugindesc Reverie - disables automatic autosave.
 * @author Aristel
 *
 * @help DisableAutosave.js
 *
 * Automatic autosave is a no-op.
 *
 * Savefile ID 0 can only be written while another plugin deliberately marks
 * a manual autosave as in progress. Manual save files are unchanged.
 */

(() => {
    "use strict";

    const AUTOSAVE_ID = 0;

    DataManager._reverieManualAutosaveInProgress = false;

    Game_System.prototype.isAutosaveEnabled = function() {
        return false;
    };

    Scene_Base.prototype.requestAutosave = function() {};
    Scene_Base.prototype.isAutosaveEnabled = function() {
        return false;
    };
    Scene_Base.prototype.executeAutosave = function() {};

    if (typeof Scene_Map !== "undefined") {
        Scene_Map.prototype.shouldAutosave = function() {
            return false;
        };
    }

    if (typeof Scene_Battle !== "undefined") {
        Scene_Battle.prototype.shouldAutosave = function() {
            return false;
        };
    }

    if (typeof Scene_File !== "undefined") {
        Scene_File.prototype.needsAutosave = function() {
            return false;
        };
    }

    const _DataManager_saveGame = DataManager.saveGame;
    DataManager.saveGame = function(savefileId) {
        if (Number(savefileId) === AUTOSAVE_ID && !this._reverieManualAutosaveInProgress) {
            return Promise.resolve(false);
        }
        return _DataManager_saveGame.call(this, savefileId);
    };

    DataManager.isAnySavefileExists = function() {
        for (let savefileId = 0; savefileId < this.maxSavefiles(); savefileId++) {
            if (this.savefileInfo(savefileId)) return true;
        }
        return false;
    };

    DataManager.latestSavefileId = function() {
        let latestId = 0;
        let latestTimestamp = -Infinity;
        for (let savefileId = 0; savefileId < this.maxSavefiles(); savefileId++) {
            const info = this.savefileInfo(savefileId);
            if (info && info.timestamp > latestTimestamp) {
                latestTimestamp = info.timestamp;
                latestId = savefileId;
            }
        }
        return latestId;
    };

    DataManager.earliestSavefileId = function() {
        let earliestId = 1;
        let earliestTimestamp = Infinity;
        for (let savefileId = 0; savefileId < this.maxSavefiles(); savefileId++) {
            const info = this.savefileInfo(savefileId);
            if (info && info.timestamp < earliestTimestamp) {
                earliestTimestamp = info.timestamp;
                earliestId = savefileId;
            }
        }
        return earliestId;
    };

})();
