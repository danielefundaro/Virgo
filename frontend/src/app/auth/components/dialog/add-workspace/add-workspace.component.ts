import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { Workspace } from 'src/app/auth/models';
import { WorkspacesService } from 'src/app/auth/services';
import { SettingsService, SnackBarService } from 'src/app/services';

@Component({
    selector: 'add-workspace',
    templateUrl: './add-workspace.component.html',
    styleUrls: ['./add-workspace.component.scss']
})
export class AddWorkspaceComponent {

    public workspace!: Workspace;

    constructor(private workspacesService: WorkspacesService, private settingsService: SettingsService,
        private snackBar: SnackBarService, private translate: TranslateService,
        private dialogRef: MatDialogRef<AddWorkspaceComponent>) {
        this.workspace = new Workspace();
    }

    public save(isSave: boolean): void {
        if (isSave) {
            this.settingsService.isLoading = true;

            firstValueFrom(this.workspacesService.save(this.workspace)).then(() => {
                this.snackBar.success(this.translate.instant("WORKSPACE.SAVE.SUCCESS"));
                this.dialogRef.close(true);
            }).catch(error => {
                this.snackBar.error(this.translate.instant("WORKSPACE.SAVE.ERROR"), error);
                this.dialogRef.close(false);
            }).then(() => this.settingsService.isLoading = false);
        } else {
            this.dialogRef.close(false);
        }
    }
}
