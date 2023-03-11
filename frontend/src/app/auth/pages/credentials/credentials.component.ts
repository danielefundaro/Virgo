import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, fromEvent, map, merge, of, startWith, Subscription, switchMap } from 'rxjs';
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

    public dataSource!: Credential[];

    private subscription!: Subscription;

    constructor(private credentialsService: CredentialsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingService: SettingsService) {
        this.dataSource = [];
        this.settingService.isLoading = true;
    }

    ngAfterViewInit(): void {
        this.subscription = merge(this.paginator.page).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.paginator.pageIndex, this.paginator.pageSize, []);
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
}
