import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { Subscription, firstValueFrom } from 'rxjs';
import { SnackBarService, UserService } from 'src/app/services';
import { MasterPassword, MasterPasswordEnum } from '../../models';
import { CryptographyService, MasterPasswordService } from '../../services';
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

    constructor(private userService: UserService, private route: ActivatedRoute,
        private router: Router, private masterPasswordService: MasterPasswordService,
        private snackBar: SnackBarService, private translate: TranslateService,
        private cryptoService: CryptographyService) {
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
                this.cryptoService.hash(this.password?.value).then(result => {
                    const masterPassword = new MasterPassword(result.hash, result.salt);

                    firstValueFrom(this.masterPasswordService.save(masterPassword)).then(data => {
                        this.navigate();
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("MASTER_PASSWORD.SAVE.ERROR"), error);
                    });
                }).catch((error: any) => {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.HASH.ERROR"));
                });
                break;
            case MasterPasswordEnum.LOCK:
                this.getMasterPassword(this.password?.value, this.navigate);
                break;
            case MasterPasswordEnum.CHANGE:
                this.getMasterPassword(this.oldPassword?.value, this.updateMasterPassword);
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
        this.router.navigate(['wallet']);
    }

    private getMasterPassword(password: string, callback: () => void) {
        firstValueFrom(this.masterPasswordService.get()).then(data => {
            this.cryptoService.hash(password, data.salt).then(result => {
                if (data.hashPasswd === result.hash) {
                    callback();
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

    private updateMasterPassword = () => {
        this.cryptoService.hash(this.password?.value).then(result => {
            const masterPassword = new MasterPassword(result.hash, result.salt);

            firstValueFrom(this.masterPasswordService.update(masterPassword)).then(data => {
                this.navigate();
            }).catch(error => {
                this.snackBar.error(this.translate.instant("MASTER_PASSWORD.UPDATE.ERROR"), error);
            });
        }).catch((error: any) => {
            this.snackBar.error(this.translate.instant("MASTER_PASSWORD.HASH.ERROR"));
        });
    }
}
