import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormRecord, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { SettingsService, SnackBarService } from 'src/app/services';
import { TypeEnum, Wallet, Workspace } from '../../models';
import { WalletsService, WorkspacesService } from '../../services';

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

    constructor(private router: Router, private route: ActivatedRoute, private walletsService: WalletsService,
        private workspacesService: WorkspacesService, private translate: TranslateService, private snackBar: SnackBarService,
        private settingsService: SettingsService) {
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
    }

    ngOnInit(): void {
        this.param = this.route.params.subscribe(data => {
            const id = data['id'];
            const type = data['type'];

            if (type !== "undefined") {
                this.type?.disable();
            }

            firstValueFrom(this.workspacesService.getAll()).then(workspaces => {
                this.workspaces = workspaces;

                if (id !== 'add') {
                    firstValueFrom(this.walletsService.getByIdAndType(id, type)).then(wallet => {
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
                    }).catch(error => {
                        this.snackBar.error(this.translate.instant("WALLET.ERROR.LOAD"), error);
                    }).then(() => this.settingsService.isLoading = false);
                } else {
                    this.iv?.setValue(crypto.randomUUID().replaceAll("-", ""));
                    this.salt?.setValue(crypto.randomUUID().replaceAll("-", ""));
                    this.settingsService.isLoading = false;
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.param?.unsubscribe();
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
        const wallet = new Wallet();

        wallet.id = this.id?.value;
        wallet.name = this.name?.value;
        wallet.website = this.website?.value;
        wallet.username = this.username?.value;
        wallet.passwd = this.password?.value;
        wallet.content = this.content?.value;
        wallet.workspace = this.workspace?.value;
        wallet.type = this.type?.value;
        wallet.note = this.note?.value;
        wallet.iv = this.iv?.value;
        wallet.salt = this.salt?.value;

        this.settingsService.isLoading = true;

        const action = wallet.id ? this.walletsService.update(wallet, wallet.type) : this.walletsService.save(wallet, wallet.type);
        const actionMessage = wallet.id ? "UPDATE" : "SAVE";

        firstValueFrom(action).then(data => {
            this.snackBar.success(this.translate.instant(`WALLET.${actionMessage}.SUCCESS`));
            this.router.navigate(['wallet', data?.id, "type", data.type.toLowerCase()]);
        }).catch(error => {
            this.snackBar.error(this.translate.instant(`WALLET.${actionMessage}.ERROR`), error);
        }).then(() => this.settingsService.isLoading = false);
    }
}
