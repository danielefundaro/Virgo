import { AfterViewInit, Component, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { catchError, debounceTime, firstValueFrom, map, merge, Observable, of, startWith, Subscription, switchMap } from 'rxjs';
import { SettingsService } from 'src/app/services';
import { EncryptCommonFields, IChangeWorkspaceRequest, Page, Searcher, Workspace } from '../../models';
import { ChangeWorkspaceComponent } from '../dialog/change-workspace/change-workspace.component';
import { ConfirmActionComponent } from '../dialog/confirm-action/confirm-action.component';
import { CustomTableComponent } from './custom-table.component';

@Component({ template: "" })
export abstract class AbstractTableComponent<T extends EncryptCommonFields> implements AfterViewInit, OnDestroy {

    @ViewChild(CustomTableComponent) customTable!: CustomTableComponent;
    @ViewChildren(MatCheckbox) checkBoxes!: QueryList<MatCheckbox>;

    protected dataSource!: any[];
    protected showCheckBox: boolean = false;
    protected checked: boolean = false;
    protected indeterminate: boolean = false;

    private subscription!: Subscription;

    constructor(private settingService: SettingsService, protected dialog: MatDialog) {
        this.dataSource = [];
        this.settingService.isLoading = true;
    }

    public abstract search(s: Searcher): Observable<Page<T>>;
    public abstract update(data: T): Observable<T>;
    public abstract updateSuccess(data: T | any): void;
    public abstract updateError(data: T | any): void;
    public abstract delete(data: T): Observable<T>;
    public abstract deleteMessage(): string;
    public abstract deleteSuccess(data: T | any): void;
    public abstract deleteError(data: T | any): void;

    ngAfterViewInit(): void {
        this.subscription = merge(this.customTable.paginator.page, this.customTable.onSortChange, this.settingService.onSearchChanged).pipe(
            startWith({}),
            debounceTime(150),
            switchMap(() => {
                const s: Searcher = new Searcher(this.settingService.search, this.customTable.paginator.pageIndex, this.customTable.paginator.pageSize, [this.customTable.sort]);
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

    protected onCheckAll(isChecked: boolean): void {
        this.showCheckBox = isChecked;
        this.checked = isChecked;
        this.indeterminate = false;
        this.checkBoxes.forEach(checkBox => checkBox.checked = isChecked);
    }

    protected onCheck(): void {
        this.showCheckBox = this.checkBoxes.some(checkBox => checkBox.checked);
        this.checked = this.checkBoxes.map(checkBox => checkBox.checked).every(value => value);
        this.indeterminate = this.checkBoxes.some(checkBox => checkBox.checked) && this.checkBoxes.some(checkBox => !checkBox.checked);
    }

    protected moveWorkspace(data: T): void {
        const dialogRef = this.dialog.open<ChangeWorkspaceComponent, IChangeWorkspaceRequest, Workspace>(ChangeWorkspaceComponent, {
            data: { title: data.name, workspace: data.workspace },
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                data.workspace = result;
                this.settingService.isLoading = true;

                firstValueFrom(this.update(data)).then(result => {
                    this.updateSuccess(data);
                }).catch(error => {
                    this.updateError(error);
                }).then(() => this.settingService.isLoading = false);
            }
        });
    }

    protected deleteElement(data: T): void {
        const dialogRef = this.dialog.open<ConfirmActionComponent, any, boolean>(ConfirmActionComponent, {
            data: { message: this.deleteMessage() },
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.settingService.isLoading = true;

                firstValueFrom(this.delete(data)).then(result => {
                    this.deleteSuccess(data);
                    this.ngAfterViewInit();
                }).catch(error => {
                    this.deleteError(error);
                }).then(() => this.settingService.isLoading = false);
            }
        });
    }
}
