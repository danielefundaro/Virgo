import { EventEmitter, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

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
    public get onSearchChanged(): EventEmitter<string> { return this._search.onSearchChanged; }
    public get search(): string { return this._search.value; }
    public set search(value: string) {
        this._search.value = value;
        this._search.onSearchChanged.emit(value);
    }

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
}
