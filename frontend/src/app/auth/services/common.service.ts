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

    public getById(id: number): Observable<T> {
        return super.http.get<T>(`${environment.backendUrl}/${this.baseApi()}/${id}`);
    }

    public save(t: T): Observable<T> {
        return super.http.post<T>(`${environment.backendUrl}/${this.baseApi()}/`, t);
    }

    public update(t: T): Observable<T> {
        return super.http.put<T>(`${environment.backendUrl}/${this.baseApi()}/`, t);
    }

    public delete(id: number): Observable<T> {
        return super.http.delete<T>(`${environment.backendUrl}/${this.baseApi()}/${id}`);
    }
}