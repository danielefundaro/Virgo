import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError, debounceTime, map, merge, of, startWith, Subject, Subscription, switchMap } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { IColumn, Note, Searcher, Wallet } from '../../models';
import { NotesService, WalletsService } from '../../services';

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(CustomTableComponent) customTable!: CustomTableComponent;

    public dataSource!: Wallet[];
    public columnsDisplay!: IColumn[];

    private subscription!: Subscription;
    private sortSubject: Subject<string> = new Subject<string>();

    constructor(private walletsService: WalletsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingService: SettingsService) {
        this.dataSource = [];
        this.settingService.isLoading = true;
    }

    ngOnInit(): void {
        this.columnsDisplay = [{
            name: "name",
            title: this.translate.instant("WALLETS.NAME")
        }, {
            name: "type",
            title: this.translate.instant("WALLETS.TYPE")
        }, {
            name: "website",
            title: this.translate.instant("WALLETS.WEBSITE")
        }, {
            name: "username",
            title: this.translate.instant("WALLETS.USERNAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("WALLETS.WORKSPACE")
        }];
    }

    ngAfterViewInit(): void {
        this.subscription = merge(this.customTable.paginator.page, this.sortSubject).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.customTable.paginator.pageIndex, this.customTable.paginator.pageSize, [this.customTable.sort]);
                return this.walletsService.search(s).pipe(catchError(() => of(null)));
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
