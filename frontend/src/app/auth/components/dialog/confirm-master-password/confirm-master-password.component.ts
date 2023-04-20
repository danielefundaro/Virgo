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

    constructor(private dialogRef: MatDialogRef<ConfirmMasterPasswordComponent>, private settingsService: SettingsService) {
        this.passwordControl = new FormControl(null);
        this.passwordViewToggle = false;
    }

    public closeDialog(): void {
        this.settingsService.masterPassword = this.passwordControl.value;
        this.dialogRef.close(this.passwordControl.value);
    }
}
