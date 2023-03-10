export class Searcher {
    value: string;
    pageNumber: number;
    pageSize: number;
    sort: Array<string>;

    constructor(value?: string, index?: number, size?: number, sort?: Array<string>) {
        this.value = value == undefined ? "" : value;
        this.pageNumber = index == undefined ? 0 : index;
        this.pageSize = size == undefined ? 10 : size;
        this.sort = sort == undefined ? [] : sort;
    }
}