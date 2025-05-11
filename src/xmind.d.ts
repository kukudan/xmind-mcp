declare module 'xmind' {
  export interface Topic {
    getTitle(): string;
    getNotes(): string;
    getChildren(): Topic[];
  }

  export interface Sheet {
    getTitle(): string;
    getRootTopic(): Topic;
  }

  export class Workbook {
    constructor();
    load(filePath: string): void;
    getSheets(): Sheet[];
  }

  export function open(filePath: string): Workbook;
}
