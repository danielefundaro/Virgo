import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, start: number = 0, end: number = 20, trail: string = ""): string {
        return value && value.length > end ? value.substring(start, end) + trail : value;
    }
}
