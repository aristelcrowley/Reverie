/*:
 * @target MZ
 * @plugindesc Reverie - Custom Animated Message Text Effects
 * @author Aristel
 * * @help 
 * ============================================================================
 * HOW TO USE
 * ============================================================================
 * Type these escape codes anywhere in your "Show Text" event commands:
 * * --- WOBBLY WAVE FAMILY ---
 * \FX<WW, wave>          \FX<WW, slow wave>         \FX<WW, fast wave>
 * \FX<WW, horz wave>     \FX<WW, slow horz wave>    \FX<WW, fast horz wave>
 * \FX<WW, vert wave>     \FX<WW, slow vert wave>    \FX<WW, fast vert wave>
 * * --- PENDULUM FAMILY ---
 * \FX<PM, swing>         \FX<PM, slow swing>        \FX<PM, fast swing>
 * \FX<PM, wag>           \FX<PM, slow wag>          \FX<PM, fast wag>
 * \FX<PM, jelly>         \FX<PM, slow jelly>        \FX<PM, fast jelly>
 * * --- FRANTIC FAMILY ---
 * \FX<FC, shake>         \FX<FC, soft shake>        \FX<FC, hard shake>
 * \FX<FC, shiver>        \FX<FC, soft shiver>       \FX<FC, hard shiver>
 * \FX<FC, vibe>          \FX<FC, slow vibe>         \FX<FC, hard vibe>
 * * --- RESET ---
 * \RX  : Ends whatever effect is currently active.
 * * ============================================================================
 * EXAMPLE
 * ============================================================================
 * \FX<PM, fast swing> WHYYYY \RX are \FX<FC, soft shake> you\RX looking at\FX<WW, fast wave> MEEEEEEEEE\RX
 */

(() => {
    // ======================================================================
    // 1. ESCAPE CODE PARSER (Binds state to the Text Object)
    // ======================================================================
    const _Window_Base_processEscapeCharacter = Window_Base.prototype.processEscapeCharacter;
    Window_Base.prototype.processEscapeCharacter = function(code, textState) {
        
        if (code.toUpperCase() === 'FX') {
            this.flushTextState(textState); // Print any normal queued text
            
            // Grab the <Category, Subtype> block
            const match = /^<(FC|PM|WW)\s*,\s*(.*?)>/i.exec(textState.text.slice(textState.index));
            if (match) {
                textState.index += match[0].length;
                const catCode = match[1].toUpperCase();
                const subCode = match[2].trim().toLowerCase();
                
                if (catCode === 'FC') textState._reverieCat = 'frantic';
                else if (catCode === 'PM') textState._reverieCat = 'pendulum';
                else if (catCode === 'WW') textState._reverieCat = 'wobble';
                
                textState._reverieSub = subCode;
            }
            
        } else if (code.toUpperCase() === 'RX') {
            this.flushTextState(textState); // Print any normal queued text
            textState._reverieCat = 'none';
            textState._reverieSub = 'none';
            
        } else {
            _Window_Base_processEscapeCharacter.call(this, code, textState);
        }
    };

    // ======================================================================
    // 2. THE RENDER HIJACKER (Intercepts VisuStella's Final Ink Drop)
    // ======================================================================
    const _Window_Base_flushTextState = Window_Base.prototype.flushTextState;
    Window_Base.prototype.flushTextState = function(textState) {
        
        if (textState._reverieCat && textState._reverieCat !== 'none' && textState.drawing !== false) {
            
            const text = textState.buffer;
            if (text !== "") {
                let currentX = textState.x;
                const h = textState.height || this.contents.fontSize + 8;
                const pad = 12; 
                
                for (let i = 0; i < text.length; i++) {
                    const c = text[i];
                    const w = this.textWidth(c);
                    
                    if (c === ' ') {
                        currentX += w;
                        continue;
                    }
                    
                    const bitmap = new Bitmap(w + pad * 2, h + pad * 2);
                    bitmap.fontFace = this.contents.fontFace;
                    bitmap.fontSize = this.contents.fontSize;
                    bitmap.textColor = this.contents.textColor;
                    bitmap.outlineColor = this.contents.outlineColor;
                    bitmap.outlineWidth = this.contents.outlineWidth;
                    
                    bitmap.drawText(c, pad, pad, w, h);
                    
                    const sprite = new Sprite(bitmap);
                    
                    // ALIGNMENT FIX: Reverted to native text coordinates (No more padY/padX offsets)
                    if (textState._reverieCat === 'pendulum') {
                        sprite.anchor.set(0.5, 0.0);
                        sprite.x = currentX + (w / 2);
                        sprite.y = textState.y - pad;
                    } else {
                        sprite.x = currentX - pad;
                        sprite.y = textState.y - pad;
                    }
                    
                    sprite._baseX = sprite.x;
                    sprite._baseY = sprite.y;
                    sprite._cat = textState._reverieCat;
                    sprite._sub = textState._reverieSub;
                    sprite._spatialOffset = currentX * 0.05; 
                    sprite._tick = 0; 
                    
                    if (!this._reverieTextSprites) this._reverieTextSprites = [];
                    this._reverieTextSprites.push(sprite);
                    
                    // ALIGNMENT FIX: Put it back inside the native MZ text container
                    this.addInnerChild(sprite); 
                    
                    currentX += w;
                }
                
                textState.x += this.textWidth(text);
                textState.buffer = "";
            }
        } else {
            _Window_Base_flushTextState.call(this, textState);
        }
    };

    // ======================================================================
    // 3. THE ANIMATION ENGINE
    // ======================================================================
    const _Window_Message_update = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
        _Window_Message_update.call(this);
        
        if (this._reverieTextSprites && this._reverieTextSprites.length > 0) {
            this._reverieTextSprites.forEach((sprite) => {
                sprite._tick++;
                const t = sprite._tick;
                const offset = sprite._spatialOffset; 
                const cat = sprite._cat;
                const sub = sprite._sub;
                
                sprite.scale.set(1, 1);
                sprite.rotation = 0;
                
                // --- WOBBLY WAVE FAMILY ---
                if (cat === 'wobble') {
                    let speed = 0.15; let amp = 4;
                    if (sub.includes('slow')) speed = 0.05;
                    if (sub.includes('fast')) speed = 0.3;
                    
                    if (sub.includes('horz')) {
                        sprite.x = sprite._baseX + Math.sin((t * speed) + offset) * amp;
                        sprite.y = sprite._baseY;
                    } else { 
                        sprite.x = sprite._baseX;
                        sprite.y = sprite._baseY + Math.sin((t * speed) + offset) * amp;
                    }
                } 
                // --- PENDULUM FAMILY ---
                else if (cat === 'pendulum') {
                    let speed = 0.1; let amp = 0.3;
                    if (sub.includes('slow')) speed = 0.05;
                    if (sub.includes('fast')) speed = 0.2;
                    
                    if (sub.includes('wag')) {
                        speed *= 1.5; amp = 0.5;
                        sprite.rotation = Math.sin((t * speed) + offset) * amp;
                    } else if (sub.includes('jelly')) {
                        sprite.scale.x = 1 + Math.sin((t * speed) + offset) * 0.15;
                        sprite.scale.y = 1 - Math.sin((t * speed) + offset) * 0.15;
                        sprite.rotation = Math.sin((t * speed) + offset) * 0.05;
                    } else { 
                        sprite.rotation = Math.sin((t * speed) + offset) * amp;
                    }
                } 
                // --- FRANTIC FAMILY ---
                else if (cat === 'frantic') {
                    let intensity = 2;
                    if (sub.includes('soft') || sub.includes('slow')) intensity = 1;
                    if (sub.includes('hard')) intensity = 4;
                    
                    if (sub.includes('shiver')) {
                        sprite.x = sprite._baseX + (Math.random() * intensity * 2 - intensity);
                        sprite.y = sprite._baseY + (Math.random() * intensity * 2 - intensity);
                    } else if (sub.includes('vibe')) {
                        let speed = 0.8;
                        if (sub.includes('slow')) speed = 0.4;
                        if (sub.includes('hard')) { intensity = 5; speed = 1.0; }
                        
                        sprite.x = sprite._baseX + Math.sin(t * speed) * intensity;
                        sprite.y = sprite._baseY + Math.cos(t * speed) * intensity;
                    } else { 
                        if (t % 2 === 0) {
                            sprite.x = sprite._baseX + (Math.random() * intensity * 2 - intensity);
                            sprite.y = sprite._baseY + (Math.random() * intensity * 2 - intensity);
                        }
                    }
                }
            });
        }
    };

    // ======================================================================
    // 4. ABSOLUTE BULLETPROOF CLEANUP ENGINE
    // ======================================================================
    Window_Base.prototype.clearReverieTextSprites = function() {
        if (this._reverieTextSprites) {
            this._reverieTextSprites.forEach(sprite => {
                // Uses PIXI's native parent check to bypass MZ's broken system
                if (sprite.parent) {
                    sprite.parent.removeChild(sprite);
                }
                if (sprite.bitmap) sprite.bitmap.destroy();
                sprite.destroy();
            });
            this._reverieTextSprites = [];
        }
    };

    // Wipes when the window is completely closed
    const _Window_Message_close = Window_Message.prototype.close;
    Window_Message.prototype.close = function() {
        this.clearReverieTextSprites();
        _Window_Message_close.call(this);
    };

    // Wipes when a brand new message box begins
    const _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        this.clearReverieTextSprites();
        _Window_Message_startMessage.call(this);
    };

    // Wipes when the dialogue naturally terminates
    const _Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
    Window_Message.prototype.terminateMessage = function() {
        this.clearReverieTextSprites();
        _Window_Message_terminateMessage.call(this);
    };

    // Wipes when the engine recognizes a new page (\f)
    const _Window_Message_processNewPage = Window_Message.prototype.processNewPage;
    Window_Message.prototype.processNewPage = function(textState) {
        this.clearReverieTextSprites();
        _Window_Message_processNewPage.call(this, textState);
    };
    
    // Wipes when VisuStella forces a new page without \f
    const _Window_Message_newPage = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
        this.clearReverieTextSprites();
        _Window_Message_newPage.call(this, textState);
    };

})();