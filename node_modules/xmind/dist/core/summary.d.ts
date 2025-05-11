import { AbstractSummary, RangeOptions } from '../abstracts/summary.abstract';
import Base from './base';
export declare class Summary extends Base implements AbstractSummary {
    private _range;
    topicId: string;
    constructor();
    range(options: RangeOptions): this;
    toJSON(): {
        id: string;
        range: string;
        topicId: string;
    };
}
