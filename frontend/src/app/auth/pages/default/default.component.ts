import { Component, OnDestroy } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { Subscription, firstValueFrom } from 'rxjs';
import { SettingsService, SnackBarService, UserService } from 'src/app/services';
import { WorkspacesService } from '../../services';
import { Workspace } from '../../models';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { AddWorkspaceComponent } from '../../components/dialog/add-workspace/add-workspace.component';
import { ConfirmActionComponent } from '../../components/dialog/confirm-action/confirm-action.component';

@Component({
    selector: 'default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnDestroy {
    public languages: string[];
    public user?: KeycloakProfile;
    public isLoggedIn!: boolean;
    public isDarkTheme: boolean;
    public isLoading!: boolean;
    public workspaces?: Workspace[];
    private loadState: Subscription;
    private workspaceList: Subscription;

    constructor(private userService: UserService, public settingsService: SettingsService,
        private workspacesService: WorkspacesService, private snackBar: SnackBarService,
        private translate: TranslateService, private dialog: MatDialog) {
        this.languages = settingsService.languages;
        this.isDarkTheme = this.settingsService.isDarkTheme;

        this.userService.isLoggedIn().then(data => this.isLoggedIn = data);
        this.userService.loadUserProfile().then(data => this.user = data);
        this.loadWorkspaces();

        // Set default theme
        this.settingsService.setDefalutTheme();
        this.isDarkTheme = this.settingsService.isDarkTheme;

        // Check loading state
        this.loadState = this.settingsService.loadStateChanged().subscribe(data => this.isLoading = data);

        // Check workspace list
        this.workspaceList = this.settingsService.onUpateWorkspacesEvent().subscribe(() => this.loadWorkspaces());
    }

    ngOnDestroy(): void {
        this.loadState.unsubscribe();
        this.workspaceList.unsubscribe();
    }

    public openProfile(): void {
        this.userService.redirectToProfile();
    }

    public changeTheme(): void {
        this.isDarkTheme = this.settingsService.toggleTheme();
    }

    public changeLang(lang: string): void {
        this.settingsService.currentLang = lang;
    }

    public addWorkspace(): void {
        const dialogRef = this.dialog.open(AddWorkspaceComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.settingsService.onUpdateWorkspaces.emit();
            }
        });
    }

    public removeWorkspace(workspace: Workspace): void {
        const dialogRef = this.dialog.open<ConfirmActionComponent, any, boolean>(ConfirmActionComponent, {
            data: { message: this.translate.instant("WORKSPACE.DELETE.MESSAGE") },
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.settingsService.isLoading = true;

                firstValueFrom(this.workspacesService.delete(workspace.id)).then(() => {
                    this.snackBar.success(this.translate.instant("WORKSPACE.DELETE.SUCCESS"));
                    this.settingsService.onUpdateWorkspaces.emit();
                }).catch(error => {
                    this.snackBar.error(this.translate.instant("WORKSPACE.DELETE.ERROR"), error);
                }).then(() => this.settingsService.isLoading = false);
            }
        })
    }

    public signout(): void {
        this.userService.logout();
    }

    private loadWorkspaces() {
        this.settingsService.isLoading = true;

        firstValueFrom(this.workspacesService.getAll()).then(data => {
            this.workspaces = data;
        }).catch(error => {
            this.snackBar.error(this.translate.instant("SHARED.WORKSPACE.GET_ALL.ERROR"), error);
        }).then(() => this.settingsService.isLoading = false);
    }
}
