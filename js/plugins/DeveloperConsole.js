/*:
 * @target MZ
 * @plugindesc Developer Console untuk debugging dan testing.
 * @author Safmica
 *
 * @help
 * Plugin Developer Console.
 * Tekan F6 untuk membuka console.
 * Ketik /help untuk melihat daftar perintah.
 *
 * Command Config JSON:
 * Isi parameter ini dari Plugin Manager untuk membuat command debug permanen.
 *
 * Contoh:
 * {
 *   "Macro": [
 *     {
 *       "name": "setup_test",
 *       "commands": "/sw 1 on; /var 2 10",
 *       "description": "Setup cepat untuk testing"
 *     }
 *   ],
 *   "Switch": [
 *     { "name": "lamp_on", "id": 1, "status": "on" },
 *     { "name": "lamp_off", "id": 1, "status": "off" }
 *   ],
 *   "Variable": [
 *     { "name": "set_score", "id": 2, "value": 50 }
 *   ],
 *   "Teleport": [
 *     { "name": "hub", "mapId": 1, "x": 10, "y": 8 }
 *   ]
 * }
 *
 * Notes:
 * - "Switch", "Switches", dan typo "Swtich" semuanya diterima.
 * - Switch bisa memakai id/switchId, atau switchName jika ingin dicari
 *   dari nama switch database.
 * - Variable bisa memakai id/variableId, atau variableName.
 * - Command name akan dinormalisasi: spasi menjadi "-".
 * - /tp <mapId> <x,y> juga tersedia, contoh: /tp 1 10,8
 *
 * @param CommandConfig
 * @text Command Config JSON
 * @type note
 * @default {}
 * @desc JSON untuk command custom: Macro, Switch/Swtich, Variable, dan Teleport.
 */

(() => {
    'use strict';

    // -------------------------------------------------------------------------
    // Plugin Setup & Variables
    // -------------------------------------------------------------------------
    const PluginName = "DeveloperConsole";
    const Parameters = PluginManager.parameters(PluginName);
    const Config = parseJsonParameter(Parameters.CommandConfig, {}, "CommandConfig");
    let isConsoleOpen = false;

    function parseJsonParameter(rawValue, fallback, label) {
        if (rawValue == null || String(rawValue).trim() === "") {
            return fallback;
        }

        let value = String(rawValue).trim();
        let lastError = null;

        for (let i = 0; i < 3; i++) {
            try {
                const parsed = JSON.parse(value);
                if (typeof parsed === "string") {
                    value = parsed.trim();
                    continue;
                }
                return parsed == null ? fallback : parsed;
            } catch (error) {
                lastError = error;
                break;
            }
        }

        console.error(`[${PluginName}] Failed to parse ${label}.`, lastError);
        return fallback;
    }

    function asArrayConfig(value) {
        if (!value) return [];
        if (Array.isArray(value)) return value;
        if (typeof value !== "object") return [];

        const directEntryKeys = [
            "name",
            "command",
            "alias",
            "id",
            "switchId",
            "switchName",
            "variableId",
            "variableName",
            "eventId",
            "letter",
            "target",
            "mapId",
            "x",
            "y",
            "direction",
            "fadeType",
            "commands",
            "value",
            "status"
        ];
        if (directEntryKeys.some(key => Object.prototype.hasOwnProperty.call(value, key))) {
            return [value];
        }

        return Object.entries(value).map(([name, entry]) => {
            if (entry && typeof entry === "object" && !Array.isArray(entry)) {
                return { name, ...entry };
            }
            return { name, value: entry };
        });
    }

    function firstDefined(...values) {
        return values.find(value => value !== undefined && value !== null && value !== "");
    }

    function toNumber(value, defaultValue = 0) {
        const numberValue = Number(value);
        return Number.isFinite(numberValue) ? numberValue : defaultValue;
    }

    function parseBooleanValue(value, defaultValue = false) {
        if (typeof value === "boolean") return value;
        if (typeof value === "number") return value !== 0;
        if (value == null) return defaultValue;

        const text = String(value).trim().toLowerCase();
        if (["on", "true", "1", "yes", "y", "enable", "enabled"].includes(text)) return true;
        if (["off", "of", "false", "0", "no", "n", "disable", "disabled"].includes(text)) return false;
        return defaultValue;
    }

    function parseVariableValue(value) {
        if (value == null) return value;
        const text = String(value).trim();
        if (text === "") return "";
        if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
        if (["true", "false"].includes(text.toLowerCase())) {
            return text.toLowerCase() === "true";
        }

        try {
            return JSON.parse(text);
        } catch (_error) {
            return value;
        }
    }

    function normalizeCommandName(name) {
        return String(name || "")
            .trim()
            .replace(/^\//, "")
            .replace(/\s+/g, "-")
            .toLowerCase();
    }

    const AUDIO_VOLUME_KEYS = ["bgmVolume", "bgsVolume", "meVolume", "seVolume"];

    function allMasterVolumesAreZero() {
        if (typeof ConfigManager === "undefined") return false;
        return AUDIO_VOLUME_KEYS.every(key => Number(ConfigManager[key]) === 0);
    }

    function restoreMasterVolumesToDefault() {
        ConfigManager.bgmVolume = 100;
        ConfigManager.bgsVolume = 100;
        ConfigManager.meVolume = 100;
        ConfigManager.seVolume = 100;
        if (ConfigManager.save) {
            ConfigManager.save();
        }
    }

    function findDatabaseIdByName(list, name) {
        if (!list || !name) return 0;
        const needle = String(name).trim().toLowerCase();
        return list.findIndex(entryName => String(entryName || "").trim().toLowerCase() === needle);
    }

    function findActorIdByName(name) {
        if (!$dataActors || !name) return 0;
        const needle = String(name).trim().toLowerCase();
        const actor = $dataActors.find(actorData => {
            return actorData && String(actorData.name || "").trim().toLowerCase() === needle;
        });
        return actor ? actor.id : 0;
    }

    function commandConfigGroup(config, keys) {
        for (const key of keys) {
            if (config && Object.prototype.hasOwnProperty.call(config, key)) {
                return config[key];
            }
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Core Engine
    // -------------------------------------------------------------------------
    class DevConsole {
        constructor(config = {}) {
            this.commands = {};
            this.macros = {};
            this.config = config;
            this._configApplied = false;
            this.logHistory = [];
            this.parser = new CommandParser();
            this.registerDefaultCommands();
        }

        ensureAudioDefaultsForDebugTransfer() {
            if (!allMasterVolumesAreZero()) return;
            restoreMasterVolumesToDefault();
            this.log("Audio master volumes were all 0; restored BGM/BGS/ME/SE to 100 before teleport.");
        }

        register(name, handler, description = "") {
            this.commands[normalizeCommandName(name)] = { handler, description };
        }

        registerConfiguredCommand(name, handler, description = "") {
            const commandName = normalizeCommandName(name);
            if (!commandName) {
                this.log("Config command skipped: missing name.", "error");
                return false;
            }
            if (this.commands[commandName]) {
                this.log(`Config command skipped: '/${commandName}' already exists.`, "error");
                return false;
            }

            this.register(commandName, handler, description);
            return true;
        }

        execute(inputString) {
            if (!inputString.startsWith('/')) return this.log(`Error: Command must start with '/'`, 'error');

            const parsed = this.parser.parse(inputString.substring(1));
            
            for (const cmd of parsed) {
                this.executeCommand(cmd.name, cmd.args);
            }
        }

        executeCommand(name, args, callStack = []) {
            const lowerName = name.toLowerCase();

            // Prevent infinite macro loops
            if (callStack.includes(lowerName)) {
                return this.log(`Error: Recursive macro detected ('${name}')`, 'error');
            }

            if (this.commands[lowerName]) {
                try {
                    this.commands[lowerName].handler(args);
                } catch (e) {
                    this.log(`Error executing '${name}': ${e.message}`, 'error');
                }
            } else if (this.macros[lowerName]) {
                const macroCmds = this.parser.parse(this.macros[lowerName].commands);
                for (const mCmd of macroCmds) {
                    this.executeCommand(mCmd.name, mCmd.args, [...callStack, lowerName]);
                }
            } else {
                this.log(`Unknown command: '${name}'. Type /help for a list of commands.`, 'error');
            }
        }

        log(message, type = 'info') {
            this.logHistory.push({ message, type });
            if (this.ui) this.ui.refreshLog();
            console.log(`[DevConsole] ${message}`); // Also log to standard browser console
        }
        
        clearLog() {
            this.logHistory = [];
            if (this.ui) this.ui.refreshLog();
        }

        applyConfig(config) {
            if (!config || typeof config !== "object") return;
            this.registerConfigMacros(commandConfigGroup(config, ["Macro", "Macros", "macro", "macros", "Config", "configs"]));
            this.registerConfigSwitches(commandConfigGroup(config, ["Switch", "Switches", "switch", "switches", "Swtich", "Swtiches"]));
            this.registerConfigVariables(commandConfigGroup(config, ["Variable", "Variables", "variable", "variables"]));
            this.registerConfigSelfSwitches(commandConfigGroup(config, ["SelfSwitch", "SelfSwitches", "selfSwitch", "selfSwitches"]));
            this.registerConfigTeleports(commandConfigGroup(config, ["Teleport", "Teleports", "teleport", "teleports", "Tp", "TP"]));
        }

        applyConfigOnce() {
            if (this._configApplied) return;
            this._configApplied = true;
            this.applyConfig(this.config);
        }

        registerConfigMacros(rawGroup) {
            for (const entry of asArrayConfig(rawGroup)) {
                const rawName = firstDefined(entry.name, entry.command, entry.alias);
                const name = normalizeCommandName(rawName);
                const commands = firstDefined(entry.commands, entry.commandString, entry.run, entry.value);
                if (!name || !commands) {
                    this.log("Macro config skipped: missing name or commands.", "error");
                    continue;
                }
                if (this.commands[name]) {
                    this.log(`Macro config skipped: cannot override base command '/${name}'.`, "error");
                    continue;
                }

                this.macros[name] = {
                    commands: String(commands),
                    description: String(entry.description || entry.desc || "Configured macro")
                };
            }
        }

        registerConfigSwitches(rawGroup) {
            for (const entry of asArrayConfig(rawGroup)) {
                const commandName = firstDefined(entry.command, entry.cmd, entry.alias, entry.name);
                const switchName = firstDefined(entry.switchName, entry.target, entry.name);
                const switchId = toNumber(
                    firstDefined(entry.id, entry.switchId, entry.switchID),
                    findDatabaseIdByName($dataSystem && $dataSystem.switches, switchName)
                );
                const defaultStatus = firstDefined(entry.status, entry.value, entry.state);

                if (switchId <= 0) {
                    this.log(`Switch config skipped for '${commandName || switchName || "(unnamed)"}': invalid switch id/name.`, "error");
                    continue;
                }

                this.registerConfiguredCommand(commandName, (args) => {
                    const rawStatus = args.length > 0 ? args[0] : defaultStatus;
                    if (rawStatus === undefined || rawStatus === null || rawStatus === "") {
                        return this.log(`Usage: /${normalizeCommandName(commandName)} <on/off>`, "error");
                    }
                    const value = parseBooleanValue(rawStatus, null);
                    if (value === null) return this.log("Invalid status. Use on/off.", "error");
                    $gameSwitches.setValue(switchId, value);
                    this.log(`Switch ${switchId} set to ${value ? "ON" : "OFF"}`);
                }, String(entry.description || entry.desc || `Set switch ${switchId}`));
            }
        }

        registerConfigVariables(rawGroup) {
            for (const entry of asArrayConfig(rawGroup)) {
                const commandName = firstDefined(entry.command, entry.cmd, entry.alias, entry.name);
                const variableName = firstDefined(entry.variableName, entry.target, entry.name);
                const variableId = toNumber(
                    firstDefined(entry.id, entry.variableId, entry.variableID),
                    findDatabaseIdByName($dataSystem && $dataSystem.variables, variableName)
                );
                const defaultValue = firstDefined(entry.value, entry.val);

                if (variableId <= 0) {
                    this.log(`Variable config skipped for '${commandName || variableName || "(unnamed)"}': invalid variable id/name.`, "error");
                    continue;
                }

                this.registerConfiguredCommand(commandName, (args) => {
                    const rawValue = args.length > 0 ? args.join(" ") : defaultValue;
                    if (rawValue === undefined || rawValue === null || rawValue === "") {
                        return this.log(`Usage: /${normalizeCommandName(commandName)} <value>`, "error");
                    }
                    const value = parseVariableValue(rawValue);
                    $gameVariables.setValue(variableId, value);
                    this.log(`Variable ${variableId} set to ${JSON.stringify(value)}`);
                }, String(entry.description || entry.desc || `Set variable ${variableId}`));
            }
        }

        registerConfigSelfSwitches(rawGroup) {
            for (const entry of asArrayConfig(rawGroup)) {
                const commandName = firstDefined(entry.command, entry.cmd, entry.alias, entry.name);
                const eventId = toNumber(firstDefined(entry.eventId, entry.eventID, entry.event), 0);
                const letter = String(firstDefined(entry.letter, entry.key, "A")).trim().toUpperCase();
                const defaultStatus = firstDefined(entry.status, entry.value, entry.state);

                if (eventId <= 0 || !["A", "B", "C", "D"].includes(letter)) {
                    this.log(`Self switch config skipped for '${commandName || "(unnamed)"}': invalid event id/letter.`, "error");
                    continue;
                }

                this.registerConfiguredCommand(commandName, (args) => {
                    if (!$gameMap) return this.log("Map not loaded.", "error");
                    const rawStatus = args.length > 0 ? args[0] : defaultStatus;
                    if (rawStatus === undefined || rawStatus === null || rawStatus === "") {
                        return this.log(`Usage: /${normalizeCommandName(commandName)} <on/off>`, "error");
                    }
                    const value = parseBooleanValue(rawStatus, null);
                    if (value === null) return this.log("Invalid status. Use on/off.", "error");
                    const key = [$gameMap.mapId(), eventId, letter];
                    $gameSelfSwitches.setValue(key, value);
                    this.log(`Self Switch ${letter} of Event ${eventId} set to ${value ? "ON" : "OFF"}`);
                }, String(entry.description || entry.desc || `Set self switch ${letter} of event ${eventId}`));
            }
        }

        registerConfigTeleports(rawGroup) {
            for (const entry of asArrayConfig(rawGroup)) {
                const commandName = firstDefined(entry.command, entry.cmd, entry.alias, entry.name);
                const mapId = toNumber(firstDefined(entry.mapId, entry.mapID, entry.id), 0);
                const x = toNumber(firstDefined(entry.x, entry.posX), NaN);
                const y = toNumber(firstDefined(entry.y, entry.posY), NaN);
                const direction = toNumber(firstDefined(entry.direction, entry.dir), 0);
                const fadeType = toNumber(firstDefined(entry.fadeType, entry.fade), 0);

                if (mapId <= 0 || !Number.isFinite(x) || !Number.isFinite(y)) {
                    this.log(`Teleport config skipped for '${commandName || "(unnamed)"}': invalid map/x/y.`, "error");
                    continue;
                }

                this.registerConfiguredCommand(commandName, () => {
                    this.transferPlayer(mapId, x, y, direction, fadeType);
                }, String(entry.description || entry.desc || `Teleport to map ${mapId} (${x}, ${y})`));
            }
        }

        parseTeleportArgs(args) {
            if (args.length < 2) return null;
            const mapId = parseInt(args[0], 10);
            const coordinateNumbers = args.slice(1).join(" ").match(/-?\d+/g) || [];
            if (coordinateNumbers.length < 2) return null;

            return {
                mapId,
                x: parseInt(coordinateNumbers[0], 10),
                y: parseInt(coordinateNumbers[1], 10),
                direction: coordinateNumbers[2] ? parseInt(coordinateNumbers[2], 10) : 0,
                fadeType: coordinateNumbers[3] ? parseInt(coordinateNumbers[3], 10) : 0
            };
        }

        transferPlayer(mapId, x, y, direction = 0, fadeType = 0) {
            if (!$gamePlayer || !$gameMap) return this.log("Map scene is not ready.", "error");
            if ($gameParty && $gameParty.inBattle && $gameParty.inBattle()) {
                return this.log("Cannot teleport during battle.", "error");
            }
            if (!Number.isFinite(mapId) || mapId <= 0) return this.log("Invalid map ID.", "error");
            if (!Number.isFinite(x) || x < 0 || !Number.isFinite(y) || y < 0) {
                return this.log("Invalid coordinates.", "error");
            }
            if ($dataMapInfos && !$dataMapInfos[mapId]) {
                return this.log(`Map ID ${mapId} not found.`, "error");
            }

            $gamePlayer.reserveTransfer(mapId, x, y, direction, fadeType);
            this.ensureAudioDefaultsForDebugTransfer();
            SceneManager.goto(Scene_Map);
            this.log(`Teleporting to Map ${mapId} (${x}, ${y}).`);
            if (this.ui) this.ui.hide();
        }

        registerDefaultCommands() {
            this.register("help", (args) => {
                this.log("--- COMMAND LIST ---");
                for (const [name, cmd] of Object.entries(this.commands)) {
                    this.log(`/${name} : ${cmd.description}`);
                }
                this.log("--- MACROS ---");
                for (const [name, macro] of Object.entries(this.macros)) {
                    this.log(`${name} : ${macro.description}`);
                }
            }, "Menampilkan semua command + deskripsi");

            this.register("heal", (args) => {
                $gameParty.members().forEach(actor => {
                    actor.recoverAll();
                });
                this.log("Party healed.");
            }, "Full HP/MP semua party + clear state");

            this.register("addActor", (args) => {
                if (!$gameParty || !$dataActors) return this.log("Game data is not ready.", "error");
                const targetName = args.join(" ").trim();
                if (!targetName) return this.log("Usage: /addActor <name|all>", "error");

                const names = targetName.toLowerCase() === "all" ? ["ZUKO", "GIN", "ANN"] : [targetName];
                const addedNames = [];
                const skippedNames = [];

                for (const name of names) {
                    const actorId = findActorIdByName(name);
                    if (actorId <= 0) {
                        skippedNames.push(name);
                        continue;
                    }

                    const actorName = $dataActors[actorId].name;
                    $gameParty.addActor(actorId);
                    addedNames.push(actorName);
                }

                if (addedNames.length > 0) {
                    this.log(`Added actor(s): ${addedNames.join(", ")}.`);
                }
                if (skippedNames.length > 0) {
                    this.log(`Actor not found: ${skippedNames.join(", ")}.`, "error");
                }
            }, "Add actor by name. Usage: /addActor <name|all>");

            this.register("where", (args) => {
                if (!$gameMap) return this.log("Map not loaded.", "error");
                const mapId = $gameMap.mapId();
                const name = $dataMapInfos[mapId] ? $dataMapInfos[mapId].name : "Unknown";
                const x = $gamePlayer.x;
                const y = $gamePlayer.y;
                this.log(`Map: ${name} (ID: ${mapId}) | Pos: (${x}, ${y})`);
            }, "Menampilkan Map ID, Nama, dan Posisi Player");

            this.register("tp", (args) => {
                const transfer = this.parseTeleportArgs(args);
                if (!transfer) return this.log("Usage: /tp <mapId> <x,y>  or  /tp <mapId> <x> <y>", "error");
                this.transferPlayer(
                    transfer.mapId,
                    transfer.x,
                    transfer.y,
                    transfer.direction,
                    transfer.fadeType
                );
            }, "Teleport player. Usage: /tp <mapId> <x,y>");
            
            this.register("sw", (args) => {
                if (args.length < 2) return this.log("Usage: /sw <id> <on/off>", "error");
                const id = parseInt(args[0]);
                const value = args[1].toLowerCase() === 'on';
                if (isNaN(id)) return this.log("Invalid switch ID", "error");
                $gameSwitches.setValue(id, value);
                this.log(`Switch ${id} set to ${value ? 'ON' : 'OFF'}`);
            }, "Set switch");
            
            this.register("var", (args) => {
                 if (args.length < 2) return this.log("Usage: /var <id> <value>", "error");
                const id = parseInt(args[0]);
                const value = parseInt(args[1]);
                if (isNaN(id) || isNaN(value)) return this.log("Invalid ID or Value", "error");
                $gameVariables.setValue(id, value);
                this.log(`Variable ${id} set to ${value}`);
            }, "Set variable");

            this.register("ss", (args) => {
                 if (args.length < 3) return this.log("Usage: /ss <eventId> <A|B|C|D> <on/off>", "error");
                 const eventId = parseInt(args[0]);
                 const letter = args[1].toUpperCase();
                 const value = args[2].toLowerCase() === 'on';
                 if (isNaN(eventId)) return this.log("Invalid event ID", "error");
                 if (!['A', 'B', 'C', 'D'].includes(letter)) return this.log("Invalid letter (use A, B, C, or D)", "error");
                 
                 const mapId = $gameMap.mapId();
                 const key = [mapId, eventId, letter];
                 $gameSelfSwitches.setValue(key, value);
                 this.log(`Self Switch ${letter} of Event ${eventId} set to ${value ? 'ON' : 'OFF'}`);
            }, "Set self switch (map aktif)");
            
            this.register("title", (args) => {
                SceneManager.goto(Scene_Title);
                this.log("Returning to title screen...");
                this.ui.hide();
            }, "Kembali ke title screen");

            this.register("win", (args) => {
                if (!$gameParty.inBattle()) return this.log("Not in battle!", "error");
                BattleManager.processVictory();
                this.log("Forced victory.");
            }, "Paksa menang battle");

            this.register("lose", (args) => {
                if (!$gameParty.inBattle()) return this.log("Not in battle!", "error");
                BattleManager.processDefeat();
                this.log("Forced defeat.");
            }, "Paksa kalah battle");
            
            this.register("skipevent", (args) => {
                if ($gameMap && $gameMap._interpreter) {
                     $gameMap._interpreter.clear();
                     this.log("Current event interpreter cleared.");
                } else {
                     this.log("No active event interpreter found.", "error");
                }
            }, "Menghentikan event yang sedang berjalan");
            
            this.register("skipscene", (args) => {
                $gameTemp._skipMode = !$gameTemp._skipMode;
                this.log(`Skip mode set to: ${$gameTemp._skipMode}`);
            }, "Lewati cutscene (toggle)");
            
            this.register("clear", (args) => {
                this.clearLog();
            }, "Bersihkan log console");

            this.register("config", (args) => {
                if (args.length < 1) return this.log("Usage: /config <add|remove|list|run>", "error");
                const action = args[0].toLowerCase();

                switch (action) {
                    case "add":
                        if (args.length < 3) return this.log('Usage: /config add <name> "<cmd1; cmd2>" "<desc>"', "error");
                         // Rejoin args that might have been split by spaces inside quotes (Parser should handle this, but just in case)
                        const rawName = args[1].toLowerCase();
                        if (this.commands[rawName]) return this.log(`Error: Cannot override base command '${rawName}'.`, "error");
                        
                        // Extract quoted strings. A bit hacky if parser already did it, but safe.
                        let cmdsStr = args[2];
                        let descStr = args[3] || "";
                        
                        this.macros[rawName] = { commands: cmdsStr, description: descStr };
                        this.log(`Macro '${rawName}' added.`);
                        break;
                    case "remove":
                        if (args.length < 2) return this.log('Usage: /config remove <name>', "error");
                        const rmName = args[1].toLowerCase();
                        if (this.macros[rmName]) {
                            delete this.macros[rmName];
                            this.log(`Macro '${rmName}' removed.`);
                        } else {
                            this.log(`Macro '${rmName}' not found.`, "error");
                        }
                        break;
                    case "list":
                        this.log("--- MACRO LIST ---");
                         for (const [mName, mData] of Object.entries(this.macros)) {
                            this.log(`${mName} -> [${mData.commands}] : ${mData.description}`);
                        }
                        break;
                    case "run":
                         if (args.length < 2) return this.log('Usage: /config run <name>', "error");
                         this.executeCommand(args[1], args.slice(2)); // Try running as if typed
                         break;
                    default:
                        this.log(`Unknown config action: ${action}`, "error");
                }
            }, "Manage Macros. Subcommands: add, remove, list, run");
        }
    }

    // -------------------------------------------------------------------------
    // Parser
    // -------------------------------------------------------------------------
    class CommandParser {
        parse(input) {
            // Split by ';' for multiple commands, but ignore ';' inside quotes
            const commandStrings = this.splitCommands(input);
            const parsedCommands = [];

            for (let cmdStr of commandStrings) {
                cmdStr = cmdStr.trim();
                if (!cmdStr) continue;

                // If a sub-command string starts with /, remove it (for macros like "/heal; /sw 1 on")
                if (cmdStr.startsWith('/')) {
                    cmdStr = cmdStr.substring(1);
                }

                const args = this.tokenize(cmdStr);
                if (args.length > 0) {
                    const name = args.shift();
                    parsedCommands.push({ name, args });
                }
            }
            return parsedCommands;
        }

        splitCommands(input) {
            const result = [];
            let current = "";
            let inQuotes = false;

            for (let i = 0; i < input.length; i++) {
                const char = input[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                    current += char;
                } else if (char === ';' && !inQuotes) {
                    result.push(current);
                    current = "";
                } else {
                    current += char;
                }
            }
            if (current) result.push(current);
            return result;
        }

        tokenize(input) {
            const regex = /[^\s"']+|"([^"]*)"|'([^']*)'/g;
            const args = [];
            let match;
            while ((match = regex.exec(input)) !== null) {
                // match[1] or match[2] will contain the quoted string without quotes
                // match[0] contains the unquoted token
                args.push(match[1] || match[2] || match[0]);
            }
            return args;
        }
    }

    // -------------------------------------------------------------------------
    // UI Elements
    // -------------------------------------------------------------------------
    class ConsoleUI {
        constructor(consoleCore) {
            this.core = consoleCore;
            this.core.ui = this;
            this.visible = false;
            this.createDOM();
        }

        createDOM() {
            this.container = document.createElement('div');
            this.container.id = 'DevConsoleContainer';
            Object.assign(this.container.style, {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '14px',
                zIndex: '9999',
                display: 'none',
                flexDirection: 'column',
                boxSizing: 'border-box',
                padding: '10px'
            });

            this.logArea = document.createElement('div');
            Object.assign(this.logArea.style, {
                flex: '1',
                overflowY: 'auto',
                marginBottom: '10px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
            });

            this.inputField = document.createElement('input');
            this.inputField.type = 'text';
            Object.assign(this.inputField.style, {
                width: '100%',
                backgroundColor: '#222',
                color: '#fff',
                border: '1px solid #555',
                padding: '5px',
                fontFamily: 'monospace',
                outline: 'none'
            });

            this.inputField.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const value = this.inputField.value;
                    if (value.trim() !== '') {
                        this.core.log(`> ${value}`, 'input');
                        this.core.execute(value);
                        this.inputField.value = '';
                    }
                }
            });

            this.container.appendChild(this.logArea);
            this.container.appendChild(this.inputField);
            document.body.appendChild(this.container);
        }

        toggle() {
            this.visible = !this.visible;
            this.container.style.display = this.visible ? 'flex' : 'none';
            if (this.visible) {
                this.inputField.focus();
                this.refreshLog();
            } else {
                if ($gamePlayer) Input.clear(); // Prevent movement carrying over
            }
        }
        
        hide() {
            this.visible = false;
            this.container.style.display = 'none';
            isConsoleOpen = false;
            if ($gamePlayer) Input.clear();
        }

        refreshLog() {
            this.logArea.innerHTML = '';
            for (const log of this.core.logHistory) {
                const span = document.createElement('div');
                span.textContent = log.message;
                if (log.type === 'error') span.style.color = '#ff6b6b';
                else if (log.type === 'input') span.style.color = '#4ec9b0';
                this.logArea.appendChild(span);
            }
            this.logArea.scrollTop = this.logArea.scrollHeight;
        }
    }

    // -------------------------------------------------------------------------
    // Engine Hooks & Initialization
    // -------------------------------------------------------------------------
    const _Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
        _Game_Temp_initialize.call(this);
        this._skipMode = false;
    };

    // Skip Message
    const _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
    Window_Message.prototype.isTriggered = function() {
        if ($gameTemp && $gameTemp._skipMode) return true;
        return _Window_Message_isTriggered.call(this);
    };
    
    // Skip Wait
    const _Game_Interpreter_updateWaitTime = Game_Interpreter.prototype.updateWaitTime;
    Game_Interpreter.prototype.updateWaitTime = function() {
        if ($gameTemp && $gameTemp._skipMode) {
             this._waitCount = 0;
             return false;
        }
        return _Game_Interpreter_updateWaitTime.call(this);
    };

    window.$devConsole = new DevConsole(Config);

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        window.$devConsole.applyConfigOnce();
        _Scene_Boot_start.call(this);
    };

    let consoleUI = null;

    const _Scene_Manager_run = SceneManager.run;
    SceneManager.run = function(sceneClass) {
        _Scene_Manager_run.call(this, sceneClass);
        if (!consoleUI) {
            consoleUI = new ConsoleUI(window.$devConsole);
        }
    };

    // Input Hook for F6
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F6') {
            if (consoleUI) {
                consoleUI.toggle();
                isConsoleOpen = consoleUI.visible;
            }
            e.preventDefault();
        }
    });
    
    // Prevent RMMZ from eating keys while typing in console
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        if (isConsoleOpen) return;
        _Input_onKeyDown.call(this, event);
    };

    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function(event) {
        if (isConsoleOpen) return;
        _Input_onKeyUp.call(this, event);
    };

})();
