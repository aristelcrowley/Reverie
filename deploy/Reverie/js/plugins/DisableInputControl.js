//=============================================================================
// DisableInputControl.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Menonaktifkan input klik layar (pathfinding) dan arrow keyboard
 * @author Safmica
 * @url https://github.com/Safmica/Reverie
 *
 * @param disableMapTouch
 * @text Disable Klik Layar
 * @desc Menonaktifkan klik layar untuk pathfinding otomatis
 * @type boolean
 * @default true
 *
 * @param disableArrowKeys
 * @text Disable Arrow Keys
 * @desc Menonaktifkan arrow keyboard untuk pergerakan
 * @type boolean
 * @default true
 *
 * @param disableWASD
 * @text Disable WASD Keys
 * @desc Menonaktifkan WASD keyboard untuk pergerakan
 * @type boolean
 * @default false
 *
 * @help
 * ============================================================================
 * Plugin Information
 * ============================================================================
 * 
 * Plugin ini menonaktifkan input klik layar (pathfinding otomatis) dan
 * arrow keyboard untuk kontrol pergerakan player.
 * 
 * ============================================================================
 * Fitur:
 * ============================================================================
 * 
 * - Menonaktifkan klik layar untuk pathfinding otomatis
 * - Menonaktifkan arrow keyboard (↑ ↓ ← →)
 * - Menonaktifkan WASD keyboard (opsional)
 * - Dapat dikonfigurasi dari Plugin Manager
 * 
 * ============================================================================
 * Cara Penggunaan:
 * ============================================================================
 * 
 * 1. Pasang plugin ini di Plugin Manager
 * 2. Atur parameter sesuai kebutuhan
 * 3. Save project dan jalankan game
 * 
 * ============================================================================
 * Plugin Commands:
 * ============================================================================
 * 
 * Plugin ini tidak memiliki plugin commands. Semua konfigurasi dilakukan
 * melalui parameter di Plugin Manager.
 * 
 * ============================================================================
 * Changelog:
 * ============================================================================
 * 
 * Version 1.0.0 - Initial Release
 * - Disable klik layar (pathfinding)
 * - Disable arrow keyboard
 * - Disable WASD keyboard (opsional)
 * 
 */

(() => {
    'use strict';

    const pluginName = "DisableInputControl";
    const parameters = PluginManager.parameters(pluginName);
    
    const disableMapTouch = parameters['disableMapTouch'] === 'true';
    const disableArrowKeys = parameters['disableArrowKeys'] === 'true';
    const disableWASD = parameters['disableWASD'] === 'true';

    //=========================================================================
    // Disable Klik Layar (Map Touch / Pathfinding)
    //=========================================================================
    
    if (disableMapTouch) {
        // Override method isMapTouchOk untuk menonaktifkan klik layar
        Scene_Map.prototype.isMapTouchOk = function() {
            return false;
        };

        // Alternatif: Override processMapTouch jika ingin lebih aman
        const _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
        Scene_Map.prototype.processMapTouch = function() {
            // Tidak melakukan apa-apa, efektif menonaktifkan touch input
        };
    }

    //=========================================================================
    // Disable Arrow Keyboard
    //=========================================================================
    
    if (disableArrowKeys) {
        // Hapus mapping arrow keys dari keyMapper
        // Ini akan membuat arrow keys tidak dikenali sebagai input apapun
        delete Input.keyMapper[37]; // left arrow
        delete Input.keyMapper[38]; // up arrow
        delete Input.keyMapper[39]; // right arrow
        delete Input.keyMapper[40]; // down arrow
        
        // Numpad arrows juga dihapus jika ada
        delete Input.keyMapper[100]; // numpad 4 (left)
        delete Input.keyMapper[104]; // numpad 8 (up)
        delete Input.keyMapper[102]; // numpad 6 (right)
        delete Input.keyMapper[98];  // numpad 2 (down)
    }

    //=========================================================================
    // Disable WASD Keyboard (Opsional)
    //=========================================================================
    
    if (disableWASD) {
        // Hapus mapping WASD keys dari keyMapper
        delete Input.keyMapper[87]; // W
        delete Input.keyMapper[65]; // A
        delete Input.keyMapper[83]; // S
        delete Input.keyMapper[68]; // D
    }

})();
