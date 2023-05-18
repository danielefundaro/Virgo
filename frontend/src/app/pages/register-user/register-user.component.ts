import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { KeycloakProfileRegistration } from 'src/app/models';
import { SettingsService, UserService } from 'src/app/services';

@Component({
    selector: 'register-user',
    templateUrl: './register-user.component.html',
    styleUrls: ['./register-user.component.scss']
})
export class RegisterUserComponent {
    public get email() { return this.formGroup.get('email'); }
    public get firstName() { return this.formGroup.get('firstName'); }
    public get lastName() { return this.formGroup.get('lastName'); }
    public get username() { return this.formGroup.get('username'); }
    public get password() { return this.formGroup.get('password'); }
    public get confirmPassword() { return this.formGroup.get('confirmPassword'); }

    public formGroup: FormGroup;
    public resend: boolean;
    public passwordViewToggle: boolean;

    constructor(private userService: UserService, private settingsService: SettingsService) {
        this.resend = false;
        this.passwordViewToggle = false;

        this.formGroup = new FormGroup({
            email: new FormControl(undefined, [Validators.required, Validators.email]),
            firstName: new FormControl(undefined, [Validators.required]),
            lastName: new FormControl(undefined, [Validators.required]),
            username: new FormControl(undefined, [Validators.required]),
            password: new FormControl(undefined, [Validators.required]),
            confirmPassword: new FormControl(undefined, [Validators.required]),
        });

        this.formGroup.addValidators(this.passwordMatchValidator(this.password, this.confirmPassword));
    }

    public registration(): void {
        this.settingsService.isLoading = true;
        const payload = new KeycloakProfileRegistration(this.email?.value, this.firstName?.value, this.lastName?.value, this.username?.value, this.password?.value);

        firstValueFrom(this.userService.save(payload)).finally(() => {
            this.settingsService.isLoading = false;
            this.resend = true;
        });
    }

    private passwordMatchValidator(password: AbstractControl | null, confirmPassword: AbstractControl | null) {
        return () => {
            if (password?.value !== confirmPassword?.value)
                return { match_error: 'Value does not match' };

            return null;
        };
    }
}
