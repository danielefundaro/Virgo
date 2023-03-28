import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { IColumn } from '../../models';

@Component({
    selector: 'custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit {

    @Input() title!: string;
    @Input() displayedColumns!: IColumn[];
    @Input() defaultColumnSort!: string;
    @Input() checked: boolean = false;
    @Input() indeterminate: boolean = false;
    @Output() addElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCheckAll: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onSortChange: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    public sort!: string;

    ngOnInit(): void {
        this.sort = 'name';

        if (this.defaultColumnSort) {
            this.sort = this.defaultColumnSort;
        } else {
            if (this.displayedColumns.length > 0) {
                this.sort = this.displayedColumns[0].name;
            }
        }
    }

    public add(): void {
        this.addElement.emit();
    }

    public onCheck(event: MatCheckboxChange) {
        this.onCheckAll.emit(event.checked);
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