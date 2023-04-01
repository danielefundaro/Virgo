import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/custom-table/abstract-table.component';
import { IColumn, Page, Searcher, TypeEnum, Wallet } from '../../models';
import { WalletsService } from '../../services';

@Component({
    selector: 'wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss']
})
export class WalletComponent extends AbstractTableComponent<Wallet> {

    public iDisplayedColumns!: IColumn[];
    public typeEnum = TypeEnum;

    constructor(private walletsService: WalletsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private router: Router, settingsService: SettingsService,
        dialog: MatDialog) {
        super(settingsService, dialog);

        this.iDisplayedColumns = [{
            name: "name",
            title: this.translate.instant("WALLET.NAME")
        }, {
            name: "type",
            title: this.translate.instant("WALLET.TYPE")
        }, {
            name: "website",
            title: this.translate.instant("WALLET.WEBSITE")
        }, {
            name: "username",
            title: this.translate.instant("WALLET.USERNAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("WALLET.WORKSPACE")
        }];
    }

    public search(s: Searcher): Observable<Page<Wallet>> {
        return this.walletsService.search(s);
    }

    public update(data: Wallet): Observable<Wallet> {
        return this.walletsService.update(data, data.type);
    }

    public updateMassiveMessage(): string {
        return this.translate.instant("WALLET.UPDATE.MASSIVE.MESSAGE");
    }

    public updateSuccess(): void {
        this.snackBarService.success(this.translate.instant("WALLET.UPDATE.SUCCESS"));
    }

    public updateSuccessMassive(): void {
        this.snackBarService.success(this.translate.instant("WALLET.UPDATE.MASSIVE.SUCCESS"));
    }

    public updateError(error: any): void {
        this.snackBarService.error(this.translate.instant("WALLET.UPDATE.ERROR"), error);
    }

    public updateErrorMassive(error: any): void {
        this.snackBarService.error(this.translate.instant("WALLET.UPDATE.MASSIVE.ERROR"), error);
    }

    public delete(data: Wallet): Observable<Wallet> {
        return this.walletsService.delete(data.id, data.type);
    }

    public deleteMessage(): string {
        return this.translate.instant("WALLET.DELETE.MESSAGE");
    }

    public deleteMassiveMessage(): string {
        return this.translate.instant("WALLET.DELETE.MASSIVE.MESSAGE");
    }

    public deleteSuccess(): void {
        this.snackBarService.success(this.translate.instant("WALLET.DELETE.SUCCESS"));
    }

    public deleteSuccessMassive(): void {
        this.snackBarService.success(this.translate.instant("WALLET.DELETE.MASSIVE.SUCCESS"));
    }

    public deleteError(error: any): void {
        this.snackBarService.error(this.translate.instant("WALLET.DELETE.ERROR"), error);
    }

    public deleteErrorMassive(error: any): void {
        this.snackBarService.error(this.translate.instant("WALLET.DELETE.MASSIVE.ERROR"), error);
    }

    public addElement(): void {
        this.router.navigate(['wallet', 'add', 'type', 'undefined']);
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
