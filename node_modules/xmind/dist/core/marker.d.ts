import { AbstractMarker } from '../abstracts/marker.abstract';
export declare class Marker extends AbstractMarker {
    constructor();
    private init;
    /**
     * @description Get names by group name
     * @param {String} groupName
     * @return {Array<string>}
     * @static
     */
    static names(groupName: string): any;
    /**
     * @description Get group names
     * @return {Array<string>}
     * @static
     */
    static groups(): string[];
}
