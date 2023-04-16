import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { TypeEnum, Wallet, Workspace } from '../../models';
import { CryptographyService, UtilsService, WalletsService, WorkspacesService } from '../../services';
import { AddWorkspaceComponent } from '../../components/dialog/add-workspace/add-workspace.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmMasterPasswordComponent } from '../../components/dialog/confirm-master-password/confirm-master-password.component';

@Component({
    selector: 'wallet-edit',
    templateUrl: './wallet-edit.component.html',
    styleUrls: ['./wallet-edit.component.scss']
})
export class WalletEditComponent implements OnInit, OnDestroy {

    public get name() { return this.formGroup.get('name'); }
    public get website() { return this.formGroup.get('website'); }
    public get username() { return this.formGroup.get('username'); }
    public get password() { return this.formGroup.get('password'); }
    public get content() { return this.formGroup.get('content'); }
    public get workspace() { return this.formGroup.get('workspace'); }
    public get type() { return this.formGroup.get('type'); }
    public get note() { return this.formGroup.get('note'); }
    private get id() { return this.formGroup.get('id'); }
    private get iv() { return this.formGroup.get('iv'); }
    private get salt() { return this.formGroup.get('salt'); }

    public workspaces!: Workspace[];
    public formGroup: FormGroup;
    public viewToggle: boolean;
    public typeEnum = TypeEnum;

    private param?: Subscription;
    private workspaceList: Subscription;
    private paramId!: any;
    private oldPassword?: string;
    private oldContent?: string;

    constructor(private router: Router, private route: ActivatedRoute, private walletsService: WalletsService,
        private workspacesService: WorkspacesService, private translate: TranslateService, private snackBar: SnackBarService,
        private cryptographyService: CryptographyService, private settingsService: SettingsService,
        private utilsService: UtilsService, private dialog: MatDialog) {
        this.settingsService.isLoading = true;
        this.viewToggle = false;

        this.formGroup = new FormGroup({
            id: new FormControl(undefined),
            name: new FormControl(undefined, [Validators.required]),
            website: new FormControl(undefined, [Validators.required]),
            username: new FormControl(undefined),
            password: new FormControl(undefined, [Validators.required]),
            content: new FormControl(undefined, [Validators.required]),
            workspace: new FormControl(undefined, [Validators.required]),
            note: new FormControl(undefined),
            iv: new FormControl(undefined, [Validators.required]),
            salt: new FormControl(undefined, [Validators.required]),
            type: new FormControl(undefined, [Validators.required]),
        });

        // Check workspace list
        this.workspaceList = this.settingsService.onUpateWorkspacesEvent().subscribe(() => this.ngOnInit());
    }

    ngOnInit(): void {
        this.settingsService.isLoading = true;

        this.param = this.route.params.subscribe(data => {
            this.paramId = data['id'];
            const type = data['type'];

            if (type !== "undefined") {
                this.type?.disable();
            }

            firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
                this.workspaces = workspaces;

                if (this.paramId !== 'add') {
                    firstValueFrom(this.walletsService.getByIdAndType(this.paramId, type)).then(wallet => {
                        this.id?.setValue(wallet.id);
                        this.name?.setValue(wallet.name);
                        this.website?.setValue(wallet.website);
                        this.username?.setValue(wallet.username);
                        this.password?.setValue(wallet.passwd);
                        this.content?.setValue(wallet.content);
                        this.workspace?.setValue(workspaces.find(workspace => workspace.id === wallet.workspace.id));
                        this.type?.setValue(wallet.type);
                        this.note?.setValue(wallet.note);
                        this.iv?.setValue(wallet.iv);
                        this.salt?.setValue(wallet.salt);

                        this.valueChange(wallet.type);

                        this.oldPassword = wallet.passwd;
                        this.oldContent = wallet.content;
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("WALLET.ERROR.LOAD"), error);
                    }).then(() => this.settingsService.isLoading = false);
                } else {
                    this.iv?.setValidators(null);
                    this.iv?.setErrors(null);
                    this.salt?.setValidators(null);
                    this.salt?.setErrors(null);
                    this.settingsService.isLoading = false;
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.param?.unsubscribe();
        this.workspaceList.unsubscribe();
    }

    public valueChange(type: TypeEnum): void {
        if (type === TypeEnum.CREDENTIAL) {
            this.content?.setValidators(null);
            this.content?.setErrors(null);
            this.website?.setValidators(Validators.required);
            this.password?.setValidators(Validators.required);
        } else {
            this.content?.setValidators(Validators.required);
            this.website?.setValidators(null);
            this.website?.setErrors(null);
            this.password?.setValidators(null);
            this.password?.setErrors(null);
        }
    }

    public save(): void {
        const dialogRef = this.dialog.open(ConfirmMasterPasswordComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.utilsService.checkMasterPassword(result, this.saveWallet);
            }
        });
    }

    public addWorkspace(): void {
        const dialogRef = this.dialog.open(AddWorkspaceComponent, {
            disableClose: true
        });

        firstValueFrom(dialogRef.afterClosed()).then(result => {
            if (result) {
                this.settingsService.onUpdateWorkspaces.emit();
                this.ngOnInit();
            }
        });
    }

    private saveWallet = (masterPassword: string): void => {
        this.settingsService.isLoading = true;

        if (this.type?.value === TypeEnum.CREDENTIAL) {
            if (this.paramId !== "add" && this.oldPassword === this.password?.value) {
                this.saveInfo(this.password?.value, this.iv?.value, this.salt?.value);
            } else {
                this.encryptAndSave(this.password?.value, masterPassword);
            }
        } else {
            if (this.paramId !== "add" && this.oldContent === this.content?.value) {
                this.saveInfo(this.content?.value, this.iv?.value, this.salt?.value);
            } else {
                this.encryptAndSave(this.content?.value, masterPassword);
            }
        }
    }

    private encryptAndSave(data: string, masterPassword: string, iv: string | null = null, salt: string | null = null): void {
        this.cryptographyService.encrypt(data, masterPassword, iv, salt).then(payload => {
            this.saveInfo(payload.cipher, payload.iv, payload.salt);
        });
    }

    private saveInfo(cipher: string, iv: string, salt: string) {
        const wallet = new Wallet();

        wallet.id = this.id?.value;
        wallet.name = this.name?.value;
        wallet.website = this.website?.value;
        wallet.username = this.username?.value;
        wallet.passwd = this.type?.value === TypeEnum.CREDENTIAL ? cipher : this.password?.value;
        wallet.content = this.type?.value === TypeEnum.NOTE ? cipher : this.content?.value;
        wallet.workspace = this.workspace?.value;
        wallet.type = this.type?.value;
        wallet.note = this.note?.value;
        wallet.iv = iv;
        wallet.salt = salt;

        const action = wallet.id ? this.walletsService.update(wallet, wallet.type) : this.walletsService.save(wallet, wallet.type);
        const actionMessage = wallet.id ? "UPDATE" : "SAVE";

        firstValueFrom(action).then(data => {
            this.snackBar.success(this.translate.instant(`WALLET.${actionMessage}.SUCCESS`));
            this.router.navigate(['wallet', data?.id, "type", data.type.toLowerCase()]);
            this.ngOnInit();
        }).catch(error => {
            this.snackBar.error(this.translate.instant(`WALLET.${actionMessage}.ERROR`), error);
        }).then(() => this.settingsService.isLoading = false);
    }
}
