import { EventEmitter, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subject, firstValueFrom } from "rxjs";
import { CryptographyService, MasterPasswordService } from "../auth/services";
import { SnackBarService } from "./snack-bar.service";

export class Search {
    value: string = "";
    onSearchChanged: EventEmitter<string> = new EventEmitter<string>();
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private _languageChanged = new Subject<string>();
    private _loadingChanged = new Subject<boolean>();
    private _updateWorkspaces: EventEmitter<void> = new EventEmitter();
    private _search: Search = new Search();
    private _languages: string[] = ['it', 'en'];
    private _isDarkTheme: boolean = !!localStorage.getItem("darkTheme") && localStorage.getItem("darkTheme") === "true" || !localStorage.getItem("darkTheme") && window.matchMedia("(prefers-color-scheme: dark)").matches;

    public get languages(): string[] { return this._languages; }
    public get default(): string {
        const current = localStorage.getItem("currentLang") || this._languages[0];
        this._languageChanged.next(current);
        return current;
    }
    public set currentLang(lang: string) {
        this._languageChanged.next(lang);
        localStorage.setItem("currentLang", lang);
    }
    public get isDarkTheme(): boolean { return this._isDarkTheme; }
    public set isLoading(value: boolean) { this._loadingChanged.next(value); }
    public get onUpdateWorkspaces(): EventEmitter<void> { return this._updateWorkspaces; }
    public get onSearchChanged(): EventEmitter<string> { return this._search.onSearchChanged; }
    public get search(): string { return this._search.value; }
    public set search(value: string) {
        this._search.value = value;
        this._search.onSearchChanged.emit(value);
    }

    constructor(private cryptographyService: CryptographyService, private masterPasswordService: MasterPasswordService,
        private snackBar: SnackBarService, private translate: TranslateService) { }

    public languageChanged(): Observable<string> {
        return this._languageChanged.asObservable();
    }

    public loadStateChanged(): Observable<boolean> {
        return this._loadingChanged.asObservable();
    }

    public toggleTheme(): boolean {
        this._isDarkTheme = !this._isDarkTheme;
        this.setDefalutTheme();
        localStorage.setItem("darkTheme", String(this._isDarkTheme));
        return this._isDarkTheme;
    }

    public setDefalutTheme(): void {
        document.body.classList.toggle('darkTheme', this._isDarkTheme);
    }

    public onUpateWorkspacesEvent(): Observable<void> {
        return this._updateWorkspaces.asObservable();
    }

    public checkMasterPassword(password: string, callback: () => void): void {
        firstValueFrom(this.masterPasswordService.get()).then(data => {
            this.cryptographyService.hash(password, data.salt).then(result => {
                if (data.hashPasswd === result.hash) {
                    callback();
                } else {
                    this.snackBar.error(this.translate.instant("MASTER_PASSWORD.NOT_VALID"));
                }
            }).catch((error: any) => {
                this.snackBar.error(this.translate.instant("MASTER_PASSWORD.HASH.ERROR"));
            });
        }).catch(error => {
            this.snackBar.error(this.translate.instant("MASTER_PASSWORD.GET.ERROR"), error);
        });
    }
}
