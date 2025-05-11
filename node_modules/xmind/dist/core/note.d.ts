import { AbstractNote } from '../abstracts/note.abstract';
/**
 * @description Note class and XMind ZEN is supported
 * @implements AbstractNote
 * @property {*} html
 * @property {*} plain
 * @property {*} ops
 */
export declare class Note implements AbstractNote {
    html: any;
    plain: any;
    ops: any;
    constructor();
    /**
     * @description Format value
     * @param {any} value
     * @setter
     */
    set text(value: any);
    toJSON(): {
        html: any;
        plain: any;
        ops: any;
    };
    toString(): string;
}
