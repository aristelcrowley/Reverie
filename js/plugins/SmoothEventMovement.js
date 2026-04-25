/*:
 * @target MZ
 * @plugindesc Membuat pergerakan autonomous event menjadi lebih natural/smooth menggunakan pathfinding.
 * @author AI Assistant
 *
 * @help SmoothEventMovement.js
 * 
 * Plugin ini merubah cara kerja pergerakan autonomous event (penduduk npc, 
 * monster, dll) agar tidak bergerak patah-patah 1 step lalu berpikir,
 * melainkan langsung menentukan titik tujuan yang jauh dan berjalan natural
 * menggunakan path-finding secara kontinu (smooth seolah memakai Move Route).
 * 
 * ----------------------------------------------------------------------------
 * 1. MODE APPROACH (Mendekati Player)
 * ----------------------------------------------------------------------------
 * Secara otomatis menggantikan pathfinding bawaan.
 * Jika tipe pergerakan event adalah "Approach", kini event akan mengejar 
 * player secara terus-menerus (tanpa delay/jeda step) menggunakan 
 * pathfinding cerdas menghindar dari rintangan.
 * 
 * ----------------------------------------------------------------------------
 * 2. MODE RANDOM (Pergerakan Acak)
 * ----------------------------------------------------------------------------
 * Anda bisa mengubah cara event berjalan acak dengan Tag Note di Event 
 * atau Comment (注釈) di Event Page:
 * 
 * <Direction: S> 
 * S (Smart) = NPC akan langsung menentukan tujuan secara acak. Ia berjalan 
 * kontinu mencari rute ke sana hingga sampai. Setelah sampai, NPC akan diam 
 * santai (Delay sesuai parameter Frequency) lalu mencari tujuan baru lagi.
 * Terintegrasi dengan EventRegionRestrict.js: Jika NPC dilarang keluar 
 * region tertentu, titik tujuannya juga otomatis direstriksi masuk ke region
 * tersebut saja.
 * 
 * <Direction: M>
 * M (Manual) = Pastikan dibarengi tag <Dir_Reg: X, Y>.
 * Event secara mulus berjalan ke titik acak yang BUKAN di sekitarnya,
 * melainkan sengaja menghampiri lantai/ubin yang memiliki Region 
 * sesuai list yang diinputkan di <Dir_Reg>.
 */

(function() {
    "use strict";

    // Inisialisasi variabel baru
    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _Game_Event_initMembers.apply(this, arguments);
        this._smartDestinationX = -1;
        this._smartDestinationY = -1;
        this._movementTypeEx = null; // 'S' atau 'M'
        this._targetRegions = [];
    };

    // Bersihkan rute saat pindah halaman
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function() {
        _Game_Event_setupPage.apply(this, arguments);
        this.clearSmartDestination();
        this.setupSmoothMovementParams();
    };

    Game_Event.prototype.clearSmartDestination = function() {
        this._smartDestinationX = -1;
        this._smartDestinationY = -1;
    };

    Game_Event.prototype.hasSmartDestination = function() {
        return this._smartDestinationX >= 0 && this._smartDestinationY >= 0;
    };

    Game_Event.prototype.isSmartDestinationReached = function() {
        return this.x === this._smartDestinationX && this.y === this._smartDestinationY;
    };

    // Mengambil limitasi region dari EventRegionRestrict jika ada
    Game_Event.prototype.getAllowedRegions = function() {
        return this._allowedRegions || [];
    };

    Game_Event.prototype.setupSmoothMovementParams = function() {
        this._movementTypeEx = null;
        this._targetRegions = [];

        const readMeta = (metaName) => {
            if (this.event().meta[metaName]) return String(this.event().meta[metaName]).trim();
            return null;
        };

        let dirMeta = readMeta('Direction');
        let regMeta = readMeta('Dir_Reg');

        const list = this.list();
        if (list && list.length > 0) {
            for (const line of list) {
                if (line.code === 108 || line.code === 408) {
                    const matchDir = line.parameters[0].match(/<Direction:\s*([a-zA-Z]+)>/i);
                    if (matchDir) {
                        dirMeta = matchDir[1];
                    }
                    const matchReg = line.parameters[0].match(/<Dir_Reg:\s*([\d,\s]+)>/i);
                    if (matchReg) {
                        regMeta = matchReg[1];
                    }
                } else {
                    break;
                }
            }
        }

        if (dirMeta) {
            this._movementTypeEx = dirMeta.toUpperCase();
        }
        if (regMeta) {
            this._targetRegions = regMeta.split(',').map(n => Number(n.trim()));
        }
    };

    //=============================================================================
    // Smooth Continuous Movement (Menghilangkan Jeda/Delay 1-Step)
    //=============================================================================
    const _Game_Event_stopCountThreshold = Game_Event.prototype.stopCountThreshold;
    Game_Event.prototype.stopCountThreshold = function() {
        // Jika mode Approach, bypass jeda step agar mulus mengejar player
        if (this._moveType === 2) {
            return 0; 
        }
        
        // Jika mode Random S/M sedang dalam perjalanan ke target, bypass jeda
        if (this._moveType === 1 && (this._movementTypeEx === 'S' || this._movementTypeEx === 'M')) {
            if (this.hasSmartDestination() && !this.isSmartDestinationReached()) {
                return 0; // Jalan terus tanpa putus (Smooth routing)
            }
            // Jika sudah sampai, kembalikan ke wait/delay normal sehingga NPC 
            // berpikir/diam sejenak sebelum memutuskan rute selanjutnya
        }

        return _Game_Event_stopCountThreshold.call(this);
    };

    //=============================================================================
    // Override Core Autonomous Mode
    //=============================================================================

    // Override Approach (Mendekati Player secara Smart & Terus Menerus)
    Game_Event.prototype.isNextToPlayer = function() {
        const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return (sx + sy <= 1); // Toleransi 1 kotak (atas/bawah/kiri/kanan)
    };

    Game_Event.prototype.moveTypeTowardPlayer = function() {
        if (this.isNextToPlayer()) {
            // Jika sudah bersebelahan dengan target (Player), diam di tempat dan menatap target
            this.turnTowardPlayer();
            return;
        }

        const dir = this.findDirectionTo($gamePlayer.x, $gamePlayer.y);
        if (dir > 0) {
            this.moveStraight(dir);
        } else {
            // Jika sedang buntu terhalang benda tak tembus, berdiam diri / putar acak
            this.moveRandom();
        }
    };

    // Override Random Movement (Membedakan mode S dan M)
    const _Game_Event_moveTypeRandom = Game_Event.prototype.moveTypeRandom;
    Game_Event.prototype.moveTypeRandom = function() {
        if (this._movementTypeEx === 'S' || this._movementTypeEx === 'M') {
            this.updateSmartRandomMovement();
        } else {
            _Game_Event_moveTypeRandom.call(this);
        }
    };

    Game_Event.prototype.updateSmartRandomMovement = function() {
        // Jika baru saja mencapai destinasi, reset, lalu RETURN 
        // agar event menikmati masa "Stop Count" (jeda delay default)
        if (this.hasSmartDestination() && this.isSmartDestinationReached()) {
            this.clearSmartDestination();
            return;
        }

        // Jika tidak punya tujuan, cari tujuan yang sesuai kriteria parameter
        if (!this.hasSmartDestination()) {
            this.determineNewSmartDestination();
        }

        // Jalankan ke tujuan tersebut via A-Star path finding
        if (this.hasSmartDestination()) {
            const dir = this.findDirectionTo(this._smartDestinationX, this._smartDestinationY);
            if (dir > 0) {
                this.moveStraight(dir);
            } else {
                // Jika dir=0 berarti jalan buntu terhalang (jalan terputus di tengah)
                // Kita lupakan tujuan saat ini, biar nanti dia cari rute baru.
                this.clearSmartDestination();
                //this.moveRandom();
            }
        }
    };

    Game_Event.prototype.determineNewSmartDestination = function() {
        // Mode Manual: Cari Tile Spesifik dari Region Target
        if (this._movementTypeEx === 'M' && this._targetRegions.length > 0) {
            const validTiles = [];
            const width = $gameMap.width();
            const height = $gameMap.height();
            
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (this._targetRegions.includes($gameMap.regionId(x, y))) {
                        validTiles.push({ x: x, y: y });
                    }
                }
            }

            if (validTiles.length > 0) {
                const dest = validTiles[Math.randomInt(validTiles.length)];
                this._smartDestinationX = dest.x;
                this._smartDestinationY = dest.y;
                return;
            }
        } 
        
        // Mode Smart (Random Direction, Terintegrasi EventRegionRestrict)
        if (this._movementTypeEx === 'S') {
            let attempts = 40; // Maksimal 40x mencoba mencari ujung rute
            const allowedRegs = this.getAllowedRegions(); 
            
            while (attempts > 0) {
                attempts--;
                const distance = 4 + Math.randomInt(8); // Radius 4 ~ 11 block 
                const angle = Math.random() * Math.PI * 2;
                
                const destX = Math.round(this.x + Math.cos(angle) * distance);
                const destY = Math.round(this.y + Math.sin(angle) * distance);
                
                // Pastikan ujung koord valid & di dalam map
                if ($gameMap.isValid(destX, destY)) {
                    
                    // Terintegrasi dengan EventRegionRestrict.js
                    // Jika Region dibatasi, NPC dilarang set target di region luar batas !!
                    if (allowedRegs.length > 0) {
                        const targetRegId = $gameMap.regionId(destX, destY);
                        if (!allowedRegs.includes(targetRegId)) {
                            continue; // Region tidak diizinkan, lewati, cari loop baru
                        }
                    }

                    // Jika lolos semua pengecekan, jadikan poin tersebut sebagai finish!
                    this._smartDestinationX = destX;
                    this._smartDestinationY = destY;
                    return;
                }
            }
            
            // Jika gagal dpt tile valid (mentok pojok dsb), lupakan tujuan.
            this.clearSmartDestination();
        }
    };

    // Override untuk meningkatkan jarak batas pencarian A-Star jika diperlukan
    // (Bawaan MZ dibatas maks 12 petak untuk mencegah lag)
    const _Game_Character_searchLimit = Game_Character.prototype.searchLimit;
    Game_Character.prototype.searchLimit = function() {
        if (this.event && typeof this.event === 'function') {
             // Berikan batas lebih jauh untuk Smart NPC & Approach yg baru
             return 24; 
        }
        return _Game_Character_searchLimit.call(this);
    };

})();