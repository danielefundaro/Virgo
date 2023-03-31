import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { IChangeWorkspaceRequest, Workspace } from 'src/app/auth/models';
import { WorkspacesService } from 'src/app/auth/services';

@Component({
    selector: 'change-workspace',
    templateUrl: './change-workspace.component.html',
    styleUrls: ['./change-workspace.component.scss']
})
export class ChangeWorkspaceComponent {

    public workspaces!: Workspace[];
    public workspaceControl!: FormControl;

    constructor(private workspacesService: WorkspacesService, @Inject(MAT_DIALOG_DATA) public data: IChangeWorkspaceRequest) {
        this.workspaceControl = new FormControl(null);

        firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
            this.workspaces = workspaces;
            this.workspaceControl = new FormControl(workspaces.find(workspace => workspace.id === data.workspace?.id));
        });
    }
}
