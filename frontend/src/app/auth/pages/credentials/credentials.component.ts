import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, map, merge, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { Credential, Searcher } from '../../models';
import { CredentialsService } from '../../services';

@Component({
    selector: 'credentials',
    templateUrl: './credentials.component.html',
    styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent implements AfterViewInit, OnDestroy {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    public dataSource!: any[];
    public sort: string;
    public columnDisplay = ["name", "website", "username", "workspace.name"];

    private subscription!: Subscription;
    private defaultColumnSort = "name";
    private sortSubject: Subject<string> = new Subject<string>();

    constructor(private credentialsService: CredentialsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingService: SettingsService) {
        this.dataSource = [];
        this.settingService.isLoading = true;
        this.sort = this.defaultColumnSort;
    }

    ngAfterViewInit(): void {
        this.subscription = merge(this.paginator.page, this.sortSubject).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.paginator.pageIndex, this.paginator.pageSize, [this.sort]);
                return this.credentialsService.search(s).pipe(catchError(() => of(null)));
            }),
            map(data => {
                if (data === null) {
                    return [];
                }

                this.paginator.length = data.totalElements;
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

            this.sortSubject.next(this.sort.toLowerCase());
        }
    }
}
