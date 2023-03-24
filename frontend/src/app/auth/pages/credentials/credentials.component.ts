import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/abstract-table/abstract-table.component';
import { Credential, IColumn, Page, Searcher } from '../../models';
import { CredentialsService } from '../../services';

@Component({
    selector: 'credentials',
    templateUrl: './credentials.component.html',
    styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent extends AbstractTableComponent<Credential> {

    public columnsDisplay!: IColumn[];

    constructor(private credentialsService: CredentialsService, private translate: TranslateService,
        private snackBarService: SnackBarService, private settingsService: SettingsService) {
        super(settingsService);

        this.columnsDisplay = [{
            name: "name",
            title: this.translate.instant("CREDENTIALS.NAME")
        }, {
            name: "website",
            title: this.translate.instant("CREDENTIALS.WEBSITE")
        }, {
            name: "username",
            title: this.translate.instant("CREDENTIALS.USERNAME")
        }, {
            name: "workspace.name",
            title: this.translate.instant("CREDENTIALS.WORKSPACE")
        }];
    }

    public search(s: Searcher): Observable<Page<Credential>> {
        return this.credentialsService.search(s);
    }

    public DisplayedColumns(): string[] {
        return ["name", "website", "username", "workspace.name"];
    }

    public onSortChange(field: string): void {
        console.log(field);
        super.sortChange(field);
    }

    public copy(data: Credential): void {
        console.log(data);
    }
}
