import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { SettingsService, UserService } from 'src/app/services';

@Component({
    selector: 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    public get email() { return this.formGroup.get('email'); }

    public formGroup: FormGroup;
    public resend: boolean;

    constructor(private userService: UserService, private settingsService: SettingsService) {
        this.resend = false;

        this.formGroup = new FormGroup({
            email: new FormControl(undefined, [Validators.required, Validators.email]),
        });
    }

    public sendEmail(): void {
        this.settingsService.isLoading = true;

        firstValueFrom(this.userService.resetCredential(this.email?.value)).finally(() => {
            this.settingsService.isLoading = false;
            this.resend = true;
        });
    }
}
