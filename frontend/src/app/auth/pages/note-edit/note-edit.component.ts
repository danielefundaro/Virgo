import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { Note, Workspace } from '../../models';
import { NotesService, WorkspacesService } from '../../services';

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

    private param?: Subscription;

    constructor(private router: Router, private route: ActivatedRoute, private notesService: NotesService,
        private workspacesService: WorkspacesService, private translate: TranslateService, private snackBar: SnackBarService,
        private settingsService: SettingsService) {
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
    }

    ngOnInit(): void {
        this.param = this.route.params.subscribe(data => {
            const id = data['id'];

            firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
                this.workspaces = workspaces;

                if (id !== 'add') {
                    firstValueFrom(this.notesService.getById(id)).then(note => {
                        this.id?.setValue(note.id);
                        this.name?.setValue(note.name);
                        this.content?.setValue(note.content);
                        this.workspace?.setValue(workspaces.find(workspace => workspace.id === note.workspace.id));
                        this.iv?.setValue(note.iv);
                        this.salt?.setValue(note.salt);
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("NOTE.ERROR.LOAD", { 'status': error.error?.status || error.status, 'message': error.error?.error || error.message }), error.error?.status || error.status);
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
        const note = new Note();

        note.id = this.id?.value;
        note.name = this.name?.value;
        note.content = this.content?.value;
        note.workspace = this.workspace?.value;
        note.iv = this.iv?.value;
        note.salt = this.salt?.value;

        this.settingsService.isLoading = true;

        const action = note.id ? this.notesService.update(note) : this.notesService.save(note);
        const actionMessage = note.id ? "UPDATE" : "SAVE";

        firstValueFrom(action).then(data => {
            this.snackBar.success(this.translate.instant(`NOTE.SUCCESS.${actionMessage}`));
            this.router.navigate(['credentials', data?.id]);
        }).catch(error => {
            this.snackBar.error(this.translate.instant(`NOTE.ERROR.${actionMessage}`, { 'status': error.error?.status || error.status, 'message': error.error?.error || error.message }), error.error?.status || error.status);
        }).then(() => this.settingsService.isLoading = false);
    }
}
