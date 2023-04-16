import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, firstValueFrom } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/custom-table/abstract-table.component';
import { Credential, IColumn, Page, Searcher } from '../../models';
import { CredentialsService, CryptographyService } from '../../services';
import { ConfirmMasterPasswordComponent } from '../../components/dialog/confirm-master-password/confirm-master-password.component';

@Component({
    selector: 'credentials',
    templateUrl: './credentials.component.html',
    styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent extends AbstractTableComponent<Credential> {

    public iDisplayedColumns!: IColumn[];

    constructor(private credentialsService: CredentialsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private router: Router, private clipboard: Clipboard,
        private cryptographyService: CryptographyService, settingsService: SettingsService, dialog: MatDialog) {
        super(settingsService, dialog);

        this.iDisplayedColumns = [{
            name: "name",
            title: this.translate.instant("CREDENTIAL.NAME")
        }, {
            name: "website",
            title: this.translate.instant("CREDENTIAL.WEBSITE")
        }, {
            name: "username",
            title: this.translate.instant("CREDENTIAL.USERNAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("CREDENTIAL.WORKSPACE")
        }];
    }

    public search(s: Searcher): Observable<Page<Credential>> {
        return this.credentialsService.search(s);
    }

    public override getError(error: any): void {
        this.snackBarService.error("", error);
    }

    public update(data: Credential): Observable<Credential> {
        return this.credentialsService.update(data);
    }

    public updateMassiveMessage(): string {
        return this.translate.instant("CREDENTIAL.UPDATE.MASSIVE.MESSAGE");
    }

    public updateSuccess(): void {
        this.snackBarService.success(this.translate.instant("CREDENTIAL.UPDATE.SUCCESS"));
    }

    public updateSuccessMassive(): void {
        this.snackBarService.success(this.translate.instant("CREDENTIAL.UPDATE.MASSIVE.SUCCESS"));
    }

    public updateError(error: any): void {
        this.snackBarService.error(this.translate.instant("CREDENTIAL.UPDATE.ERROR"), error);
    }

    public updateErrorMassive(error: any): void {
        this.snackBarService.error(this.translate.instant("CREDENTIAL.UPDATE.MASSIVE.ERROR"), error);
    }

    public delete(data: Credential): Observable<Credential> {
        return this.credentialsService.delete(data.id);
    }

    public deleteMessage(): string {
        return this.translate.instant("CREDENTIAL.DELETE.MESSAGE");
    }

    public deleteMassiveMessage(): string {
        return this.translate.instant("CREDENTIAL.DELETE.MASSIVE.MESSAGE");
    }

    public deleteSuccess(): void {
        this.snackBarService.success(this.translate.instant("CREDENTIAL.DELETE.SUCCESS"));
    }

    public deleteSuccessMassive(): void {
        this.snackBarService.success(this.translate.instant("CREDENTIAL.DELETE.MASSIVE.SUCCESS"));
    }

    public deleteError(error: any): void {
        this.snackBarService.error(this.translate.instant("CREDENTIAL.DELETE.ERROR"), error);
    }

    public deleteErrorMassive(error: any): void {
        this.snackBarService.error(this.translate.instant("CREDENTIAL.DELETE.MASSIVE.ERROR"), error);
    }

    public addElement(): void {
        this.router.navigate(['credentials', 'add']);
    }

    public copyField(field: string) {
        this.snackBarService.info(this.translate.instant(`CREDENTIAL.COPY.${field.toUpperCase()}`));
    }

    public copy(data: Credential): void {
        const dialogRef = this.dialog.open(ConfirmMasterPasswordComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.settingsService.isLoading = true;
                this.cryptographyService.decrypt(data.passwd, result, data.iv, data.salt).then(passwd => {
                    this.clipboard.copy(passwd);
                    this.settingsService.isLoading = false;
                });
            }
        });
    }
}
