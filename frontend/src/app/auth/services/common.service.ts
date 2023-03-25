import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment.dev";
import { CommonFields } from "../models/commonFields.model";
import { EncryptCommonFields } from "../models/encryptCommonFields.model";
import { BasicService } from "./basic.service";

@Injectable({
    providedIn: 'root'
})
export abstract class CommonService<T extends CommonFields | EncryptCommonFields> extends BasicService<T> {

    constructor(http: HttpClient) { super(http); }

    public getById(id: number): Observable<T> {
        return this.http.get<T>(`${environment.backendUrl}/${this.baseApi()}/${id}`);
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
}