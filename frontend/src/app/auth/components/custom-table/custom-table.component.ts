import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { IColumn } from '../../models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'custom-table',
    templateUrl: './custom-table.component.html',
    styleUrls: ['./custom-table.component.scss']
})
export class CustomTableComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

    @Input() title!: string;
    @Input() displayedColumns!: IColumn[];
    @Input() checked: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() itemSelected!: number;
    @Output() addElement: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCheckAll: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() onSortChange: EventEmitter<string> = new EventEmitter<string>();
    @Output() moveEvent: EventEmitter<void> = new EventEmitter();
    @Output() deleteEvent: EventEmitter<void> = new EventEmitter();
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    public sort!: string;
    public closeMassive: boolean = false;

    private defaultColumnSort: string = 'id';
    private subscription!: Subscription;

    ngOnInit(): void {
        this.sort = this.defaultColumnSort;
    }

    ngAfterViewInit(): void {
        this.subscription = this.paginator.page.subscribe(() => this.resetCheckAll());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['checked'] || changes['indeterminate'] || changes['itemSelected']) {
            this.closeMassive = false;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public add(): void {
        this.addElement.emit();
    }

    public onCheck(event: MatCheckboxChange) {
        this.onCheckAll.emit(event.checked);
    }

    public order(columnName: string): void {
        this.resetCheckAll();

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

    public onMoveEvent(): void {
        this.moveEvent.emit();
    }

    public onDeleteEvent(): void {
        this.deleteEvent.emit();
    }

    public onCloseEvent(): void {
        this.closeMassive = true;
    }

    private resetCheckAll() {
        const event = new MatCheckboxChange();
        event.checked = false;
        this.onCheck(event);
    }
}