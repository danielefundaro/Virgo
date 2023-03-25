import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/custom-table/abstract-table.component';
import { IColumn, Page, Searcher, Wallet, Workspace } from '../../models';
import { WalletsService } from '../../services';

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent extends AbstractTableComponent<Wallet> {

    public iDisplayedColumns!: IColumn[];

    constructor(private walletsService: WalletsService, private translate: TranslateService,
        private snackBarService: SnackBarService, settingsService: SettingsService, dialog: MatDialog) {
        super(settingsService, dialog);

        this.iDisplayedColumns = [{
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

    public update(data: Wallet): Observable<Wallet> {
        return of(new Wallet());
    }

    public displayedColumns(): string[] {
        return ["name", "website", "username", "workspace.name"];
    }

    public onChangeWorkspace(data: Wallet, workspace: Workspace): void {
        console.log(data, workspace);
    }

    public copyPasswd(data: Wallet): void {
        console.log(data);
    }

    public copyContent(data: Wallet): void {
        console.log(data);
    }

    public edit(data: Wallet): void {
        console.log(data);
    }
}
