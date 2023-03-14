import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, map, merge, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { IColumn, Note, Searcher } from '../../models';
import { NotesService } from '../../services';

@Component({
    selector: 'notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(CustomTableComponent) customTable!: CustomTableComponent;

    public dataSource!: Note[];
    public columnsDisplay!: IColumn[];

    private subscription!: Subscription;
    private sortSubject: Subject<string> = new Subject<string>();

    constructor(private notesService: NotesService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingService: SettingsService) {
        this.dataSource = [];
        this.settingService.isLoading = true;
    }

    ngOnInit(): void {
        this.columnsDisplay = [{
            name: "name",
            title: this.translate.instant("NOTES.NAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("NOTES.WORKSPACE")
        }];
    }

    ngAfterViewInit(): void {
        this.subscription = merge(this.customTable.paginator.page, this.sortSubject).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.customTable.paginator.pageIndex, this.customTable.paginator.pageSize, [this.customTable.sort]);
                return this.notesService.search(s).pipe(catchError(() => of(null)));
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

    public onSortChange(field: string): void {
        this.sortSubject.next(field);
    }
}
