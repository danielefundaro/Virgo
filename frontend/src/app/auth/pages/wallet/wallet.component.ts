import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/abstract-table/abstract-table.component';
import { IColumn, Page, Searcher, Wallet } from '../../models';
import { WalletsService } from '../../services';

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent extends AbstractTableComponent<Wallet> {

    public columnsDisplay!: IColumn[];

    constructor(private walletsService: WalletsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingsService: SettingsService) {
        super(settingsService);

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

    public search(s: Searcher): Observable<Page<Wallet>> {
        return this.walletsService.search(s);
    }

    public DisplayedColumns(): string[] {
        return ["name", "website", "username", "workspace.name"];
    }

    public onSortChange(field: string): void {
        console.log(field);
        super.sortChange(field);
    }

    public copy(data: Credential): void {
        console.log(data);
    }
}
