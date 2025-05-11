"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summary = void 0;
const base_1 = require("./base");
class Summary extends base_1.default {
    constructor() {
        super({ debug: 'xmind-sdk:summary' });
    }
    range(options) {
        const children = options.children;
        const condition = options.condition;
        if (condition[0] === condition[1]) {
            for (let i = 0, len = children.length; i < len; i++) {
                if (children[i].getId() === condition[0]) {
                    this._range = `(${i},${i})`;
                }
            }
        }
        else {
            let s, e = 0;
            for (let i = 0, len = children.length; i < len; i++) {
                if (children[i].getId() === condition[0]) {
                    s = i;
                }
                if (children[i].getId() === condition[1]) {
                    e = i;
                }
            }
            this._range = s > e ? `(${s},${s})` : `(${s},${e})`;
        }
        return this;
    }
    toJSON() {
        return { id: this.id, range: this._range, topicId: this.topicId };
    }
}
exports.Summary = Summary;
//# sourceMappingURL=summary.js.map