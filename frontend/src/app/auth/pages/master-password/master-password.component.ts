import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { Subscription, firstValueFrom } from 'rxjs';
import { SettingsService, SnackBarService, UserService } from 'src/app/services';
import { MasterPassword, MasterPasswordEnum, MasterPasswordUpdate, TypeEnum, Wallet, WalletBasic } from '../../models';
import { CryptographyService, MasterPasswordService, UtilsService, WalletsService } from '../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'master-password',
    templateUrl: './master-password.component.html',
    styleUrls: ['./master-password.component.scss']
})
export class MasterPasswordComponent implements OnInit, OnDestroy {
    public get oldPassword() { return this.formGroup.get('oldPassword'); }
    public get password() { return this.formGroup.get('password'); }
    public get confirmPassword() { return this.formGroup.get('confirmPassword'); }

    public user?: KeycloakProfile;
    public formGroup: FormGroup;
    public oldPasswordViewToggle: boolean;
    public passwordViewToggle: boolean;
    public fragment: string | null = MasterPasswordEnum.LOCK;
    public masterPasswordEnum = MasterPasswordEnum;

    private fragmentSubscription?: Subscription;

    constructor(private userService: UserService, private route: ActivatedRoute, private router: Router,
        private masterPasswordService: MasterPasswordService, private snackBar: SnackBarService,
        private translate: TranslateService, private cryptographyService: CryptographyService,
        private settingsService: SettingsService, private utilsService: UtilsService,
        private walletsService: WalletsService) {
        this.oldPasswordViewToggle = false;
        this.passwordViewToggle = false;

        this.formGroup = new FormGroup({
            oldPassword: new FormControl(undefined, [Validators.required]),
            password: new FormControl(undefined, [Validators.required]),
            confirmPassword: new FormControl(undefined, [Validators.required]),
        });

        this.userService.loadUserProfile().then(data => this.user = data);
    }

    ngOnInit(): void {
        this.lockFunction();

        this.fragmentSubscription = this.route.fragment.subscribe(fragment => {
            if (fragment) {
                this.fragment = fragment;

                switch (fragment) {
                    case MasterPasswordEnum.FIRST_INSERT:
                        this.oldPassword?.setValidators(null);
                        this.oldPassword?.setErrors(null);
                        this.password?.setValidators(Validators.required);
                        this.confirmPassword?.setValidators(Validators.required);
                        this.formGroup.addValidators(this.passwordMatchValidator(this.password, this.confirmPassword));
                        break;
                    case MasterPasswordEnum.LOCK:
                        this.lockFunction();
                        break;
                    case MasterPasswordEnum.CHANGE:
                        this.oldPassword?.setValidators(Validators.required);
                        this.password?.setValidators(Validators.required);
                        this.confirmPassword?.setValidators(Validators.required);
                        this.formGroup.addValidators(this.passwordMatchValidator(this.password, this.confirmPassword));
                        break;
                }
            }
        });
    }

    ngOnDestroy(): void {
        this.fragmentSubscription?.unsubscribe();
    }

    public unlock(): void {
        switch (this.fragment) {
            case MasterPasswordEnum.FIRST_INSERT:
                this.cryptographyService.hash(this.password?.value).then(result => {
                    const masterPassword = new MasterPassword(result.hash, result.salt);

                    firstValueFrom(this.masterPasswordService.save(masterPassword)).then(() => {
                        this.navigate();
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("MASTER_PASSWORD.SAVE.ERROR"), error);
                    });
                }).catch(() => {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.UPDATE.FAIL"));
                });
                break;
            case MasterPasswordEnum.LOCK:
                this.utilsService.checkMasterPassword(this.password?.value, this.navigate);
                break;
            case MasterPasswordEnum.CHANGE:
                this.utilsService.checkMasterPassword(this.oldPassword?.value, this.updateMasterPassword);
                break;
        }
    }

    public signout(): void {
        this.userService.logout();
    }

    private lockFunction() {
        this.oldPassword?.setValidators(null);
        this.oldPassword?.setErrors(null);
        this.password?.setValidators(Validators.required);
        this.confirmPassword?.setValidators(null);
        this.confirmPassword?.setErrors(null);
    }

    private passwordMatchValidator(password: AbstractControl | null, confirmPassword: AbstractControl | null) {
        return () => {
            if (password?.value !== confirmPassword?.value)
                return { match_error: 'Value does not match' };

            return null;
        };
    }

    private navigate = (): void => {
        this.settingsService.isLock = false;
        this.settingsService.repromptMill = 0;
        this.router.navigate(['wallet']);
    }

    private updateMasterPassword = (): void => {
        firstValueFrom(this.walletsService.getAll()).then(wallets => {
            Promise.all(this.updateEncryptedInfo(wallets)).then(walletBasic => {
                this.cryptographyService.hash(this.password?.value).then(result => {
                    const masterPassword = new MasterPasswordUpdate(result.hash, result.salt, walletBasic);

                    firstValueFrom(this.masterPasswordService.update(masterPassword)).then(() => {
                        this.snackBar.success(this.translate.instant("MASTER_PASSWORD.UPDATE.SUCCESS"));
                        this.navigate();
                    }).catch(() => {
                        this.snackBar.warning(this.translate.instant("MASTER_PASSWORD.UPDATE.FAIL"));
                    });
                }).catch(() => {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.UPDATE.ERROR"));
                });
            }).catch(() => {
                this.snackBar.error(this.translate.instant("MASTER_PASSWORD.UPDATE.ERROR"));
            });
        }).catch(error => {
            this.snackBar.error(this.translate.instant("MASTER_PASSWORD.UPDATE.ERROR"), error);
        });
    }

    private updateEncryptedInfo(wallets: Wallet[]): Promise<WalletBasic>[] {
        return wallets.map(async wallet => {
            const info = wallet.type === TypeEnum.CREDENTIAL ? wallet.passwd : wallet.content;
            const plainText = await this.cryptographyService.decrypt(info, this.oldPassword?.value, wallet.iv, wallet.salt);
            const payload = await this.cryptographyService.encrypt(plainText, this.password?.value);
            const finalWallet = new WalletBasic();

            finalWallet.id = wallet.id;
            finalWallet.type = wallet.type;
            finalWallet.info = payload.cipher;
            finalWallet.iv = payload.iv;
            finalWallet.salt = payload.salt;

            return finalWallet;
        });
    }
}
