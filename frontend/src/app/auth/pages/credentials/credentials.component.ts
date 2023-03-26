import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { AbstractTableComponent } from '../../components/custom-table/abstract-table.component';
import { Credential, IColumn, Page, Searcher } from '../../models';
import { CredentialsService } from '../../services';

@Component({
    selector: 'credentials',
    templateUrl: './credentials.component.html',
    styleUrls: ['./credentials.component.scss']
})
export class CredentialsComponent extends AbstractTableComponent<Credential> {

    public iDisplayedColumns!: IColumn[];

    constructor(private credentialsService: CredentialsService, private translate: TranslateService,
        private snackBarService: SnackBarService, settingsService: SettingsService, dialog: MatDialog) {
        super(settingsService, dialog);

        this.iDisplayedColumns = [{
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
    
    public update(data: Credential): Observable<Credential> {
        return this.credentialsService.update(data);
    }

    public copy(data: Credential): void {
        console.log(data);
    }

    public edit(data: Credential): void {
        console.log(data);
    }
}
