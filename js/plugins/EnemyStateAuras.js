/*:

@target MZ

@plugindesc Tints enemy sprites based on active states.

@author Reverie Custom Script
*/

const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;

Sprite_Enemy.prototype.update = function() {
_Sprite_Enemy_update.call(this);
this.updateEnemyStateBlendColor();
};

Sprite_Enemy.prototype.updateEnemyStateBlendColor = function() {
if (!this._enemy) return;

let blendColor = [0, 0, 0, 0];
const states = this._enemy.states();

for (const state of states) {
    if (state.note.match(/<Enemy Aura Color:\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)>/i)) {
        blendColor = [Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3), Number(RegExp.$4)];
        break; 
    }
}

this.setBlendColor(blendColor);
};