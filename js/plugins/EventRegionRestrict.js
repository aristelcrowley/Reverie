/*:
 * @target MZ
 * @plugindesc Membatasi pergerakan Event hanya pada Region ID tertentu.
 * @author AI Assistant
 *
 * @help EventRegionRestrict.js
 * 
 * Plugin ini berfungsi untuk membatasi pergerakan event (Autonomous Movement, 
 * Move Route, dll) agar hanya bisa berjalan di atas Region ID yang diizinkan.
 * 
 * Cara Penggunaan:
 * Tambahkan tag berikut di dalam Note (Catatan) Event ATAU
 * Comment (Catatan Halaman/注釈) pada halaman event:
 * 
 * <Reg_Allow: 1,2,3>
 * 
 * Contoh di atas membuat event tersebut HANYA bisa berjalan di atas 
 * Region 1, Region 2, dan Region 3. Selain dari region tersebut, event 
 * akan menganggapnya sebagai tembok/halangan.
 * 
 * Jika Anda menggunakan Comment, pengaturannya dapat berubah-ubah 
 * untuk setiap halaman event yang aktif.
 */

(function() {
    "use strict";

    //=============================================================================
    // Game_Event
    //=============================================================================

    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.apply(this, arguments);
        this.setupAllowedRegions();
    };

    Game_Event.prototype.setupAllowedRegions = function() {
        this._allowedRegions = [];

        // 1. Cek dari Note Event utama
        if (this.event().meta.Reg_Allow) {
            const metaStr = String(this.event().meta.Reg_Allow);
            this._allowedRegions = metaStr.split(',').map(n => Number(n.trim()));
        }

        // 2. Cek dari Comment/Catatan Halaman (Prioritas lebih tinggi dari Note)
        const list = this.list();
        if (list && list.length > 0) {
            for (const line of list) {
                // Code 108 = Comment, Code 408 = Comment Lanjutan
                if (line.code === 108 || line.code === 408) {
                    const match = line.parameters[0].match(/<Reg_Allow:\s*([\d,\s]+)>/i);
                    if (match) {
                        this._allowedRegions = match[1].split(',').map(n => Number(n.trim()));
                        break;
                    }
                } else {
                    break;
                }
            }
        }
    };

    const _Game_Event_canPass = Game_Event.prototype.canPass;
    Game_Event.prototype.canPass = function(x, y, d) {
        // Hitung koordinat tujuan
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);

        // Jika event ini memiliki batas region
        if (this._allowedRegions && this._allowedRegions.length > 0) {
            const destRegionId = $gameMap.regionId(x2, y2);
            
            // Jika region tujuan TIDAK ada di dalam array allowedRegions, halangi
            if (!this._allowedRegions.includes(destRegionId)) {
                return false;
            }
        }

        // Jika lolos pengecekan region, jalankan pengecekan passability bawaan
        return _Game_Event_canPass.call(this, x, y, d);
    };

})();
