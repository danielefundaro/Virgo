import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KeycloakProfile } from 'keycloak-js';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services';
import { MasterPasswordEnum } from '../../models';

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
    public fragment?: string | null;
    public masterPasswordEnum = MasterPasswordEnum;

    private fragmentSubscription?: Subscription;

    constructor(private userService: UserService, private route: ActivatedRoute) {
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
        this.fragmentSubscription = this.route.fragment.subscribe(fragment => {
            this.fragment = fragment;

            switch (fragment) {
                case MasterPasswordEnum.FIRST_INSERT:
                    this.oldPassword?.setValidators(null);
                    this.oldPassword?.setErrors(null);
                    this.password?.setValidators(Validators.required);
                    this.confirmPassword?.setValidators(Validators.required);
                    this.formGroup.addValidators(this.passwordMatchValidator(this.password, this.confirmPassword));
                    break;
                case MasterPasswordEnum.VALIDATE:
                    this.oldPassword?.setValidators(null);
                    this.oldPassword?.setErrors(null);
                    this.password?.setValidators(Validators.required);
                    this.confirmPassword?.setValidators(null);
                    this.confirmPassword?.setErrors(null);
                    break;
                case MasterPasswordEnum.CHANGE:
                    this.oldPassword?.setValidators(Validators.required);
                    this.password?.setValidators(Validators.required);
                    this.confirmPassword?.setValidators(Validators.required);
                    this.formGroup.addValidators(this.passwordMatchValidator(this.password, this.confirmPassword));
                    break;
            }
        });
    }

    ngOnDestroy(): void {
        this.fragmentSubscription?.unsubscribe();
    }

    public unlock(): void {
        console.log(this.password?.value);
    }

    public signout(): void {
        this.userService.logout();
    }

    passwordMatchValidator(password: AbstractControl | null, confirmPassword: AbstractControl | null) {
        return () => {
            if (password?.value !== confirmPassword?.value)
                return { match_error: 'Value does not match' };

            return null;
        };
    }
}
