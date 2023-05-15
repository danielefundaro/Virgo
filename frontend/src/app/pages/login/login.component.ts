import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SettingsService, UserService } from 'src/app/services';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    public get username() { return this.formGroup.get('username'); }
    public get password() { return this.formGroup.get('password'); }

    public formGroup: FormGroup;
    public passwordViewToggle: boolean;

    constructor(private userService: UserService, private settingsService: SettingsService,
        private router: Router) {
        this.passwordViewToggle = false;

        this.formGroup = new FormGroup({
            username: new FormControl(undefined, [Validators.required]),
            password: new FormControl(undefined, [Validators.required]),
        });
    }

    public login(): void {
        this.settingsService.isLoading = true;
        firstValueFrom(this.userService.login(this.username?.value, this.password?.value)).then(result => {
            this.userService.setAuthToken(result);
            this.router.navigate(["master-password"]);
        }).catch(error => {
            console.error(error);
        }).then(() => {
            this.settingsService.isLoading = false;
        });
    }
}
