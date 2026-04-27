/*:
 * @target MZ
 * @plugindesc Developer Console untuk debugging dan testing.
 * @author Safmica
 *
 * @help
 * Plugin Developer Console.
 * Tekan F6 untuk membuka console.
 * Ketik /help untuk melihat daftar perintah.
 */

(() => {
    'use strict';

    // -------------------------------------------------------------------------
    // Plugin Setup & Variables
    // -------------------------------------------------------------------------
    const PluginName = "DeveloperConsole";
    let isConsoleOpen = false;

    // -------------------------------------------------------------------------
    // Core Engine
    // -------------------------------------------------------------------------
    class DevConsole {
        constructor() {
            this.commands = {};
            this.macros = {};
            this.logHistory = [];
            this.parser = new CommandParser();
            this.registerDefaultCommands();
        }

        register(name, handler, description = "") {
            this.commands[name.toLowerCase()] = { handler, description };
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

            this.register("where", (args) => {
                if (!$gameMap) return this.log("Map not loaded.", "error");
                const mapId = $gameMap.mapId();
                const name = $dataMapInfos[mapId] ? $dataMapInfos[mapId].name : "Unknown";
                const x = $gamePlayer.x;
                const y = $gamePlayer.y;
                this.log(`Map: ${name} (ID: ${mapId}) | Pos: (${x}, ${y})`);
            }, "Menampilkan Map ID, Nama, dan Posisi Player");
            
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

    window.$devConsole = new DevConsole();
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