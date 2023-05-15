import { MatDialog } from "@angular/material/dialog";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { firstValueFrom } from "rxjs";
import { SettingsService, SnackBarService, UserService } from "src/app/services";
import { MasterPasswordService } from "./master-password.service";
import { CryptographyService } from "./cryptography.service";
import { ConfirmMasterPasswordComponent } from "../components/dialog/confirm-master-password/confirm-master-password.component";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor(private userService: UserService, private masterPasswordService: MasterPasswordService,
        private cryptographyService: CryptographyService, private snackBar: SnackBarService,
        private translate: TranslateService, private router: Router, private settingsService: SettingsService,
        private dialog: MatDialog) { }

    public checkMasterPassword(password: string, callback: (masterPassword: string) => void): void {
        firstValueFrom(this.masterPasswordService.get()).then(data => {
            this.cryptographyService.hash(password, data.salt).then(result => {
                if (data.hashPasswd === result.hash) {
                    callback(password);
                } else {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.NOT_VALID"));
                }
            }).catch(() => {
                this.snackBar.error(this.translate.instant("MASTER_PASSWORD.HASH.ERROR"));
            });
        }).catch(error => {
            this.snackBar.error(this.translate.instant("MASTER_PASSWORD.GET.ERROR"), error);
        });
    }

    public confirmMasterPassword(callback: (masterPassword: string) => void) {
        const startTime = this.settingsService.repromptStartDate.getTime();

        if (startTime + this.settingsService.repromptMill < new Date().getTime()) {
            const dialogRef = this.dialog.open(ConfirmMasterPasswordComponent, {
                disableClose: true
            });

            firstValueFrom(dialogRef.afterClosed()).then(masterPassword => {
                if (masterPassword) {
                    callback(masterPassword);
                }
            });
        } else {
            callback(this.settingsService.masterPassword);
        }
    }

    public decryptData(encryptData: string, iv: string, salt: string, callback: (data: string) => void) {
        this.confirmMasterPassword((masterPassword: string) => {
            firstValueFrom(this.masterPasswordService.get()).then(data => {
                this.cryptographyService.hash(masterPassword, data.salt).then(result => {
                    if (data.hashPasswd === result.hash) {
                        this.cryptographyService.decrypt(encryptData, masterPassword, iv, salt).then(data => {
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
        });
    }

    public logout(): void {
        firstValueFrom(this.userService.logout()).finally(() => {
            this.userService.clearAuthToken();
            this.router.navigate(['login']);
        });
    }
}