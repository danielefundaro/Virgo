import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { Note, Workspace } from '../../models';
import { CryptographyService, NotesService, UtilsService, WorkspacesService } from '../../services';
import { AddWorkspaceComponent } from '../../components/dialog/add-workspace/add-workspace.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmMasterPasswordComponent } from '../../components/dialog/confirm-master-password/confirm-master-password.component';

@Component({
    selector: 'note-edit',
    templateUrl: './note-edit.component.html',
    styleUrls: ['./note-edit.component.scss']
})
export class NoteEditComponent implements OnInit, OnDestroy {

    public get name() { return this.formGroup.get('name'); }
    public get content() { return this.formGroup.get('content'); }
    public get workspace() { return this.formGroup.get('workspace'); }
    private get id() { return this.formGroup.get('id'); }
    private get iv() { return this.formGroup.get('iv'); }
    private get salt() { return this.formGroup.get('salt'); }

    public workspaces!: Workspace[];
    public formGroup: FormGroup;
    public contentViewToggle: boolean;
    public paramId!: any;

    private param?: Subscription;
    private workspaceList: Subscription;
    private oldContent!: string;

    constructor(private router: Router, private route: ActivatedRoute, private notesService: NotesService,
        private workspacesService: WorkspacesService, private translate: TranslateService, private snackBar: SnackBarService,
        private cryptographyService: CryptographyService, private settingsService: SettingsService,
        private utilsService: UtilsService, private dialog: MatDialog) {
        this.settingsService.isLoading = true;
        this.contentViewToggle = false;

        this.formGroup = new FormGroup({
            id: new FormControl(undefined),
            name: new FormControl(undefined, [Validators.required]),
            content: new FormControl(undefined, [Validators.required]),
            workspace: new FormControl(undefined, [Validators.required]),
            iv: new FormControl(undefined, [Validators.required]),
            salt: new FormControl(undefined, [Validators.required]),
        });

        // Check workspace list
        this.workspaceList = this.settingsService.onUpateWorkspacesEvent().subscribe(() => this.ngOnInit());
    }

    ngOnInit(): void {
        this.settingsService.isLoading = true;
        this.contentViewToggle = false;

        this.param = this.route.params.subscribe(data => {
            this.paramId = data['id'];

            firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
                this.workspaces = workspaces;

                if (this.paramId !== 'add') {
                    firstValueFrom(this.notesService.getById(this.paramId)).then(note => {
                        this.id?.setValue(note.id);
                        this.name?.setValue(note.name);
                        this.content?.setValue(note.content);
                        this.workspace?.setValue(workspaces.find(workspace => workspace.id === note.workspace.id));
                        this.iv?.setValue(note.iv);
                        this.salt?.setValue(note.salt);

                        this.oldContent = note.content;
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("NOTE.ERROR.LOAD"), error);
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
                this.utilsService.checkMasterPassword(result, this.saveNote);
            }
        });
    }

    public viewToggle(): void {
        if (this.paramId !== "add") {
            const noChange = this.oldContent === this.content?.value;
            const content = noChange ? this.content?.value : this.oldContent;

            this.utilsService.decryptData(content, this.iv?.value, this.salt?.value, (data: string): void => {
                if (noChange) {
                    this.content?.setValue(data);
                } else if (data === this.content?.value) {
                    this.content.setValue(this.oldContent);
                }

                this.contentViewToggle = !this.contentViewToggle;
            });
        } else {
            this.contentViewToggle = !this.contentViewToggle;
        }
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

    private saveNote = (masterPassword: string): void => {
        this.settingsService.isLoading = true;

        if (this.paramId !== "add" && this.oldContent === this.content?.value) {
            this.saveInfo(this.content?.value, this.iv?.value, this.salt?.value);
        } else {
            this.encryptAndSave(this.content?.value, masterPassword);
        }
    }

    private encryptAndSave(content: string, masterPassword: string, iv: string | null = null, salt: string | null = null): void {
        this.cryptographyService.encrypt(content, masterPassword, iv, salt).then(payload => {
            this.saveInfo(payload.cipher, payload.iv, payload.salt);
        });
    }

    private saveInfo(cipher: string, iv: string, salt: string) {
        const note = new Note();

        note.id = this.id?.value;
        note.name = this.name?.value;
        note.content = cipher;
        note.workspace = this.workspace?.value;
        note.iv = iv;
        note.salt = salt;

        const action = note.id ? this.notesService.update(note) : this.notesService.save(note);
        const actionMessage = note.id ? "UPDATE" : "SAVE";

        firstValueFrom(action).then(data => {
            this.snackBar.success(this.translate.instant(`NOTE.${actionMessage}.SUCCESS`));
            this.router.navigate(['notes', data?.id]);
            this.contentViewToggle = false;

            if (actionMessage === "UPDATE") {
                this.ngOnInit();
            }
        }).catch(error => {
            this.snackBar.error(this.translate.instant(`NOTE.${actionMessage}.ERROR`), error);
        }).then(() => this.settingsService.isLoading = false);
    }
}
