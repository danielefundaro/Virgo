import { Component } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/custom-table/abstract-table.component';
import { IColumn, Note, Page, Searcher } from '../../models';
import { NotesService, UtilsService } from '../../services';

@Component({
    selector: 'notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends AbstractTableComponent<Note> {

    public iDisplayedColumns!: IColumn[];

    constructor(private notesService: NotesService, private translate: TranslateService,
        private snackBarService: SnackBarService, private router: Router, private clipboard: Clipboard,
        settingsService: SettingsService, utilsService: UtilsService, dialog: MatDialog) {
        super(settingsService, utilsService, dialog);

        this.iDisplayedColumns = [{
            name: "name",
            title: this.translate.instant("NOTE.NAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("NOTE.WORKSPACE")
        }];
    }

    public search(s: Searcher): Observable<Page<Note>> {
        return this.notesService.search(s);
    }
    
    public override getError(error: any): void {
        this.snackBarService.error("", error);
    }
    
    public update(data: Note): Observable<Note> {
        return this.notesService.update(data);
    }

    public updateMassiveMessage(): string {
        return this.translate.instant("NOTE.UPDATE.MASSIVE.MESSAGE");
    }

    public updateSuccess(): void {
        this.snackBarService.success(this.translate.instant("NOTE.UPDATE.SUCCESS"));
    }

    public updateSuccessMassive(): void {
        this.snackBarService.success(this.translate.instant("NOTE.UPDATE.MASSIVE.SUCCESS"));
    }

    public updateError(error: any): void {
        this.snackBarService.error(this.translate.instant("NOTE.UPDATE.ERROR"), error);
    }

    public updateErrorMassive(error: any): void {
        this.snackBarService.error(this.translate.instant("NOTE.UPDATE.MASSIVE.ERROR"), error);
    }

    public delete(data: Note): Observable<Note> {
        return this.notesService.delete(data.id);
    }

    public deleteMessage(): string {
        return this.translate.instant("NOTE.DELETE.MESSAGE");
    }

    public deleteMassiveMessage(): string {
        return this.translate.instant("NOTE.DELETE.MASSIVE.MESSAGE");
    }

    public deleteSuccess(): void {
        this.snackBarService.success(this.translate.instant("NOTE.DELETE.SUCCESS"));
    }

    public deleteSuccessMassive(): void {
        this.snackBarService.success(this.translate.instant("NOTE.DELETE.MASSIVE.SUCCESS"));
    }

    public deleteError(error: any): void {
        this.snackBarService.error(this.translate.instant("NOTE.DELETE.ERROR"), error);
    }

    public deleteErrorMassive(error: any): void {
        this.snackBarService.error(this.translate.instant("NOTE.DELETE.MASSIVE.ERROR"), error);
    }

    public addElement(): void {
        this.router.navigate(['notes', 'add']);
    }

    public copyContent(data: Note): void {
        super.copy(data.content, data.iv, data.salt, this.successCopy);
    }

    private successCopy = (content: string): void => {
        this.clipboard.copy(content);
        this.snackBarService.info(this.translate.instant("NOTE.COPY.CONTENT"));
    }
}
