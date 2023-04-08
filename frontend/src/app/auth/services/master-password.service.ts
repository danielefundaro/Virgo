import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MasterPassword } from "../models";
import { environment } from "src/environments/environment.dev";

@Injectable({
    providedIn: 'root'
})
export class MasterPasswordService {

    constructor(private http: HttpClient) { }
    
    public get(): Observable<MasterPassword> {
        return this.http.get<MasterPassword>(`${environment.backendUrl}/master-password/`);
    }
    
    public save(masterPassword: MasterPassword): Observable<MasterPassword> {
        return this.http.post<MasterPassword>(`${environment.backendUrl}/master-password/`, masterPassword);
    }
    
    public update(masterPassword: MasterPassword): Observable<MasterPassword> {
        return this.http.put<MasterPassword>(`${environment.backendUrl}/master-password/`, masterPassword);
    }
}