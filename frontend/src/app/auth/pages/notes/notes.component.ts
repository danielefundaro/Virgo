import { Component } from '@angular/core';
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

    public columnsDisplay!: IColumn[];

    constructor(private notesService: NotesService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingsService: SettingsService) {
        super(settingsService);

        this.columnsDisplay = [{
            name: "name",
            title: this.translate.instant("NOTES.NAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("NOTES.WORKSPACE")
        }];
    }

    public search(s: Searcher): Observable<Page<Note>> {
        return this.notesService.search(s);
    }

    public DisplayedColumns(): string[] {
        return ["name", "website", "username", "workspace.name"];
    }

    public onSortChange(field: string): void {
        super.sortChange(field);
    }

    public copy(data: Credential): void {
        console.log(data);
    }
}
