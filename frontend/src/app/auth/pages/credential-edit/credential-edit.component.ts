import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { Credential, Workspace } from '../../models';
import { CredentialsService, WorkspacesService } from '../../services';
import { AddWorkspaceComponent } from '../../components/dialog/add-workspace/add-workspace.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'credential-edit',
    templateUrl: './credential-edit.component.html',
    styleUrls: ['./credential-edit.component.scss']
})
export class CredentialEditComponent implements OnInit, OnDestroy {

    public get name() { return this.formGroup.get('name'); }
    public get website() { return this.formGroup.get('website'); }
    public get username() { return this.formGroup.get('username'); }
    public get password() { return this.formGroup.get('password'); }
    public get workspace() { return this.formGroup.get('workspace'); }
    public get note() { return this.formGroup.get('note'); }
    private get id() { return this.formGroup.get('id'); }
    private get iv() { return this.formGroup.get('iv'); }
    private get salt() { return this.formGroup.get('salt'); }

    public workspaces!: Workspace[];
    public formGroup: FormGroup;
    public passwordViewToggle: boolean;

    private param?: Subscription;

    constructor(private router: Router, private route: ActivatedRoute, private credentialsService: CredentialsService,
        private workspacesService: WorkspacesService, private translate: TranslateService, private snackBar: SnackBarService,
        private settingsService: SettingsService, private dialog: MatDialog) {
        this.settingsService.isLoading = true;
        this.passwordViewToggle = false;

        this.formGroup = new FormGroup({
            id: new FormControl(undefined),
            name: new FormControl(undefined, [Validators.required]),
            website: new FormControl(undefined, [Validators.required]),
            username: new FormControl(undefined),
            password: new FormControl(undefined, [Validators.required]),
            workspace: new FormControl(undefined, [Validators.required]),
            note: new FormControl(undefined),
            iv: new FormControl(undefined, [Validators.required]),
            salt: new FormControl(undefined, [Validators.required]),
        });
    }

    ngOnInit(): void {
        this.settingsService.isLoading = true;

        this.param = this.route.params.subscribe(data => {
            const id = data['id'];

            firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
                this.workspaces = workspaces;

                if (id !== 'add') {
                    firstValueFrom(this.credentialsService.getById(id)).then(credential => {
                        this.id?.setValue(credential.id);
                        this.name?.setValue(credential.name);
                        this.website?.setValue(credential.website);
                        this.username?.setValue(credential.username);
                        this.password?.setValue(credential.passwd);
                        this.workspace?.setValue(workspaces.find(workspace => workspace.id === credential.workspace.id));
                        this.note?.setValue(credential.note);
                        this.iv?.setValue(credential.iv);
                        this.salt?.setValue(credential.salt);
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("CREDENTIAL.ERROR.LOAD"), error);
                    }).then(() => this.settingsService.isLoading = false);
                } else {
                    this.iv?.setValue(crypto.randomUUID().replaceAll("-", ""));
                    this.salt?.setValue(crypto.randomUUID().replaceAll("-", ""));
                    this.settingsService.isLoading = false;
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.param?.unsubscribe();
    }

    public save(): void {
        const credential = new Credential();

        credential.id = this.id?.value;
        credential.name = this.name?.value;
        credential.website = this.website?.value;
        credential.username = this.username?.value;
        credential.passwd = this.password?.value;
        credential.workspace = this.workspace?.value;
        credential.note = this.note?.value;
        credential.iv = this.iv?.value;
        credential.salt = this.salt?.value;

        this.settingsService.isLoading = true;

        const action = credential.id ? this.credentialsService.update(credential) : this.credentialsService.save(credential);
        const actionMessage = credential.id ? "UPDATE" : "SAVE";

        firstValueFrom(action).then(data => {
            this.snackBar.success(this.translate.instant(`CREDENTIAL.${actionMessage}.SUCCESS`));
            this.router.navigate(['credentials', data?.id]);
        }).catch(error => {
            this.snackBar.error(this.translate.instant(`CREDENTIAL.${actionMessage}.ERROR`), error);
        }).then(() => this.settingsService.isLoading = false);
    }

    public addWorkspace(): void {
        const dialogRef = this.dialog.open(AddWorkspaceComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.settingsService.onUpdateWorkspaces.emit();
                this.ngOnInit();
            }
        });
    }
}
