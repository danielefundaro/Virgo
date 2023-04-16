import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { Credential, Workspace } from '../../models';
import { CredentialsService, CryptographyService, MasterPasswordService, WorkspacesService } from '../../services';
import { AddWorkspaceComponent } from '../../components/dialog/add-workspace/add-workspace.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmMasterPasswordComponent } from '../../components/dialog/confirm-master-password/confirm-master-password.component';

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
    private workspaceList: Subscription;
    private paramId!: any;
    private oldPassword?: string;
    private masterPassword!: string;

    constructor(private router: Router, private route: ActivatedRoute, private credentialsService: CredentialsService,
        private workspacesService: WorkspacesService, private translate: TranslateService, private snackBar: SnackBarService,
        private cryptographyService: CryptographyService, private settingsService: SettingsService, private dialog: MatDialog,
        private masterPasswordService: MasterPasswordService) {
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

        // Check workspace list
        this.workspaceList = this.settingsService.onUpateWorkspacesEvent().subscribe(() => this.ngOnInit());
    }

    ngOnInit(): void {
        this.settingsService.isLoading = true;

        this.param = this.route.params.subscribe(data => {
            this.paramId = data['id'];

            firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
                this.workspaces = workspaces;

                if (this.paramId !== "add") {
                    firstValueFrom(this.credentialsService.getById(this.paramId)).then(credential => {
                        this.id?.setValue(credential.id);
                        this.name?.setValue(credential.name);
                        this.website?.setValue(credential.website);
                        this.username?.setValue(credential.username);
                        this.password?.setValue(credential.passwd);
                        this.workspace?.setValue(workspaces.find(workspace => workspace.id === credential.workspace.id));
                        this.note?.setValue(credential.note);
                        this.iv?.setValue(credential.iv);
                        this.salt?.setValue(credential.salt);

                        this.oldPassword = credential.passwd;
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("CREDENTIAL.ERROR.LOAD"), error);
                    }).then(() => this.settingsService.isLoading = false);
                } else {
                    this.iv?.setValidators(null);
                    this.iv?.setErrors(null);
                    this.salt?.setValidators(null);
                    this.salt?.setErrors(null);
                    this.settingsService.isLoading = false;
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.param?.unsubscribe();
        this.workspaceList.unsubscribe();
    }

    public save(): void {
        const dialogRef = this.dialog.open(ConfirmMasterPasswordComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.masterPassword = result;
                this.settingsService.checkMasterPassword(result, this.saveCredential);
            }
        });
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

    private saveCredential = (): void => {
        this.settingsService.isLoading = true;

        if (this.paramId !== "add" && this.oldPassword === this.password?.value) {
            this.cryptographyService.decrypt(this.password?.value, this.masterPassword, this.iv?.value, this.salt?.value).then(password => {
                this.encryptAndSave(password, this.iv?.value, this.salt?.value);
            });
        } else {
            this.encryptAndSave(this.password?.value);
        }
    }

    private encryptAndSave(password: string, iv: string | null = null, salt: string | null = null): void {
        this.cryptographyService.encrypt(password, this.masterPassword, iv, salt).then(payload => {
            const credential = new Credential();

            credential.id = this.id?.value;
            credential.name = this.name?.value;
            credential.website = this.website?.value;
            credential.username = this.username?.value;
            credential.passwd = payload.cipher;
            credential.workspace = this.workspace?.value;
            credential.note = this.note?.value;
            credential.iv = payload.iv;
            credential.salt = payload.salt;

            const action = credential.id ? this.credentialsService.update(credential) : this.credentialsService.save(credential);
            const actionMessage = credential.id ? "UPDATE" : "SAVE";

            firstValueFrom(action).then(data => {
                this.snackBar.success(this.translate.instant(`CREDENTIAL.${actionMessage}.SUCCESS`));
                this.router.navigate(['credentials', data?.id]);
                this.ngOnInit();
            }).catch(error => {
                this.snackBar.error(this.translate.instant(`CREDENTIAL.${actionMessage}.ERROR`), error);
            }).then(() => this.settingsService.isLoading = false);
        });
    }
}
