//=============================================================================
// BattleCommandImage.js
//=============================================================================
// Plugin untuk mengganti tampilan tombol command battle dengan gambar sprite sheet
// Letakkan di folder js/plugins/ dan aktifkan di Plugin Manager
//
// Gambar: img/system/BattleCommand.png (enable), img/system/BattleCommandDisable.png (disable)
// Ukuran: 2 kolom x 3 baris, masing-masing 178x55 px
//=============================================================================
(function() {
    const btnW = 178;
    const btnH = 55;
    const cols = 2;

    const _drawItem = Window_ActorCommand.prototype.drawItem;
    function ensureBattleCommandImagesReady(callback) {
        const img1 = ImageManager.loadSystem('BattleCommand');
        const img2 = ImageManager.loadSystem('BattleCommandDisable');
        if (img1.isReady() && img2.isReady()) {
            callback();
        } else {
            let called = false;
            const tryCallback = () => {
                if (!called && img1.isReady() && img2.isReady()) {
                    called = true;
                    callback();
                }
            };
            img1.addLoadListener(tryCallback);
            img2.addLoadListener(tryCallback);
        }
    }

    const _maxItems = Window_ActorCommand.prototype.maxItems;
    Window_ActorCommand.prototype.maxItems = function() {
        if (!this._list) return 0;
        return _maxItems ? _maxItems.call(this) : this._list.length;
    };

    const _refresh = Window_ActorCommand.prototype.refresh;
    Window_ActorCommand.prototype.refresh = function() {
        ensureBattleCommandImagesReady(() => _refresh.call(this));
    };

    Window_ActorCommand.prototype.drawItem = function(index) {
        if (!this._list || !Array.isArray(this._list) || !this._list[index]) return;
        const rect = this.itemLineRect(index);
        const col = index % cols;
        const row = Math.floor(index / cols);
        const sx = col * btnW;
        const sy = row * btnH;

        let enabled = this.isCommandEnabled(index);
        let isSelected = (this.index() === index);
        let bitmap = enabled ? ImageManager.loadSystem('BattleCommand') : ImageManager.loadSystem('BattleCommandDisable');

        if (!bitmap || !bitmap.isReady()) return;

        this.contents.blt(bitmap, sx, sy, btnW, btnH, rect.x, rect.y, rect.width, rect.height);

        const cursorBmp = ImageManager.loadSystem('FingerCursor');
        const cursorMargin = 12;
        const scale = 1.5; 
        if (isSelected && cursorBmp && cursorBmp.isReady()) {
            const frame = SceneManager._frameCount || 0;
            const anim = Math.sin(frame / 8) * 6;
            const drawW = cursorBmp.width * scale;
            const drawH = cursorBmp.height * scale;
            const cursorY = rect.y + (rect.height - drawH) / 2;
            const cursorX = rect.x + cursorMargin + anim;
            this.contents.blt(cursorBmp, 0, 0, cursorBmp.width, cursorBmp.height, cursorX, cursorY, drawW, drawH);
        } else if (isSelected && cursorBmp) {
            cursorBmp.addLoadListener(() => this.redrawItem(index));
        }
    };

    const _update = Window_ActorCommand.prototype.update;
    Window_ActorCommand.prototype.update = function() {
        _update.call(this);
        if (this.active && this.visible && this.openness > 0 && typeof this.index === 'function') {
            const idx = this.index();
            if (idx >= 0 && idx < (this._list ? this._list.length : 0)) {
                this.redrawItem(idx);
            }
        }
    };
})();
