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
export abstract class CommonService<T extends CommonFields | EncryptCommonFields> {

    constructor(private http: HttpClient) { }

    abstract baseApi(): string;

    public getById(id: number): Observable<T> {
        return this.http.get<T>(`${environment.backendUrl}/${this.baseApi()}/${id}`);
    }

    public getAll(): Observable<Array<T>> {
        return this.http.get<Array<T>>(`${environment.backendUrl}/${this.baseApi()}/`);
    }

    public save(t: T): Observable<T> {
        return this.http.post<T>(`${environment.backendUrl}/${this.baseApi()}/`, t);
    }

    public update(t: T): Observable<T> {
        return this.http.put<T>(`${environment.backendUrl}/${this.baseApi()}/`, t);
    }

    public delete(id: number): Observable<T> {
        return this.http.delete<T>(`${environment.backendUrl}/${this.baseApi()}/${id}`);
    }

    public search(queryPagination: Searcher): Observable<Page<T>> {
        return this.http.post<Page<T>>(`${environment.backendUrl}/${this.baseApi()}/searcher`, queryPagination);
    }

    protected get getBaseUrl(): string { return `${environment.backendUrl}/${this.baseApi()}`; }
}