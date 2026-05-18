/*:
 * @target MZ
 * @plugindesc Reverie - manual autosave from event comments.
 * @author Aristel
 *
 * @help ManualAutosaveComment.js
 *
 * Add this event comment to manually write the autosave slot:
 *
 *   <Autosave>
 *
 * This only runs when the comment command executes. It does not re-enable
 * RPG Maker's automatic autosave behavior.
 *
 * Place this plugin after DisableAutosave.
 */

(() => {
    "use strict";

    const AUTOSAVE_ID = 0;
    const AUTOSAVE_COMMENT_TAG = /<\s*Autosave\s*>/i;

    DataManager._reverieManualAutosaveBusy = false;

    DataManager.reverieManualAutosave = function() {
        if (this._reverieManualAutosaveBusy) return Promise.resolve(false);
        if (!$gameSystem || !$gameParty || ($gameParty.inBattle && $gameParty.inBattle())) {
            return Promise.resolve(false);
        }

        this._reverieManualAutosaveBusy = true;
        this._reverieManualAutosaveInProgress = true;
        $gameSystem.onBeforeSave();

        return Promise.resolve()
            .then(() => this.saveGame(AUTOSAVE_ID))
            .finally(() => {
                this._reverieManualAutosaveInProgress = false;
                this._reverieManualAutosaveBusy = false;
            });
    };

    const collectCommentBlock = function(interpreter) {
        const list = interpreter && interpreter._list ? interpreter._list : [];
        let index = interpreter ? interpreter._index : 0;
        let text = "";

        while (list[index] && (list[index].code === 108 || list[index].code === 408)) {
            const params = list[index].parameters || [];
            text += String(params[0] || "") + "\n";
            index++;
        }

        return text;
    };

    const _Game_Interpreter_command108 = Game_Interpreter.prototype.command108;
    Game_Interpreter.prototype.command108 = function(params) {
        const text = collectCommentBlock(this);
        if (AUTOSAVE_COMMENT_TAG.test(text)) {
            DataManager.reverieManualAutosave().catch(() => {});
        }
        return _Game_Interpreter_command108.call(this, params);
    };
})();
