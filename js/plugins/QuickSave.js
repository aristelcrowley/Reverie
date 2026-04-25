//=============================================================================
// QuickSave.js
// Author: Copilot
// Description: Tekan F5 untuk langsung membuka menu save game (Scene_Save)
//=============================================================================

(function() {
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 17 && event.location === 2) {
            if (!(SceneManager._scene instanceof Scene_Save)) {
                SceneManager.push(Scene_Save);
            }
        }
    });
})();
