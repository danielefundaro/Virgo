import { Component, OnDestroy } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { Subscription, firstValueFrom } from 'rxjs';
import { SettingsService, SnackBarService, UserService } from 'src/app/services';
import { WorkspacesService } from '../../services';
import { MasterPasswordEnum, Workspace } from '../../models';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ChildrenOutletContexts, NavigationStart, Router } from '@angular/router';
import { AddWorkspaceComponent } from '../../components/dialog/add-workspace/add-workspace.component';
import { ConfirmActionComponent } from '../../components/dialog/confirm-action/confirm-action.component';
import { slideInAnimation } from './animation';

@Component({
    selector: 'default',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss'],
    animations: [slideInAnimation]
})
export class DefaultComponent implements OnDestroy {
    public languages: string[];
    public user?: KeycloakProfile;
    public isLoggedIn!: boolean;
    public isDarkTheme: boolean;
    public isLoading!: boolean;
    public workspaces?: Workspace[];
    public updateMasterPassword = MasterPasswordEnum.CHANGE;

    private loadState: Subscription;
    private workspaceList: Subscription;
    private routerSubscription: Subscription;

    constructor(private router: Router, private userService: UserService, public settingsService: SettingsService,
        private workspacesService: WorkspacesService, private snackBar: SnackBarService,
        private translate: TranslateService, private dialog: MatDialog, private contexts: ChildrenOutletContexts) {
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

        // Check at every action
        this.routerSubscription = this.router.events.subscribe(data => {
            const url = (data as NavigationStart).url;

            if (this.settingsService.isLock && !(url === null || url === undefined || url.endsWith('master-password') || url.endsWith('first-insert'))) {
                this.router.navigate(['master-password']);
            }

            if (this.userService.isTokenExpired()) {
                this.userService.updateToken().catch(() => this.userService.logout());
            }
        });
    }

    ngOnDestroy(): void {
        this.loadState.unsubscribe();
        this.workspaceList.unsubscribe();
        this.routerSubscription.unsubscribe();
    }

    public openProfile(): void {
        this.userService.redirectToProfile();
    }

    public lock(): void {
        this.settingsService.isLock = true;
        this.router.navigate(['master-password']);
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

    public getRouteAnimationData() {
        return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
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
