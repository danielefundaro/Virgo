import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/custom-table/abstract-table.component';
import { IColumn, Note, Page, Searcher } from '../../models';
import { NotesService } from '../../services';

@Component({
    selector: 'notes',
    templateUrl: './notes.component.html',
    styleUrls: ['./notes.component.scss']
})
export class NotesComponent extends AbstractTableComponent<Note> {

    public iDisplayedColumns!: IColumn[];

    constructor(private notesService: NotesService, private translate: TranslateService,
        private snackBarService: SnackBarService, private router: Router, settingsService: SettingsService,
        dialog: MatDialog) {
        super(settingsService, dialog);

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
    
    public update(data: Note): Observable<Note> {
        return this.notesService.update(data);
    }

    public updateMassiveMessage(): string {
        return this.translate.instant("NOTE.UPDATE.MESSAGE");
    }

    public updateSuccess(data: Note): void {
        console.log(data);
    }

    public updateSuccessMassive(): void {
        console.log();
    }

    public updateError(data: any): void {
        console.error(data);
    }

    public updateErrorMassive(data: any): void {
        console.error(data);
    }

    public delete(data: Note): Observable<Note> {
        return this.notesService.delete(data.id);
    }

    public deleteMessage(): string {
        return this.translate.instant("NOTE.DELETE.MESSAGE");
    }

    public deleteMassiveMessage(): string {
        return this.translate.instant("NOTE.DELETE.MASSIVE_MESSAGE");
    }

    public deleteSuccess(data: any): void {
        console.log(data);
    }

    public deleteSuccessMassive(): void {
        console.log();
    }

    public deleteError(data: any): void {
        console.error(data);
    }

    public deleteErrorMassive(data: any): void {
        console.error(data);
    }

    public addElement(): void {
        this.router.navigate(['notes', 'add']);
    }

    public copy(data: Note): void {
        console.log(data);
    }

    public edit(data: Note): void {
        console.log(data);
    }
}
