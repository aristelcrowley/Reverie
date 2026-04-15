/*:
 * @target MZ
 * @plugindesc Shows a colored outline on enemies based on their current state.
 * @author Safmica
 *
 * @help
 * This plugin creates a colored outline around enemies depending on 
 * their active states. It uses a custom WebGL shader to detect the edges 
 * of the enemy's image and color them.
 * 
 * You can configure which State ID matches which color in the parameters.
 *
 * @param FranticStateId
 * @type state
 * @text Frantic State (Red)
 * @desc The state ID that gives the enemy a red outline.
 * @default 10
 *
 * @param HeroicStateId
 * @type state
 * @text Heroic State (Yellow)
 * @desc The state ID that gives the enemy a yellow outline.
 * @default 11
 *
 * @param HopelessStateId
 * @type state
 * @text Hopeless State (Blue)
 * @desc The state ID that gives the enemy a blue outline.
 * @default 12
 *
 * @param OutlineThickness
 * @type number
 * @text Outline Thickness
 * @desc Thickness of the outline in pixels.
 * @default 2
 */

(() => {
    const pluginName = "EnemyStateOutline";
    const parameters = PluginManager.parameters(pluginName);
    
    const franticStateId = Number(parameters['FranticStateId'] || 10);
    const heroicStateId = Number(parameters['HeroicStateId'] || 11);
    const hopelessStateId = Number(parameters['HopelessStateId'] || 12);
    const outlineThickness = Number(parameters['OutlineThickness'] || 2);

    // Custom WebGL Filter for the Outline
    class OutlineFilter extends PIXI.Filter {
        constructor() {
            const vertexSrc = `
                attribute vec2 aVertexPosition;
                attribute vec2 aTextureCoord;
                uniform mat3 projectionMatrix;
                varying vec2 vTextureCoord;
                void main(void) {
                    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                    vTextureCoord = aTextureCoord;
                }
            `;
            const fragmentSrc = `
                varying vec2 vTextureCoord;
                uniform sampler2D uSampler;
                uniform vec4 outlineColor;
                uniform vec2 thickness;

                void main(void) {
                    vec4 currentColor = texture2D(uSampler, vTextureCoord);
                    
                    // If pixel is visible, render it normally
                    if (currentColor.a > 0.1) {
                        gl_FragColor = currentColor;
                    } else {
                        // Check neighbors for alpha
                        float a = 0.0;
                        a += texture2D(uSampler, vTextureCoord + vec2(thickness.x, 0.0)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(-thickness.x, 0.0)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(0.0, thickness.y)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(0.0, -thickness.y)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(thickness.x, thickness.y)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(-thickness.x, -thickness.y)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(thickness.x, -thickness.y)).a;
                        a += texture2D(uSampler, vTextureCoord + vec2(-thickness.x, thickness.y)).a;

                        if (a > 0.1) {
                            gl_FragColor = outlineColor;
                        } else {
                            gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                        }
                    }
                }
            `;
            super(vertexSrc, fragmentSrc);
            this.uniforms.thickness = [0.0, 0.0];
            this.uniforms.outlineColor = [0.0, 0.0, 0.0, 0.0];
            this._outlineEnabled = false;
        }

        setThickness(x, y) {
            this.uniforms.thickness[0] = x;
            this.uniforms.thickness[1] = y;
        }

        setColor(r, g, b, a) {
            this.uniforms.outlineColor[0] = r * a;
            this.uniforms.outlineColor[1] = g * a;
            this.uniforms.outlineColor[2] = b * a;
            this.uniforms.outlineColor[3] = a;
            this._outlineEnabled = a > 0.0;
        }
        
        get enabled() {
            return this._outlineEnabled;
        }
        
        set enabled(value) {
            this._outlineEnabled = value;
        }
    }

    // Hooking into Sprite_Enemy
    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this._stateOutlineFilter = new OutlineFilter();
        
        // Add filter to the sprite's filter list
        if (!this.filters) {
            this.filters = [];
        }
        this.filters.push(this._stateOutlineFilter);
        this._stateOutlineFilter.padding = outlineThickness * 2;
    };

    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        this.updateStateOutline();
    };

    Sprite_Enemy.prototype.updateStateOutline = function() {
        if (!this._enemy || !this.bitmap || !this.bitmap.isReady()) return;

        // Pass texture resolution to the shader for pixel perfect thickness calculations
        this._stateOutlineFilter.setThickness(
            outlineThickness / this.bitmap.width, 
            outlineThickness / this.bitmap.height
        );

        const states = this._enemy.states();
        let color = null; // [R, G, B, Alpha]

        // Prioritize which state to show if multiple are active
        if (states.some(s => s.id === franticStateId)) {
            color = [1.0, 0.0, 0.0, 1.0]; // Red
        } else if (states.some(s => s.id === heroicStateId)) {
            color = [1.0, 1.0, 0.0, 1.0]; // Yellow
        } else if (states.some(s => s.id === hopelessStateId)) {
            color = [0.0, 0.5, 1.0, 1.0]; // Blue
        }

        if (color) {
            this._stateOutlineFilter.setColor(color[0], color[1], color[2], color[3]);
        } else {
            // Neutral, disable outline
            this._stateOutlineFilter.setColor(0, 0, 0, 0); 
        }
    };
})();