import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { IColumn } from '../../models';

@Component({
    selector: 'custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit {

    @Input() columnsDisplay!: IColumn[];
    @Input() defaultColumnSort!: string;
    @Output() onSortChange: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    public sort!: string;

    ngOnInit(): void {
        this.sort = 'id';

        if (this.defaultColumnSort) {
            this.sort = this.defaultColumnSort;
        } else {
            if (this.columnsDisplay.length > 0) {
                this.sort = this.columnsDisplay[0].name;
            }
        }
    }

    public order(columnName: string): void {
        if (columnName != undefined && columnName.length > 0) {
            const sign = this.sort.charAt(0);

            if (sign === '+' || sign === '-') {
                this.sort = this.sort.substring(1);
            }

            if (this.sort === columnName) {
                switch (sign) {
                    case '+': this.sort = `-${columnName}`; break;
                    case '-': this.sort = this.defaultColumnSort; break;
                    default: this.sort = `+${columnName}`; break;
                }
            } else {
                this.sort = `+${columnName}`;
            }

            this.onSortChange.emit(this.sort.toLowerCase());
        }
    }
}
