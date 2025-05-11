"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
/**
 * @description Note class and XMind ZEN is supported
 * @implements AbstractNote
 * @property {*} html
 * @property {*} plain
 * @property {*} ops
 */
class Note {
    constructor() {
        this.html = { content: { paragraphs: [] } };
        this.ops = { ops: [] };
        this.plain = {};
    }
    /**
     * @description Format value
     * @param {any} value
     * @setter
     */
    set text(value) {
        this.plain.content = value;
        this.html.content.paragraphs.push({ spans: [{ text: value }] });
        this.ops.ops.push({ insert: value });
    }
    toJSON() {
        return { html: this.html, plain: this.plain, ops: this.ops };
    }
    /* istanbul ignore next */
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.Note = Note;
//# sourceMappingURL=note.js.map