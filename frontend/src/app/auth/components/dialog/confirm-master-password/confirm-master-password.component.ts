import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'confirm-master-password',
  templateUrl: './confirm-master-password.component.html',
  styleUrls: ['./confirm-master-password.component.scss']
})
export class ConfirmMasterPasswordComponent {
    public passwordControl!: FormControl;
    public passwordViewToggle: boolean;

    constructor() {
        this.passwordControl = new FormControl(null);
        this.passwordViewToggle = false;
    }
}
