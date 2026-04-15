/*:
 * @target MZ
 * @plugindesc Force enemy position to bottom with adjustable offset
 * @author Safmica
 *
 * @param Bottom Offset
 * @type number
 * @min -9999
 * @max 9999
 * @default 40
 * @desc Jarak dari bawah layar (semakin kecil = makin ke bawah)
 *
 */

/*:
 * @target MZ
 * @plugindesc Force enemy to bottom with adjustable offset (supports negative)
 *
 * @param Bottom Offset
 * @type number
 * @min -9999
 * @max 9999
 * @default 40
 */

(() => {
    const pluginName = document.currentScript.src.match(/([^\/]+)\.js$/)[1];
    const params = PluginManager.parameters(pluginName);
    const bottomOffset = Number(params["Bottom Offset"] ?? 40);

    const _Sprite_Enemy_updatePosition = Sprite_Enemy.prototype.updatePosition;

    Sprite_Enemy.prototype.updatePosition = function() {
        _Sprite_Enemy_updatePosition.call(this);

        this.anchor.y = 1;

        this.y = Graphics.height - bottomOffset;
    };
})();