/*:
 * @target MZ
 * @plugindesc Reverie - retries image loads with case-safe filename variants for web deploys.
 * @author Codex
 *
 * @help
 * Web servers are case-sensitive. This plugin protects RPG Maker image
 * loads from casing drift such as ann_1 vs Ann_1, or sf_actor1 vs SF_Actor1.
 */

(() => {
	"use strict";

	function unique(values) {
		const result = [];
		for (const value of values) {
			if (value && !result.includes(value)) {
				result.push(value);
			}
		}
		return result;
	}

	function smartCaseToken(token) {
		if (/^sf$/i.test(token)) {
			return "SF";
		}
		if (/^ch\d+$/i.test(token)) {
			return token.toUpperCase();
		}
		if (/^[a-z]\d+$/i.test(token)) {
			return token.toUpperCase();
		}
		return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
	}

	function smartCasePart(part) {
		return part
			.split(/([_\-\s])/)
			.map(piece => (/^[_\-\s]$/.test(piece) ? piece : smartCaseToken(piece)))
			.join("");
	}

	function smartCasePath(filename) {
		return String(filename)
			.split("/")
			.map(part => part.split("\\").map(smartCasePart).join("\\"))
			.join("/");
	}

	function imageUrl(folder, filename) {
		return folder + Utils.encodeURI(filename) + ".png";
	}

	function caseSafeImageUrls(folder, filename) {
		const original = String(filename);
		const lower = original.toLowerCase();
		const upper = original.toUpperCase();
		const smartOriginal = smartCasePath(original);
		const smartLower = smartCasePath(lower);

		return unique([
			original,
			lower,
			smartOriginal,
			smartLower,
			upper
		]).map(candidate => imageUrl(folder, candidate));
	}

	const _ImageManager_loadBitmap = ImageManager.loadBitmap;
	ImageManager.loadBitmap = function(folder, filename) {
		const bitmap = _ImageManager_loadBitmap.call(this, folder, filename);
		if (filename && String(folder).startsWith("img/")) {
			bitmap._caseSafeImageUrls = caseSafeImageUrls(folder, filename);
			bitmap._caseSafeImageIndex = 0;
		}
		return bitmap;
	};

	const _Bitmap_onError = Bitmap.prototype._onError;
	Bitmap.prototype._onError = function() {
		if (this._caseSafeImageUrls) {
			this._caseSafeImageIndex++;
			const nextUrl = this._caseSafeImageUrls[this._caseSafeImageIndex];
			if (nextUrl) {
				this._url = nextUrl;
				this._startLoading();
				return;
			}
		}
		_Bitmap_onError.call(this);
	};
})();
