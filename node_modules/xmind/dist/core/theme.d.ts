import * as Model from '../common/model';
interface ThemeOptions {
    themeName: string;
}
/**
 * @description Invisible external
 */
export declare class Theme {
    private readonly value;
    constructor(options?: ThemeOptions);
    get data(): Model.Theme;
    private loader;
}
export {};
