import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MasterPasswordEnum } from '../auth/models';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {
    constructor(private snackBar: MatSnackBar, private router: Router, private translateService: TranslateService) { }

    info(message: string, duration: number = 2000): void {
        this.open(message, duration, ['mat-snackbar-info']);
    }

    success(message: string, duration: number = 2000): void {
        this.open(message, duration, ['mat-snackbar-success']);
    }

    warning(message: string, duration: number = 2000): void {
        this.open(message, duration, ['mat-snackbar-warn']);
    }

    error(message: string, error?: any, duration: number = 5000): void {
        const status = error?.error?.status || error?.status || error;
        const messageError: { code: string, reason: string } = JSON.parse(error?.error?.message || {});

        if (status == 404) {
            this.router.navigate(['404']);
        }

        if (status === 409 && messageError.code === "001") {
            this.router.navigate(['master-password'], {fragment: MasterPasswordEnum.FIRST_INSERT});
            return;
        }

        this.open(message, duration, ['mat-snackbar-error']);
    }

    private open(message: string, duration?: number, panelClass?: string | string[]) {
        this.snackBar.open(message, '', {
            duration: duration,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: panelClass
        });
    }
}
