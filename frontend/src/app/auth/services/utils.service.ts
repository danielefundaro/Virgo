import { MatDialog } from "@angular/material/dialog";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { SettingsService, SnackBarService } from "src/app/services";
import { MasterPasswordService } from "./master-password.service";
import { CryptographyService } from "./cryptography.service";
import { ConfirmMasterPasswordComponent } from "../components/dialog/confirm-master-password/confirm-master-password.component";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(private masterPasswordService: MasterPasswordService, private cryptographyService: CryptographyService,
        private snackBar: SnackBarService, private translate: TranslateService, private settingsService: SettingsService,
        private dialog: MatDialog) { }

    public checkMasterPassword(password: string, callback: (masterPassword: string) => void): void {
        firstValueFrom(this.masterPasswordService.get()).then(data => {
            this.cryptographyService.hash(password, data.salt).then(result => {
                if (data.hashPasswd === result.hash) {
                    callback(password);
                } else {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.NOT_VALID"));
                }
            }).catch((error: any) => {
                this.snackBar.error(this.translate.instant("MASTER_PASSWORD.HASH.ERROR"));
            });
        }).catch(error => {
            this.snackBar.error(this.translate.instant("MASTER_PASSWORD.GET.ERROR"), error);
        });
    }

    public decryptData(encryptData: string, iv: string, salt: string, callback: (data: string) => void) {
        const dialogRef = this.dialog.open(ConfirmMasterPasswordComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(password => {
            if (password) {
                firstValueFrom(this.masterPasswordService.get()).then(data => {
                    this.cryptographyService.hash(password, data.salt).then(result => {
                        if (data.hashPasswd === result.hash) {
                            this.cryptographyService.decrypt(encryptData, password, iv, salt).then(data => {
                                callback(data);
                            });
                        } else {
                            this.snackBar.error(this.translate.instant("MASTER_PASSWORD.NOT_VALID"));
                        }
                    }).catch((error: any) => {
                        this.snackBar.error(this.translate.instant("MASTER_PASSWORD.HASH.ERROR"));
                    });
                }).catch(error => {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.GET.ERROR"), error);
                });
            }
        });
    }
}