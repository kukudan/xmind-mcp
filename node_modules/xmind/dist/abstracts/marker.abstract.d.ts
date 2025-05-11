export interface Marker {
    groupId: string;
    markerId: string;
}
/**
 * @description Marker abstract class
 * should to override all the methods
 */
export declare class AbstractMarker {
    /**
     * @description The icon of group `priority`
     * @param {String} name
     * @return {Marker}
     */
    priority(name: string): Marker;
    /**
     * @description The icon of group `smiley`
     * @param {String} name
     * @return {Marker}
     */
    smiley(name: string): Marker;
    /**
     * @description The icon of group `task`
     * @param {String} name
     * @return {Marker}
     */
    task(name: string): Marker;
    /**
     * @description The icon of group `flag`
     * @param {String} name
     * @return {Marker}
     */
    flag(name: string): Marker;
    /**
     * @description The icon of group `star`
     * @param {String} name
     * @return {Marker}
     */
    star(name: string): Marker;
    /**
     * @description The icon of group `people`
     * @param {String} name
     * @return {Marker}
     */
    people(name: string): Marker;
    /**
     * @description The icon of group `arrow`
     * @param {String} name
     * @return {Marker}
     */
    arrow(name: string): Marker;
    /**
     * @description The icon of group `symbol`
     * @param {String} name
     * @return {Marker}
     */
    symbol(name: string): Marker;
    /**
     * @description The icon of group `month`
     * @param {String} name
     * @return {Marker}
     */
    month(name: string): Marker;
    /**
     * @description The icon of group `week`
     * @param {String} name
     * @return {Marker}
     */
    week(name: string): Marker;
    /**
     * @description The icon of group `half`
     * @param {String} name
     * @return {Marker}
     */
    half(name: string): Marker;
    /**
     * @description The icon of group `other`
     * @param {String} name
     * @return {Marker}
     */
    other(name: string): Marker;
}
