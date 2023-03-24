import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { catchError, debounceTime, map, merge, Observable, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { SettingsService } from 'src/app/services';
import { CommonFields, Page, Searcher } from '../../models';
import { CustomTableComponent } from './custom-table.component';

@Component({ template: "" })
export abstract class AbstractTableComponent<T extends CommonFields> implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(CustomTableComponent) customTable!: CustomTableComponent;

    protected defaultColumnSort: string = 'name';
    protected dataSource!: any[];
    protected displayedColumns!: string[];

    private sort!: string;
    private subscription!: Subscription;
    private sortSubject: Subject<string> = new Subject<string>();

    constructor(private settingService: SettingsService) {
        this.dataSource = [];
        this.settingService.isLoading = true;
    }

    public abstract search(s: Searcher): Observable<Page<T>>;
    public abstract DisplayedColumns(): string[];

    ngOnInit(): void {
        this.sort = 'id';

        this.displayedColumns = this.DisplayedColumns();

        if (this.defaultColumnSort) {
            this.sort = this.defaultColumnSort;
        } else {
            if (this.displayedColumns.length > 0) {
                this.sort = this.displayedColumns[0];
            }
        }
    }

    ngAfterViewInit(): void {
        this.subscription = merge(this.customTable.paginator.page, this.sortSubject).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.customTable.paginator.pageIndex, this.customTable.paginator.pageSize, [this.sort]);
                return this.search(s).pipe(catchError(() => of(null)));
            }),
            map(data => {
                if (data === null) {
                    return [];
                }

                this.customTable.paginator.length = data.totalElements;
                return data.content;
            })
        ).subscribe(data => {
            this.dataSource = data;
            this.settingService.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    protected sortChange(columnName: string): void {
        this.sort = columnName;
        this.sortSubject.next(columnName);
    }
}