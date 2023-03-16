import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.dev";
import { Page, Searcher } from "../models";
import { CommonFields } from "../models/commonFields.model";
import { EncryptCommonFields } from "../models/encryptCommonFields.model";

@Injectable({
    providedIn: 'root'
})
export abstract class BasicService<T extends CommonFields | EncryptCommonFields> {

    constructor(protected http: HttpClient) { }

    abstract baseApi(): string;

    public getAll(): Observable<Array<T>> {
        return this.http.get<Array<T>>(`${environment.backendUrl}/${this.baseApi()}/`);
    }

    public search(queryPagination: Searcher): Observable<Page<T>> {
        return this.http.post<Page<T>>(`${environment.backendUrl}/${this.baseApi()}/searcher`, queryPagination);
    }

    protected get getBaseUrl(): string { return `${environment.backendUrl}/${this.baseApi()}`; }
}