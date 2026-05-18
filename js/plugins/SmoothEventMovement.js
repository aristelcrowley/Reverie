/*:
 * @target MZ
 * @plugindesc Membuat pergerakan autonomous event menjadi lebih natural/smooth menggunakan pathfinding.
 * @author Safmica
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
 * 
 * ----------------------------------------------------------------------------
 * 3. MODE CUSTOM (Monster Agresif / Guard Mode)
 * ----------------------------------------------------------------------------
 * Gunakan tipe pergerakan "Custom" pada event, kemudian pasang salah 
 * satu tag berikut di Note/Comment:
 * 
 * <Mode: Reg>
 * (Terintegrasi dgn EventRegionRestrict). Monster akan berkeliaran acak. 
 * Namun jika Player menginjak Region yang sama dengan "wilayah" teritorialnya
 * (<Reg_Allow: X>), monster akan langsung berubah mengejar Player tiada henti!
 * Jika Player keluar dari wilayah Region tersebut, monster berhenti mengejar.
 * 
 * <Mode: Dist, D>
 * Monster akan mengejar Player hanya jika Player memasuki jarak blok 
 * distance D. Misal <Mode: Dist, 2>, saat player berjarak 2 blok (kiri/
 * kanan/atas/bawah), monster agresif mengejar. Monster akan berhenti 
 * mengejar jika player berhasil kabur menjauh sejauh D + 2 blok.
 * 
 * ----------------------------------------------------------------------------
 * 4. MODE CUTSCENE (Scene / Choreography)
 * ----------------------------------------------------------------------------
 * Pasang di Comment awal Event Page:
 * <Mode: Cutscene: Nama, X, Y, follow|no_follow, Speed, wait|parallel>
 * <Mode: Cutscene_Done>
 * 
 * - Nama: nama actor party (Sora) atau nama event map (EVA0001). Prioritas actor.
 * - X,Y: koordinat absolut map. Kosong = posisi saat ini.
 * - follow: follow menjadikan target leader sementara; no_follow memisah dari leader.
 * - Speed: angka moveSpeed, kosong = speed sekarang.
 * - wait|parallel: wait mem-block event, parallel tidak block.
 * - Pakai "" untuk default.
 */

(function () {
    "use strict";

    const CUTSCENE_WAIT_FRAMES = 30;
    const CUTSCENE_MAX_WAIT_CYCLES = 3;
    const CUTSCENE_MAX_BLOCKED_FRAMES = 60;
    const POST_BATTLE_ENCOUNTER_GRACE_FRAMES = 120;
    const MONSTER_CHASE_SPEED_BONUS = 0.5;
    const MONSTER_CHASE_LOSE_DISTANCE_BONUS = 2;
    const SMOOTH_DIRECTIONS = [2, 4, 6, 8];
    const SMART_RANDOM_DESTINATION_ATTEMPTS = 80;
    const SMART_MANUAL_DESTINATION_SCAN_LIMIT = 240;
    const SMART_MANUAL_REACHABLE_POOL_LIMIT = 32;
    const SMART_FALLBACK_DESTINATION_RADIUS = 12;
    const SMART_EVENT_SEARCH_LIMIT = 24;

    const normalizeCutsceneParam = (value) => {
        if (value === undefined || value === null) return "";
        const text = String(value).trim();
        if (text === '""' || text === "''") return "";
        return text;
    };

    const parseCutsceneFollowMode = (value) => {
        const text = normalizeCutsceneParam(value).toLowerCase();
        if (!text) return "";
        if (["follow", "f", "on", "yes", "leader"].includes(text)) return "follow";
        if (["no_follow", "nofollow", "no-follow", "off", "no", "0"].includes(text)) return "no_follow";
        return "";
    };

    const parseCutsceneWaitMode = (value) => {
        const text = normalizeCutsceneParam(value).toLowerCase();
        if (!text) return "wait";
        if (["parallel", "par", "p"].includes(text)) return "parallel";
        return "wait";
    };

    const parseCutsceneActionText = (text) => {
        const raw = normalizeCutsceneParam(text);
        if (!raw) return null;
        const parts = raw.split(",").map(p => normalizeCutsceneParam(p));
        const name = parts[0];
        if (!name) return null;
        const x = parts.length > 1 && parts[1] !== "" ? Number(parts[1]) : null;
        const y = parts.length > 2 && parts[2] !== "" ? Number(parts[2]) : null;
        const follow = parseCutsceneFollowMode(parts.length > 3 ? parts[3] : "");
        const speedText = parts.length > 4 ? normalizeCutsceneParam(parts[4]) : "";
        const speed = speedText !== "" && !Number.isNaN(Number(speedText)) ? Number(speedText) : null;
        const option = parseCutsceneWaitMode(parts.length > 5 ? parts[5] : "");
        const regionText = parts.length > 6 ? normalizeCutsceneParam(parts[6]) : "";

        let allowedRegions = [];
        if (regionText) {
            allowedRegions = regionText.split("|").map(Number);
        }
        return {
            type: "move",
            name: name,
            x: Number.isFinite(x) ? x : null,
            y: Number.isFinite(y) ? y : null,
            follow: follow,
            speed: speed,
            wait: option !== "parallel",
            _allowedRegions: allowedRegions
        };
    };

    const parseCutsceneModeText = (modeText) => {
        const text = normalizeCutsceneParam(modeText);
        if (!text) return null;
        if (/^cutscene_done$/i.test(text)) {
            return { type: "done", wait: true, explicit: true };
        }
        const actionMatch = text.match(/^cutscene\s*:\s*(.+)$/i);
        if (actionMatch) {
            return parseCutsceneActionText(actionMatch[1]);
        }
        return null;
    };

    const parseCutsceneCommentText = (commentText) => {
        const text = String(commentText ?? "");
        const matchModeStr = text.match(/<Mode:\s*(.+?)>/i);
        if (!matchModeStr) return null;
        return parseCutsceneModeText(matchModeStr[1]);
    };

    const normalizeCharacterKey = (value) => {
        return normalizeCutsceneParam(value).toLowerCase().replace(/[^a-z0-9]/g, "");
    };

    const snapshotCharacterPosition = (character) => {
        if (!character) return null;
        return {
            x: character.x,
            y: character.y,
            direction: character.direction ? character.direction() : 2
        };
    };

    const eventImageMatchesActor = (event, actor) => {
        const page = event && event.page && event.page();
        const image = page && page.image;
        if (!image || image.tileId > 0) return false;
        return image.characterName === actor.characterName() &&
            image.characterIndex === actor.characterIndex();
    };

    const findActorMapCharacterPosition = (actor) => {
        if (typeof $gameMap === "undefined" || typeof $gamePlayer === "undefined") return null;
        if (!$gameMap || !$gamePlayer || !actor) return null;
        const actorKey = normalizeCharacterKey(actor.name());
        if (!actorKey) return null;

        let bestEvent = null;
        let bestScore = 0;
        let bestDistance = Infinity;

        for (const event of $gameMap.events()) {
            if (!event || !event.page || !event.page()) continue;

            const eventKey = normalizeCharacterKey(event.event().name || "");
            const exactNameMatch = eventKey === actorKey;
            const containedNameMatch = actorKey.length >= 3 && eventKey.includes(actorKey);
            const imageMatch = eventImageMatchesActor(event, actor);
            let score = 0;

            if (exactNameMatch) score += 8;
            if (containedNameMatch) score += 4;
            if (imageMatch) score += 3;
            if (score === 0) continue;

            const distance = Math.abs(event.deltaXFrom($gamePlayer.x)) +
                Math.abs(event.deltaYFrom($gamePlayer.y));
            if (score > bestScore || (score === bestScore && distance < bestDistance)) {
                bestEvent = event;
                bestScore = score;
                bestDistance = distance;
            }
        }

        return snapshotCharacterPosition(bestEvent);
    };

    const followerForActorId = (actorId) => {
        if (typeof $gameParty === "undefined" || typeof $gamePlayer === "undefined") return null;
        if (!$gameParty || !$gamePlayer) return null;
        const index = $gameParty.battleMembers().findIndex(actor => {
            return actor && actor.actorId && actor.actorId() === actorId;
        });
        if (index <= 0) return null;
        return $gamePlayer.followers().follower(index - 1);
    };

    const placeNewPartyFollower = (actorId, preferredPosition) => {
        if (typeof $gamePlayer === "undefined" || !$gamePlayer || !$gamePlayer.followers) return;
        const follower = followerForActorId(actorId);
        if (!follower) return;

        const position = preferredPosition || snapshotCharacterPosition($gamePlayer);
        if (!position) return;

        follower.locate(position.x, position.y);
        follower.setDirection(position.direction || $gamePlayer.direction());
        follower._cutsceneDetached = false;
        follower._cutsceneControlled = false;
    };

    const resolveCutsceneTarget = (name) => {
        const key = normalizeCutsceneParam(name).toLowerCase();
        if (!key) return null;
        if (key === "player" || key === "leader") {
            return { character: $gamePlayer, type: "player" };
        }
        const members = $gameParty.battleMembers();
        for (let i = 0; i < members.length; i++) {
            const actor = members[i];
            if (actor && actor.name().toLowerCase() === key) {
                if (i === 0) {
                    return { character: $gamePlayer, type: "player" };
                }
                const follower = $gamePlayer.followers().follower(i - 1);
                if (follower) {
                    return { character: follower, type: "follower", followerIndex: i - 1 };
                }
            }
        }
        if (/^\d+$/.test(key)) {
            const eventId = Number(key);
            const event = $gameMap.event(eventId);
            if (event) {
                return { character: event, type: "event", eventId: eventId };
            }
        }
        for (const event of $gameMap.events()) {
            const eventName = event.event().name || "";
            if (eventName.toLowerCase() === key) {
                return { character: event, type: "event", eventId: event.eventId() };
            }
        }
        return null;
    };

    // Inisialisasi variabel baru
    const _Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function () {
        _Game_Event_initMembers.apply(this, arguments);
        this._smartDestinationX = -1;
        this._smartDestinationY = -1;
        this._movementTypeEx = null; // 'S' atau 'M'
        this._targetRegions = [];
        this._monsterMode = null; // 'REG' atau 'DIST'
        this._monsterDist = 0;
        this._isChasingPlayer = false;
        this._cutsceneActions = [];
        this._cutsceneHasBlocking = false;
        this._cutsceneStartRequested = false;
        this._smoothBlockedFrames = 0;
    };

    // Bersihkan rute saat pindah halaman
    const _Game_Event_setupPage = Game_Event.prototype.setupPage;
    Game_Event.prototype.setupPage = function () {
        _Game_Event_setupPage.apply(this, arguments);
        this.clearSmartDestination();
        this.setupSmoothMovementParams();
    };

    Game_Event.prototype.clearSmartDestination = function () {
        this._smartDestinationX = -1;
        this._smartDestinationY = -1;
        this._smoothBlockedFrames = 0;
    };

    Game_Event.prototype.hasSmartDestination = function () {
        return this._smartDestinationX >= 0 && this._smartDestinationY >= 0;
    };

    Game_Event.prototype.isSmartDestinationReached = function () {
        return this.x === this._smartDestinationX && this.y === this._smartDestinationY;
    };

    // Mengambil limitasi region dari EventRegionRestrict jika ada
    Game_Event.prototype.getAllowedRegions = function () {
        return this._allowedRegions || [];
    };

    const shuffledDirections = () => {
        const directions = SMOOTH_DIRECTIONS.slice();
        for (let i = directions.length - 1; i > 0; i--) {
            const j = Math.randomInt(i + 1);
            const temp = directions[i];
            directions[i] = directions[j];
            directions[j] = temp;
        }
        return directions;
    };

    Game_Event.prototype.smoothNextX = function (x, d) {
        return $gameMap.roundXWithDirection(x, d);
    };

    Game_Event.prototype.smoothNextY = function (y, d) {
        return $gameMap.roundYWithDirection(y, d);
    };

    Game_Event.prototype.smoothDistanceAfterStep = function (d, targetX, targetY) {
        const x2 = this.smoothNextX(this.x, d);
        const y2 = this.smoothNextY(this.y, d);
        return $gameMap.distance(x2, y2, targetX, targetY);
    };

    Game_Event.prototype.isSmartRegionAllowed = function (x, y, allowedRegions) {
        return allowedRegions.length === 0 || allowedRegions.includes($gameMap.regionId(x, y));
    };

    Game_Event.prototype.isSmartTileOccupied = function (x, y) {
        if (this.isCollidedWithPlayerCharacters && this.isCollidedWithPlayerCharacters(x, y)) {
            return true;
        }

        const events = $gameMap.eventsXyNt(x, y).filter(event => event !== this);
        if (this._monsterMode === 'DIST') {
            return events.some(event => event && event.isNormalPriority && event.isNormalPriority());
        }
        return events.length > 0;
    };

    Game_Event.prototype.isSmartTileMapPassable = function (x, y) {
        return SMOOTH_DIRECTIONS.some(d => {
            const x2 = this.smoothNextX(x, d);
            const y2 = this.smoothNextY(y, d);
            return $gameMap.isValid(x2, y2) && this.isMapPassable(x, y, d);
        });
    };

    Game_Event.prototype.isValidSmartDestination = function (x, y, allowedRegions, targetRegions = []) {
        if (!$gameMap.isValid(x, y)) return false;
        if (this.x === x && this.y === y) return false;
        if (!this.isSmartRegionAllowed(x, y, allowedRegions)) return false;
        if (targetRegions.length > 0 && !targetRegions.includes($gameMap.regionId(x, y))) return false;
        if (this.isSmartTileOccupied(x, y)) return false;
        return this.isSmartTileMapPassable(x, y);
    };

    Game_Event.prototype.findReachableSmartDirectionTo = function (goalX, goalY) {
        if (this.x === goalX && this.y === goalY) return 0;

        const searchLimit = this.searchLimit();
        const start = {
            x: this.x,
            y: this.y,
            g: 0,
            f: $gameMap.distance(this.x, this.y, goalX, goalY),
            firstDir: 0
        };
        const keyOf = (x, y) => `${x},${y}`;
        const openList = [start];
        const openKeys = new Set([keyOf(start.x, start.y)]);
        const closedKeys = new Set();
        const nodes = new Map([[keyOf(start.x, start.y), start]]);

        while (openList.length > 0) {
            let bestIndex = 0;
            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < openList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            const current = openList.splice(bestIndex, 1)[0];
            const currentKey = keyOf(current.x, current.y);
            openKeys.delete(currentKey);
            closedKeys.add(currentKey);

            if (current.x === goalX && current.y === goalY) {
                return current.firstDir;
            }

            if (current.g >= searchLimit) continue;

            for (const direction of SMOOTH_DIRECTIONS) {
                if (!this.canPass(current.x, current.y, direction)) continue;

                const x2 = this.smoothNextX(current.x, direction);
                const y2 = this.smoothNextY(current.y, direction);
                const key = keyOf(x2, y2);
                if (closedKeys.has(key)) continue;

                const g = current.g + 1;
                let node = nodes.get(key);
                if (!node) {
                    node = { x: x2, y: y2 };
                    nodes.set(key, node);
                } else if (g >= node.g) {
                    continue;
                }

                node.g = g;
                node.f = g + $gameMap.distance(x2, y2, goalX, goalY);
                node.firstDir = current.firstDir || direction;

                if (!openKeys.has(key)) {
                    openList.push(node);
                    openKeys.add(key);
                }
            }
        }

        return 0;
    };

    Game_Event.prototype.canReachSmartDestination = function (x, y) {
        return (this.x === x && this.y === y) || this.findReachableSmartDirectionTo(x, y) > 0;
    };

    Game_Event.prototype.setSmartDestination = function (x, y) {
        this._smartDestinationX = x;
        this._smartDestinationY = y;
        this._smoothBlockedFrames = 0;
    };

    Game_Event.prototype.trySmoothMoveStraight = function (dir) {
        if (dir <= 0) return false;
        this.moveStraight(dir);
        if (this.isMovementSucceeded()) {
            this._smoothBlockedFrames = 0;
            return true;
        }
        this._smoothBlockedFrames = (this._smoothBlockedFrames || 0) + 1;
        return false;
    };

    Game_Event.prototype.tryMoveFromDirections = function (directions) {
        for (const dir of directions) {
            if (this.canPass(this.x, this.y, dir) && this.trySmoothMoveStraight(dir)) {
                return true;
            }
        }
        return false;
    };

    Game_Event.prototype.tryMoveTowardCoordinate = function (targetX, targetY) {
        const directions = shuffledDirections().sort((a, b) => {
            return this.smoothDistanceAfterStep(a, targetX, targetY) -
                this.smoothDistanceAfterStep(b, targetX, targetY);
        });
        return this.tryMoveFromDirections(directions);
    };

    Game_Event.prototype.tryRandomPassableStep = function () {
        return this.tryMoveFromDirections(shuffledDirections());
    };

    Game_Event.prototype.findFallbackSmartDestination = function (allowedRegions, targetRegions = []) {
        const candidates = [];
        const maxRadius = Math.min(SMART_FALLBACK_DESTINATION_RADIUS, this.searchLimit());

        for (let radius = 1; radius <= maxRadius; radius++) {
            for (let dx = -radius; dx <= radius; dx++) {
                for (let dy = -radius; dy <= radius; dy++) {
                    if (Math.abs(dx) !== radius && Math.abs(dy) !== radius) continue;

                    const x = $gameMap.roundX(this.x + dx);
                    const y = $gameMap.roundY(this.y + dy);
                    if (!this.isValidSmartDestination(x, y, allowedRegions, targetRegions)) continue;
                    if (this.canReachSmartDestination(x, y)) {
                        candidates.push({ x: x, y: y });
                    }
                }
            }

            if (candidates.length > 0) {
                return candidates[Math.randomInt(candidates.length)];
            }
        }

        return null;
    };

    Game_Event.prototype.setupSmoothMovementParams = function () {
        this._movementTypeEx = null;
        this._targetRegions = [];
        this._monsterMode = null;
        this._monsterDist = 0;
        this._isChasingPlayer = false;
        this._cutsceneActions = [];
        this._cutsceneHasBlocking = false;
        this._cutsceneStartRequested = false;
        this._cutsceneExplicitDone = false;

        const readMeta = (metaName) => {
            if (this.event().meta[metaName]) return String(this.event().meta[metaName]).trim();
            return null;
        };

        let dirMeta = readMeta('Direction');
        let regMeta = readMeta('Dir_Reg');
        let modeMeta = readMeta('Mode');

        const list = this.page() ? this.list() : null;
        if (list && list.length > 0) {
            for (const line of list) {
                if (line.code !== 108 && line.code !== 408) continue;

                const text = String(line.parameters?.[0] ?? "");

                const matchDir = text.match(/<Direction:\s*([a-zA-Z]+)>/i);
                if (matchDir) dirMeta = matchDir[1];

                const matchReg = text.match(/<Dir_Reg:\s*([\d,\s]+)>/i);
                if (matchReg) regMeta = matchReg[1];

                const matchModeStr = text.match(/<Mode:\s*(.+?)>/i);
                if (matchModeStr) {
                    const modeText = matchModeStr[1];
                    if (!parseCutsceneModeText(modeText)) {
                        modeMeta = modeText;
                    }
                }
            }
        }

        if (dirMeta) {
            this._movementTypeEx = dirMeta.toUpperCase();
        }
        if (regMeta) {
            this._targetRegions = regMeta.split(',').map(n => Number(n.trim()));
        }
        if (modeMeta && !parseCutsceneModeText(modeMeta)) {
            if (modeMeta.toLowerCase() === 'reg') {
                this._monsterMode = 'REG';
            } else {
                const distMatch = modeMeta.match(/Dist\s*,\s*(\d+)/i);
                if (distMatch) {
                    this._monsterMode = 'DIST';
                    this._monsterDist = Number(distMatch[1]);
                }
            }
        }
    };

    Game_Event.prototype.addCutsceneAction = function (action) {
        if (!action) return;
        this._cutsceneActions.push(action);
        if (action.wait) {
            this._cutsceneHasBlocking = true;
        }
    };

    Game_Event.prototype.parseCutsceneModeTag = function (modeText) {
        const action = parseCutsceneModeText(modeText);
        if (!action) return false;
        this.addCutsceneAction(action);
        return true;
    };

    Game_Event.prototype.hasCutsceneActions = function () {
        return this._cutsceneActions && this._cutsceneActions.length > 0;
    };

    Game_Event.prototype.cutsceneActions = function () {
        return this._cutsceneActions.slice();
    };

    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function () {
        _Game_Temp_initialize.call(this);
        this._cutsceneActive = false;
        this._cutsceneQueue = [];
        this._cutsceneRunning = [];
        this._cutsceneOwnerEventId = 0;
        this._cutsceneInputLocked = false;
        this._cutsceneLeaderCharacter = null;
        this._cutsceneDetachAll = false;
        this._cutsceneWaitRemaining = 0;
        this._cutsceneWaitActive = false;
        this._cutscenePendingEnd = false;
        this._cutsceneTargets = [];
        this._cutsceneGathering = false;
        this._cutsceneEnding = false;
        this._cutsceneAllowedRegions = [];
        this._postBattleEncounterGraceFrames = 0;
        this._pendingBattleTouchEventMapId = 0;
        this._pendingBattleTouchEventId = 0;
    };

    Game_Temp.prototype.setPendingBattleTouchEvent = function (mapId, eventId) {
        this._pendingBattleTouchEventMapId = mapId || 0;
        this._pendingBattleTouchEventId = eventId || 0;
    };

    Game_Temp.prototype.hasPendingBattleTouchEvent = function () {
        return this._pendingBattleTouchEventMapId > 0 && this._pendingBattleTouchEventId > 0;
    };

    Game_Temp.prototype.clearPendingBattleTouchEvent = function () {
        this._pendingBattleTouchEventMapId = 0;
        this._pendingBattleTouchEventId = 0;
    };

    Game_Temp.prototype.startPostBattleEncounterGrace = function () {
        this._postBattleEncounterGraceFrames = Math.max(this._postBattleEncounterGraceFrames || 0, POST_BATTLE_ENCOUNTER_GRACE_FRAMES);
    };

    Game_Temp.prototype.isPostBattleEncounterGraceActive = function () {
        return (this._postBattleEncounterGraceFrames || 0) > 0;
    };

    Game_Temp.prototype.updatePostBattleEncounterGrace = function () {
        if (!this.isPostBattleEncounterGraceActive()) return;
        if ($gameMap && ($gameMap.isEventRunning() || $gameMessage.isBusy())) return;
        this._postBattleEncounterGraceFrames--;
    };

    Game_Temp.prototype.isCutsceneGathering = function () {
        return this._cutsceneGathering;
    };

    Game_Temp.prototype.isCutsceneActive = function () {
        return this._cutsceneActive;
    };

    Game_Temp.prototype.isCutsceneInputLocked = function () {
        return this._cutsceneInputLocked;
    };

    Game_Temp.prototype.isCutsceneBlocking = function (eventId) {
        return this._cutsceneActive && this._cutsceneWaitRemaining > 0 && this._cutsceneOwnerEventId === eventId;
    };

    Game_Temp.prototype.cutsceneLeaderCharacter = function () {
        return this._cutsceneLeaderCharacter;
    };

    Game_Temp.prototype.isFollowerDetached = function (follower) {
        return this._cutsceneDetachAll || !!follower._cutsceneDetached;
    };

    Game_Temp.prototype.startCutsceneFromEvent = function (event, actions) {
        if (!event || !actions || actions.length === 0) {
            return false;
        }
        const queuedActions = actions.map(action => Object.assign({}, action));
        if (this._cutsceneActive) {
            if (this._cutsceneOwnerEventId === event.eventId() && !this._cutscenePendingEnd) {
                this._cutsceneQueue.push(...queuedActions);
                this._cutsceneWaitRemaining += queuedActions.filter(action => action.wait).length;
                this._cutsceneInputLocked = true;
                return true;
            }
            return false;
        }
        this._cutsceneActive = true;
        this._cutsceneOwnerEventId = event.eventId();
        this._cutsceneQueue = queuedActions;
        this._cutsceneRunning = [];
        this._cutsceneLeaderCharacter = null;
        this._cutsceneDetachAll = false;
        this._cutsceneWaitRemaining = this._cutsceneQueue.filter(action => action.wait).length;
        this._cutsceneWaitActive = false;
        this._cutscenePendingEnd = false;
        this._cutsceneTargets = [];
        this._cutsceneInputLocked = true;
        this._cutsceneGathering = false;
        return true;
    };

    Game_Temp.prototype.updateCutscene = function () {
        if (this._cutsceneGathering && !$gamePlayer.areFollowersGathering()) {
            this._cutsceneGathering = false;
            this._cutsceneActive = false;
            this._cutsceneInputLocked = false;
            this._cutsceneExplicitDone = false;
        }

        if (!this._cutsceneActive) {
            if (this._cutsceneGathering && !$gamePlayer.areFollowersGathering()) {
                this._cutsceneGathering = false;
                this._cutsceneInputLocked = false;
            }
            return;
        }

        if (!this._cutsceneWaitActive) {
            this.startNextCutsceneActions();
        }
        this.updateCutsceneActions();

        if (this._cutsceneLeaderCharacter && this._cutsceneLeaderCharacter !== $gamePlayer) {
            $gamePlayer.followers().updateMove();
        }

        if (this._cutscenePendingEnd && this._cutsceneRunning.length === 0) {
            this.finishCutscene();
            return;
        }
        if (this._cutsceneQueue.length === 0 && this._cutsceneRunning.length === 0) {
            this.finishCutscene();
        }
    };

    Game_Temp.prototype.startNextCutsceneActions = function () {
        while (this._cutsceneQueue.length > 0) {
            const action = this._cutsceneQueue.shift();
            if (action.type === "done") {
                if (action.explicit) {
                    this._cutsceneExplicitDone = true;
                }
                this._cutscenePendingEnd = true;
                this._cutsceneQueue = [];
                return;
            }
            if (!this.startCutsceneAction(action)) {
                this.completeCutsceneAction(action);
                continue;
            }
            this._cutsceneRunning.push(action);
            if (action.wait) {
                this._cutsceneWaitActive = true;
                return;
            }
        }
    };

    Game_Temp.prototype.startCutsceneAction = function (action) {
        this._cutsceneAllowedRegions = action._allowedRegions || [];
        if (action.type !== "move") return false;
        const targetInfo = resolveCutsceneTarget(action.name);
        if (!targetInfo) return false;
        const target = targetInfo.character;

        action._target = target;
        action._destX = Number.isFinite(action.x) ? action.x : target.x;
        action._destY = Number.isFinite(action.y) ? action.y : target.y;
        action._blockedFrames = 0;
        action._waitFrames = 0;
        action._waitCycles = 0;

        this.registerCutsceneTarget(target);
        target._cutsceneControlled = true;

        if (action.speed !== null) {
            if (target._cutsceneOriginalMoveSpeed === undefined) {
                target._cutsceneOriginalMoveSpeed = target.moveSpeed();
            }
            target._cutsceneSpeedOverride = action.speed;
            target.setMoveSpeed(action.speed);
        }

        if (action.follow === "follow" && targetInfo.type !== "event") {
            this._cutsceneLeaderCharacter = target;
            if (targetInfo.type === "follower") {
                target._cutsceneDetached = true;
            }
            this._cutsceneDetachAll = false;
        } else if (action.follow === "no_follow") {
            if (targetInfo.type === "player") {
                this._cutsceneDetachAll = true;
            } else if (targetInfo.type === "follower") {
                target._cutsceneDetached = true;
            }
        }

        return true;
    };

    Game_Temp.prototype.registerCutsceneTarget = function (target) {
        if (!this._cutsceneTargets.includes(target)) {
            this._cutsceneTargets.push(target);
        }
    };

    Game_Temp.prototype.updateCutsceneActions = function () {
        for (const action of this._cutsceneRunning) {
            if (!action._done) {
                this.updateCutsceneMoveAction(action);
            }
        }
        this._cutsceneRunning = this._cutsceneRunning.filter(action => !action._done);
    };

    Game_Temp.prototype.canStepTo = function (character, dir, allowedRegions = []) {
        if (!character || dir <= 0) return false;

        const nextX = $gameMap.roundXWithDirection(character.x, dir);
        const nextY = $gameMap.roundYWithDirection(character.y, dir);

        if (!character.canPass(character.x, character.y, dir)) return false;
        if (this.isCutsceneDestinationOccupied(character, nextX, nextY)) return false;

        if (allowedRegions.length > 0) {
            const region = $gameMap.regionId(nextX, nextY);
            if (!allowedRegions.includes(region)) return false;
        }

        return true;
    };

    Game_Temp.prototype.updateCutsceneMoveAction = function (action) {
        if (action.type !== "move") return;
        const target = action._target;
        if (!target) {
            this.completeCutsceneAction(action);
            return;
        }
        if (target.isMoving() || target.isJumping()) {
            return;
        }
        if (target.x === action._destX && target.y === action._destY) {
            this.completeCutsceneAction(action);
            return;
        }
        if (!this.isCutsceneDestinationStandable(target, action._destX, action._destY)) {
            this.completeCutsceneAction(action);
            return;
        }
        if (action._waitFrames > 0) {
            action._waitFrames--;
            return;
        }
        if (this.isCutsceneDestinationOccupied(target, action._destX, action._destY)) {
            action._waitCycles++;
            if (action._waitCycles > CUTSCENE_MAX_WAIT_CYCLES) {
                this.completeCutsceneAction(action);
            } else {
                action._waitFrames = CUTSCENE_WAIT_FRAMES;
            }
            return;
        }

        const allowed = action._allowedRegions || [];

        const dir = target.findDirectionTo(action._destX, action._destY);
        if (this.canStepTo(target, dir, allowed)) {
            target.moveStraight(dir);
            action._blockedFrames = 0;
            return;
        }

        for (const d of [2, 4, 6, 8]) {
            if (this.canStepTo(target, d, allowed)) {
                target.moveStraight(d);
                action._blockedFrames = 0;
                return;
            }
        }
        action._blockedFrames++;
    };

    Game_Temp.prototype.isCutsceneDestinationStandable = function (target, x, y) {
        if (!$gameMap.isValid(x, y)) return false;
        const debugThrough = target.isDebugThrough && target.isDebugThrough();
        if (target.isThrough() || debugThrough) return true;
        return [2, 4, 6, 8].some(d => target.isMapPassable(x, y, d));
    };

    Game_Temp.prototype.isCutsceneDestinationOccupied = function (target, x, y) {
        if ($gamePlayer !== target && $gamePlayer.posNt(x, y)) return true;
        for (const follower of $gamePlayer.followers().visibleFollowers()) {
            if (follower !== target && follower.posNt(x, y)) return true;
        }
        return $gameMap.eventsXyNt(x, y).some(event => event !== target);
    };

    Game_Temp.prototype.tryStepToward = function (character, targetX, targetY, allowedRegions = []) {
        if (!character) return false;
        if (character.isMoving() || character.isJumping()) return false;

        const dir = character.findDirectionTo(targetX, targetY);
        if (!this.canStepTo(character, dir, allowedRegions)) return false;

        character.moveStraight(dir);
        return true;
    };

    Game_Temp.prototype.completeCutsceneAction = function (action) {
        if (action._done) return;
        action._done = true;
        if (action.wait) {
            this._cutsceneWaitRemaining = Math.max(0, this._cutsceneWaitRemaining - 1);
            this._cutsceneWaitActive = false;
        }
    };

    Game_Temp.prototype.finishCutscene = function () {
        // restore target speeds / flags as needed
        for (const target of this._cutsceneTargets) {
            if (target._cutsceneOriginalMoveSpeed !== undefined) {
                target.setMoveSpeed(target._cutsceneOriginalMoveSpeed);
                delete target._cutsceneOriginalMoveSpeed;
            }
            if (target._cutsceneSpeedOverride !== undefined) {
                delete target._cutsceneSpeedOverride;
            }
            target._cutsceneControlled = false;
        }

        for (const follower of $gamePlayer.followers().data()) {
            follower._cutsceneDetached = false;
        }

        this._cutsceneQueue = [];
        this._cutsceneRunning = [];
        this._cutsceneOwnerEventId = 0;
        this._cutsceneLeaderCharacter = null;
        this._cutsceneDetachAll = false;
        this._cutsceneWaitRemaining = 0;
        this._cutsceneWaitActive = false;
        this._cutscenePendingEnd = false;
        this._cutsceneTargets = [];

        if (this._cutsceneExplicitDone && $gamePlayer.followers().visibleFollowers().length > 0) {
            this._cutsceneAllowedRegions = [];
            this._cutsceneGathering = true;
            this._cutsceneInputLocked = true;
            $gamePlayer.followers().gather();
            return;
        }

        this._cutsceneActive = false;
        this._cutsceneGathering = false;
        this._cutsceneInputLocked = false;
        this._cutsceneExplicitDone = false;
    };

    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function () {
        if ($gameTemp && $gameTemp.isCutsceneInputLocked()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    const _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function () {
        _Game_Follower_update.call(this);
        if ($gameTemp && $gameTemp.isCutsceneActive() && this._cutsceneSpeedOverride !== undefined) {
            this.setMoveSpeed(this._cutsceneSpeedOverride);
        }
    };

    const _Game_Followers_updateMove = Game_Followers.prototype.updateMove;
    Game_Followers.prototype.updateMove = function () {
        if ($gameTemp && ($gameTemp.isCutsceneActive() || $gameTemp.isCutsceneGathering())) {
            const leader = $gameTemp.cutsceneLeaderCharacter() || $gamePlayer;
            const attached = [];

            for (let i = 0; i < this._data.length; i++) {
                const follower = this._data[i];
                if (!$gameTemp.isFollowerDetached(follower)) {
                    attached.push(i);
                }
            }

            let preceding = leader;
            const precedingMap = {};

            for (const index of attached) {
                precedingMap[index] = preceding;
                preceding = this._data[index];
            }

            for (let i = attached.length - 1; i >= 0; i--) {
                const index = attached[i];
                const follower = this._data[index];
                const target = precedingMap[index];

                if (follower && target) {
                    follower.chaseCharacter(target);
                }
            }
            return;
        }

        _Game_Followers_updateMove.call(this);
    };

    const _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function (actorId) {
        const actor = typeof $gameActors !== "undefined" && $gameActors ? $gameActors.actor(actorId) : null;
        const alreadyInParty = this._actors.includes(actorId);
        const sourcePosition = !alreadyInParty ? findActorMapCharacterPosition(actor) : null;

        _Game_Party_addActor.call(this, actorId);

        if (!alreadyInParty && this._actors.includes(actorId)) {
            placeNewPartyFollower(actorId, sourcePosition);
        }
    };

    const _Game_Event_updateSelfMovement = Game_Event.prototype.updateSelfMovement;
    Game_Event.prototype.updateSelfMovement = function () {
        if (this._cutsceneControlled) {
            return;
        }
        if ($gameTemp && $gameTemp.isPostBattleEncounterGraceActive() && this.isBattleTouchEvent()) {
            this.clearSmartDestination();
            return;
        }
        _Game_Event_updateSelfMovement.call(this);
    };

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function () {
        if ($gameTemp && $gameTemp.isPostBattleEncounterGraceActive() && this.isBattleTouchEvent()) {
            return;
        }
        _Game_Event_start.call(this);
        // tryStartCutscene dipindahkan ke Game_Interpreter.prototype.setup agar tidak tertimpa
    };

    Game_Event.prototype.isBattleTouchEvent = function () {
        if (this._trigger !== 2) return false;
        const list = this.page() ? this.list() : null;
        return !!(list && list.some(command => command && command.code === 301));
    };

    Game_Event.prototype.tryStartCutscene = function (interpreter) {
        if (!this.hasCutsceneActions() || this._cutsceneStartRequested) return;
        if (!$gameTemp) return;
        const started = $gameTemp.startCutsceneFromEvent(this, this.cutsceneActions());
        if (started) {
            this._cutsceneStartRequested = true;
            if (this._cutsceneHasBlocking && interpreter) {
                interpreter.setWaitMode("cutscene");
            }
        }
    };

    const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    Game_Interpreter.prototype.setup = function (list, eventId) {
        _Game_Interpreter_setup.call(this, list, eventId);
        if (eventId > 0) {
            const event = $gameMap.event(eventId);
            if (event && event.hasCutsceneActions()) {
                event.tryStartCutscene(this);
            }
        }
    };

    Game_Interpreter.prototype.startCutsceneFromComments = function () {
        if (!$gameTemp || this._eventId <= 0) return;
        const event = $gameMap.event(this._eventId);
        if (!event) return;

        const actions = [];
        for (const comment of this._comments || []) {
            const action = parseCutsceneCommentText(comment);
            if (action) actions.push(action);
        }
        if (actions.length === 0) return;

        const started = $gameTemp.startCutsceneFromEvent(event, actions);
        if (started && actions.some(action => action.wait)) {
            this.setWaitMode("cutscene");
        }
    };

    const _Game_Interpreter_command108 = Game_Interpreter.prototype.command108;
    Game_Interpreter.prototype.command108 = function (params) {
        const result = _Game_Interpreter_command108.call(this, params);
        this.startCutsceneFromComments();
        return result;
    };

    const _Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
    Game_Interpreter.prototype.command301 = function (params) {
        const event = this._eventId > 0 ? $gameMap.event(this._eventId) : null;
        const result = _Game_Interpreter_command301.call(this, params);
        if ($gameTemp && event && event.isBattleTouchEvent && event.isBattleTouchEvent() && SceneManager.isNextScene(Scene_Battle)) {
            $gameTemp.setPendingBattleTouchEvent($gameMap.mapId(), this._eventId);
        }
        return result;
    };

    const _BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function (result) {
        const shouldStartGrace = $gameTemp && $gameTemp.hasPendingBattleTouchEvent() && (result === 0 || result === 1);
        _BattleManager_endBattle.call(this, result);
        if ($gameTemp && $gameTemp.hasPendingBattleTouchEvent()) {
            if (shouldStartGrace) {
                $gameTemp.startPostBattleEncounterGrace();
            }
            $gameTemp.clearPendingBattleTouchEvent();
        }
    };

    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function (sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        if ($gameTemp) {
            $gameTemp.updateCutscene();
            $gameTemp.updatePostBattleEncounterGrace();
        }
    };

    const _Game_Interpreter_updateWaitMode = Game_Interpreter.prototype.updateWaitMode;
    Game_Interpreter.prototype.updateWaitMode = function () {
        if (this._waitMode === "cutscene") {
            const waiting = $gameTemp && $gameTemp.isCutsceneBlocking(this._eventId);
            if (!waiting) {
                this._waitMode = "";
            }
            return waiting;
        }
        return _Game_Interpreter_updateWaitMode.call(this);
    };

    //=============================================================================
    // Smooth Continuous Movement (Menghilangkan Jeda/Delay 1-Step)
    //=============================================================================
    const _Game_Event_stopCountThreshold = Game_Event.prototype.stopCountThreshold;
    Game_Event.prototype.stopCountThreshold = function () {
        // Jika mode Approach, bypass jeda step agar mulus mengejar player
        if (this._moveType === 2) {
            return 0;
        }

        // Jika moveTypeCustom, dan dalam mode kejar player
        if (this._moveType === 3) {
            if (this._monsterMode === 'REG') {
                const allowedRegs = this.getAllowedRegions();
                const playerRegion = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
                if (allowedRegs.includes(playerRegion)) return 0;
            } else if (this._monsterMode === 'DIST' && this._isChasingPlayer) {
                return 0;
            }
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

    const _Game_Event_isCollidedWithEvents = Game_Event.prototype.isCollidedWithEvents;
    Game_Event.prototype.isCollidedWithEvents = function (x, y) {
        if (this._monsterMode === 'DIST') {
            const events = this.eventsXyNt ? this.eventsXyNt(x, y) : $gameMap.eventsXyNt(x, y).filter(event => event !== this);
            return events.some(event => event && event.isNormalPriority && event.isNormalPriority());
        }
        return _Game_Event_isCollidedWithEvents.call(this, x, y);
    };

    //=============================================================================
    // Override Core Autonomous Mode
    //=============================================================================

    // Override Approach (Mendekati Player secara Smart & Terus Menerus)
    Game_Event.prototype.isNextToPlayer = function () {
        const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
        const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
        return (sx + sy <= 1); // Toleransi 1 kotak (atas/bawah/kiri/kanan)
    };

    Game_Event.prototype.moveTypeTowardPlayer = function () {
        if (this.isNextToPlayer()) {
            if (!this._monsterMode) {
                // NPC Biasa: diam di tempat dan menatap target jika sudah dekat
                this.turnTowardPlayer();
                return;
            } else {
                // Monster Agresif: Seruduk/Tabrak langsung untuk trigger Event Touch (Battle)
                this.moveTowardPlayer();
                return;
            }
        }

        const dir = this.findDirectionTo($gamePlayer.x, $gamePlayer.y);
        if (dir > 0 && this.trySmoothMoveStraight(dir)) {
            return;
        }

        if (this.tryMoveTowardCoordinate($gamePlayer.x, $gamePlayer.y)) {
            return;
        }

        // Jika semua jalur sedang tertutup, jangan mengunci arah gagal yang sama.
        this.turnTowardPlayer();
    };

    // Override Random Movement (Membedakan mode S dan M)
    const _Game_Event_moveTypeRandom = Game_Event.prototype.moveTypeRandom;
    Game_Event.prototype.moveTypeRandom = function () {
        if (this._movementTypeEx === 'S' || this._movementTypeEx === 'M') {
            this.updateSmartRandomMovement();
        } else {
            switch (Math.randomInt(6)) {
                case 0:
                case 1:
                    if (!this.tryRandomPassableStep()) this.turnRandom();
                    break;
                case 2:
                case 3:
                case 4:
                    if (!this.trySmoothMoveStraight(this.direction())) {
                        this.tryRandomPassableStep();
                    }
                    break;
                case 5:
                    this.resetStopCount();
                    break;
                default:
                    _Game_Event_moveTypeRandom.call(this);
                    break;
            }
        }
    };

    // Override Custom Movement untuk Monster Guard
    const _Game_Event_moveTypeCustom = Game_Event.prototype.moveTypeCustom;
    Game_Event.prototype.moveTypeCustom = function () {
        if (this._monsterMode === 'REG' || this._monsterMode === 'DIST') {
            this.updateMonsterCustomMovement();
        } else {
            _Game_Event_moveTypeCustom.call(this);
        }
    };

    Game_Event.prototype.updateMonsterCustomMovement = function () {
        const wasChasing = this._isChasingPlayer;
        let isNowChasing = false;

        if (this._monsterMode === 'REG') {
            const allowedRegs = this.getAllowedRegions();
            const playerRegion = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);

            // Player menginjak region kekuasaan monster?
            if (allowedRegs.includes(playerRegion)) {
                isNowChasing = true;
            } else {
                isNowChasing = false;
            }
        }
        else if (this._monsterMode === 'DIST') {
            const allowedRegs = this.getAllowedRegions();
            const playerRegion = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
            const playerInAllowedRegion = allowedRegs.length === 0 || allowedRegs.includes(playerRegion);
            const sx = Math.abs(this.deltaXFrom($gamePlayer.x));
            const sy = Math.abs(this.deltaYFrom($gamePlayer.y));
            // Hitung jarak (distance manhattan / taksi)
            const distance = sx + sy; // Total blok

            if (!playerInAllowedRegion) {
                isNowChasing = false;
            } else if (!wasChasing) {
                // Jika sedang tidak agresif, cek apakah player masuk ke radius Deteksi
                if (distance <= this._monsterDist) {
                    isNowChasing = true;
                }
            } else {
                // Jika sedang agresif, cek apakah player sudah menjauh (Distance + bonus jarak kabur)
                if (distance > this._monsterDist + MONSTER_CHASE_LOSE_DISTANCE_BONUS) {
                    isNowChasing = false;
                } else {
                    isNowChasing = true;
                }
            }
        }

        // Terapkan perubahan status
        this._isChasingPlayer = isNowChasing;

        // Logika munculnya Balon, kecepatan lari, dan Stun saat transisi:
        if (this._isChasingPlayer && !wasChasing) {
            // Baru saja menyadari keberadaan Player (Mulai mengejar)
            $gameTemp.requestBalloon(this, 1); // Balon Exclamation (!)

            // Simpan speed awal agar nanti kembalinya bener
            if (this._originalMoveSpeed === undefined) {
                this._originalMoveSpeed = this.moveSpeed();
            }
            this.setMoveSpeed(this._originalMoveSpeed + MONSTER_CHASE_SPEED_BONUS); // Tambah ngebut! (Bisa disesuaikan misal jd 4)

            // Supaya gak langsung glith ngebut pas kaget, force tunggu balon bentar 
            this._waitCount = 30; // Stun kaget bentar
            return; // Skip pergerakan 1 frame ini

        } else if (!this._isChasingPlayer && wasChasing) {
            // Baru saja kehilangan Player (Berhenti mengejar / Player lepas)
            $gameTemp.requestBalloon(this, 2); // Balon Question (?)

            if (this._originalMoveSpeed !== undefined) {
                this.setMoveSpeed(this._originalMoveSpeed); // Balik ke speed asal letoy
            } else {
                this.setMoveSpeed(3);
            }

            this._waitCount = 90; // Stun alias tengok-tengok bingung kehilangan mangsa
            return; // Skip pergerakan frame
        }

        // Jalankan eksekusi jalannya:
        if (this._isChasingPlayer) {
            this.moveTypeTowardPlayer(); // Ubah jadi agresif mengejar target!
        } else {
            // Kehilangan target, maka jalan-jalan di teritorial regionnya
            if (this._movementTypeEx === 'S' || this._movementTypeEx === 'M') {
                this.updateSmartRandomMovement();
            } else {
                if (!this.tryRandomPassableStep()) this.turnRandom();
            }
        }
    };

    Game_Event.prototype.updateSmartRandomMovement = function () {
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
            const targetX = this._smartDestinationX;
            const targetY = this._smartDestinationY;
            const dir = this.findReachableSmartDirectionTo(targetX, targetY);
            if (dir > 0 && this.trySmoothMoveStraight(dir)) {
                return;
            } else if (dir > 0) {
                this.clearSmartDestination();
                this.tryMoveTowardCoordinate(targetX, targetY);
            } else {
                // Jika dir=0 berarti jalan buntu terhalang (jalan terputus di tengah)
                // Kita lupakan tujuan saat ini, lalu ambil langkah aman jika ada.
                this.clearSmartDestination();
                this.tryRandomPassableStep();
            }
        } else {
            this.tryRandomPassableStep();
        }
    };

    Game_Event.prototype.determineNewSmartDestination = function () {
        const allowedRegs = this.getAllowedRegions();

        // Mode Manual: Cari Tile Spesifik dari Region Target
        if (this._movementTypeEx === 'M' && this._targetRegions.length > 0) {
            const validTiles = [];
            const width = $gameMap.width();
            const height = $gameMap.height();

            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    if (this.isValidSmartDestination(x, y, allowedRegs, this._targetRegions)) {
                        validTiles.push({ x: x, y: y });
                    }
                }
            }

            if (validTiles.length > 0) {
                validTiles.sort((a, b) => {
                    return $gameMap.distance(this.x, this.y, a.x, a.y) -
                        $gameMap.distance(this.x, this.y, b.x, b.y);
                });

                const reachableTiles = [];
                const scanLimit = Math.min(validTiles.length, SMART_MANUAL_DESTINATION_SCAN_LIMIT);
                for (let i = 0; i < scanLimit; i++) {
                    const tile = validTiles[i];
                    if (this.canReachSmartDestination(tile.x, tile.y)) {
                        reachableTiles.push(tile);
                        if (reachableTiles.length >= SMART_MANUAL_REACHABLE_POOL_LIMIT) break;
                    }
                }

                if (reachableTiles.length > 0) {
                    const dest = reachableTiles[Math.randomInt(reachableTiles.length)];
                    this.setSmartDestination(dest.x, dest.y);
                    return;
                }
            }

            const fallback = this.findFallbackSmartDestination(allowedRegs, this._targetRegions);
            if (fallback) {
                this.setSmartDestination(fallback.x, fallback.y);
                return;
            }
        }

        // Mode Smart (Random Direction, Terintegrasi EventRegionRestrict)
        if (this._movementTypeEx === 'S') {
            let attempts = SMART_RANDOM_DESTINATION_ATTEMPTS;

            while (attempts > 0) {
                attempts--;
                const distance = 4 + Math.randomInt(8); // Radius 4 ~ 11 block 
                const angle = Math.random() * Math.PI * 2;

                const destX = Math.round(this.x + Math.cos(angle) * distance);
                const destY = Math.round(this.y + Math.sin(angle) * distance);

                if (this.isValidSmartDestination(destX, destY, allowedRegs) &&
                    this.canReachSmartDestination(destX, destY)) {
                    this.setSmartDestination(destX, destY);
                    return;
                }
            }

            const fallback = this.findFallbackSmartDestination(allowedRegs);
            if (fallback) {
                this.setSmartDestination(fallback.x, fallback.y);
                return;
            }

            // Jika gagal dpt tile reachable (mentok pojok/dikepung), lupakan tujuan.
            this.clearSmartDestination();
        }
    };

    // Override untuk meningkatkan jarak batas pencarian A-Star jika diperlukan
    // (Bawaan MZ dibatas maks 12 petak untuk mencegah lag)
    const _Game_Character_searchLimit = Game_Character.prototype.searchLimit;
    Game_Character.prototype.searchLimit = function () {
        if (this.event && typeof this.event === 'function') {
            // Berikan batas lebih jauh untuk Smart NPC & Approach yg baru
            return Math.max(SMART_EVENT_SEARCH_LIMIT, _Game_Character_searchLimit.call(this));
        }
        return _Game_Character_searchLimit.call(this);
    };

})();
