/*:
 * @target MZ
 * @plugindesc Ganti background window tertentu dengan warna hitam solid dan border putih (style Undertale). Pilihan (choice) pakai ikon tangan di dalam box, teks rata kanan.
 * @author Safmica
 *
 * @help CustomMessageBackground.js
 *
 * Window yang diubah: Message, ChoiceList, NumberInput, NameBox.
 */

(() => {
    const included = [
        "Window_Message",
        "Window_ChoiceList",
        "Window_NumberInput",
        "Window_NameBox"
    ];

    function isIncludedWindow(win) {
        const name = win.constructor && win.constructor.name;
        return included.includes(name);
    }

    const _refreshBack_Base = Window_Base.prototype._refreshBack;
    Window_Base.prototype._refreshBack = function() {
        if (isIncludedWindow(this)) {
            if (this._customBgSprite) this.removeChild(this._customBgSprite);
            const w = this.width;
            const h = this.height;
            const border = 4;
            const sprite = new Sprite(new Bitmap(w, h));
            const ctx = sprite.bitmap.context;

            ctx.fillStyle = "#000";
            ctx.fillRect(border, border, w - border * 2, h - border * 2);

            ctx.lineWidth = border;
            ctx.strokeStyle = "#fff";
            ctx.strokeRect(border / 2, border / 2, w - border, h - border);
            sprite.bitmap._baseTexture.update();
            this._customBgSprite = sprite;
            this.addChildAt(sprite, 0);
        } else {
            _refreshBack_Base.call(this);
        }
    };

    const _refreshFrame_Base = Window_Base.prototype._refreshFrame;
    Window_Base.prototype._refreshFrame = function() {
        if (isIncludedWindow(this)) {

        } else {
            _refreshFrame_Base.call(this);
        }
    };

    const _Window_ChoiceList_start = Window_ChoiceList.prototype.start;
    Window_ChoiceList.prototype.start = function() {
        _Window_ChoiceList_start.call(this);
        if (!this._choiceCursorSprite) {
            this._choiceCursorSprite = new Sprite(ImageManager.loadSystem("FingerCursor"));
            this._choiceCursorSprite.anchor.x = 0;
            this._choiceCursorSprite.anchor.y = 0;

            this._choiceCursorSprite.scale.x = 2.5;
            this._choiceCursorSprite.scale.y = 2.5;
            this.addChild(this._choiceCursorSprite);
        }
        this._choiceCursorSprite.visible = false;
    };

    const _Window_ChoiceList_update = Window_ChoiceList.prototype.update;
    Window_ChoiceList.prototype.update = function() {
        _Window_ChoiceList_update.call(this);
        if (this._choiceCursorSprite && this.active && this.isOpen()) {
            const idx = this.index();
            if (idx >= 0) {
                const rect = this.itemRect(idx);
                this._choiceCursorSprite.x = rect.x + 8;
                this._choiceCursorSprite.y = rect.y + rect.height / 2;
                this._choiceCursorSprite.visible = true;
            } else {
                this._choiceCursorSprite.visible = false;
            }
        } else if (this._choiceCursorSprite) {
            this._choiceCursorSprite.visible = false;
        }
    };

    Window_ChoiceList.prototype.itemTextAlign = function() {
        return "right";
    };

    Window_ChoiceList.prototype.drawItemBackground = function(index) {

    };

    Window_ChoiceList.prototype.refreshCursor = function() {
        this.setCursorRect(0, 0, 0, 0);
    };

    Window_ChoiceList.prototype.drawItem = function(index) {
        const rect = this.itemLineRect(index);
        this.resetTextColor();
        this.changePaintOpacity(this.isCommandEnabled(index));
        const padding = 8 + (this._choiceCursorSprite ? this._choiceCursorSprite.width * 1.5 : 36) + 4;
        this.drawText(this.commandName(index), rect.x + padding, rect.y, rect.width - padding, "right");
    };
})();