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
