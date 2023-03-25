import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { catchError, debounceTime, firstValueFrom, map, merge, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { SettingsService } from 'src/app/services';
import { EncryptCommonFields, IChangeWorkspaceRequest, IChangeWorkspaceResponse, Page, Searcher, Workspace } from '../../models';
import { ChangeWorkspaceComponent } from '../dialog/change-workspace/change-workspace.component';
import { CustomTableComponent } from './custom-table.component';

@Component({ template: "" })
export abstract class AbstractTableComponent<T extends EncryptCommonFields> implements AfterViewInit, OnDestroy {

    @ViewChild(CustomTableComponent) customTable!: CustomTableComponent;

    protected dataSource!: any[];

    private subscription!: Subscription;

    constructor(private settingService: SettingsService, protected dialog: MatDialog) {
        this.dataSource = [];
        this.settingService.isLoading = true;
    }

    public abstract search(s: Searcher): Observable<Page<T>>;
    public abstract update(data: T): Observable<T>;
    public abstract displayedColumns(): string[];
    public abstract onChangeWorkspace(data: T, workspace: Workspace): void;

    ngAfterViewInit(): void {
        this.subscription = merge(this.customTable.paginator.page, this.customTable.onSortChange).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher("", this.customTable.paginator.pageIndex, this.customTable.paginator.pageSize, [this.customTable.sort]);
                return this.search(s).pipe(catchError(() => of(null)));
            }),
            map(data => {
                if (data === null) {
                    return [];
                }

                this.customTable.paginator.length = data.totalElements;
                return data.content;
            })
        ).subscribe(data => {
            this.dataSource = data;
            this.settingService.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    protected moveWorkspace(data: T): void {
        const dialogRef = this.dialog.open<ChangeWorkspaceComponent, IChangeWorkspaceRequest, IChangeWorkspaceResponse>(ChangeWorkspaceComponent, {
            data: { title: data.name, workspace: data.workspace },
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result?.move) {
                data.workspace = result.workspace;

                firstValueFrom(this.update(data)).then(result => {
                    console.log(result);
                }).catch(error => {
                    console.error(error);
                });
            }
        });
    }
}
