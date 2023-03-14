import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, fromEvent, map, merge, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { Credential, IColumn, Searcher } from '../../models';
import { CredentialsService } from '../../services';

@Component({
    selector: 'credentials',
    templateUrl: './credentials.component.html',
    styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(CustomTableComponent) customTable!: CustomTableComponent;

    public dataSource!: Credential[];
    public columnsDisplay!: IColumn[];
    public defaultColumnSort = "name";

    private subscription!: Subscription;
    private sortSubject: Subject<string> = new Subject<string>();
    private sort: string;

    constructor(private credentialsService: CredentialsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingService: SettingsService) {
        this.dataSource = [];
        this.settingService.isLoading = true;
        this.sort = this.defaultColumnSort;
    }

    ngOnInit(): void {
        this.columnsDisplay = [{
            name: "name",
            title: this.translate.instant("CREDENTIALS.NAME")
        }, {
            name: "website",
            title: this.translate.instant("CREDENTIALS.WEBSITE")
        }, {
            name: "username",
            title: this.translate.instant("CREDENTIALS.USERNAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("CREDENTIALS.WORKSPACE")
        }];
    }

    ngAfterViewInit(): void {
        this.subscription = merge(this.customTable.paginator.page, this.sortSubject).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.customTable.paginator.pageIndex, this.customTable.paginator.pageSize, [this.sort]);
                return this.credentialsService.search(s).pipe(catchError(() => of(null)));
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
        this.sort = field;
        this.sortSubject.next(this.sort);
    }
}
