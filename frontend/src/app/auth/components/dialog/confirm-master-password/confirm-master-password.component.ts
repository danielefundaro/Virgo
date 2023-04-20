import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SettingsService } from 'src/app/services';

@Component({
    selector: 'confirm-master-password',
    templateUrl: './confirm-master-password.component.html',
    styleUrls: ['./confirm-master-password.component.scss']
})
export class ConfirmMasterPasswordComponent {
    public passwordControl!: FormControl;
    public passwordViewToggle: boolean;
    public reprompt?: { value: number, time: string, mill: number } | null = null;
    public repromptOptions: Array<{ value: number, time: string, mill: number }> = [
        { value: 30, time: 'SEC', mill: 1000 * 30 },
        { value: 60, time: 'SEC', mill: 1000 * 60 },
        { value: 2, time: 'MIN', mill: 1000 * 60 * 2 },
        { value: 5, time: 'MIN', mill: 1000 * 60 * 5 },
        { value: 10, time: 'MIN', mill: 1000 * 60 * 10 },
        { value: 15, time: 'MIN', mill: 1000 * 60 * 15 },
        { value: 30, time: 'MIN', mill: 1000 * 60 * 30 },
        { value: 60, time: 'MIN', mill: 1000 * 60 * 60 },
        { value: 2, time: 'HOUR', mill: 1000 * 60 * 60 * 2 },
        { value: 3, time: 'HOUR', mill: 1000 * 60 * 60 * 3 },
        { value: 6, time: 'HOUR', mill: 1000 * 60 * 60 * 6 },
        { value: 9, time: 'HOUR', mill: 1000 * 60 * 60 * 9 },
        { value: 12, time: 'HOUR', mill: 1000 * 60 * 60 * 12 },
        { value: 24, time: 'HOUR', mill: 1000 * 60 * 60 * 24 },
    ]

    constructor(private dialogRef: MatDialogRef<ConfirmMasterPasswordComponent>, private settingsService: SettingsService) {
        this.passwordControl = new FormControl(null);
        this.passwordViewToggle = false;

        if (this.settingsService.repromptMill) {
            this.reprompt = this.repromptOptions.find(elem => elem.mill === this.settingsService.repromptMill);
        }
    }

    public closeDialog(): void {
        this.settingsService.masterPassword = this.passwordControl.value;
        this.settingsService.repromptMill = this.reprompt ? this.reprompt.mill : 0;
        this.settingsService.repromptStartDate = new Date();
        this.dialogRef.close(this.passwordControl.value);
    }
}
