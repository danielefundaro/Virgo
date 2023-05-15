import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, firstValueFrom, of, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.dev';
import { KeycloakProfile, KeycloakToken } from '../models';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient) { }

    public getAuthToken(): KeycloakToken | null {
        const token = localStorage.getItem("token");

        if (token) {
            return JSON.parse(token);
        }

        return null;
    }

    public setAuthToken(token: KeycloakToken): void {
        this.clearAuthToken();

        localStorage.setItem("token", JSON.stringify(token));
    }

    public clearAuthToken(): void {
        if (localStorage.getItem("token")) {
            localStorage.removeItem("token");
        }
    }

    public async updateToken(): Promise<boolean> {
        const refresh$ = this.refreshToken().pipe(switchMap((token) => {
            this.setAuthToken(token);
            return Promise.resolve(true);
        }), catchError(() => Promise.resolve(false)));

        return firstValueFrom(refresh$);
    }

    public isTokenExpired(): boolean {
        return false;
    }

    public isLoggedIn(): boolean {
        const token = this.getAuthToken();
        return !!token;
    }

    public loadUserProfile(): Promise<KeycloakProfile> {
        return Promise.resolve({ id: "", username: "", email: "email@email.com" });
    }

    public login(username: string, password: string): Observable<KeycloakToken> {
        const payload = new HttpParams()
            .set("username", username)
            .set("password", password)
            .set("grant_type", "password");

        return this.http.post<KeycloakToken>(`${environment.backendUrl}/auth/login`, payload);
    }

    public refreshToken(): Observable<KeycloakToken> {
        const token = this.getAuthToken();

        if (token) {
            const payload = new HttpParams()
                .set("refresh_token", token.refresh_token)
                .set("grant_type", "refresh_token");
            return this.http.post<KeycloakToken>(`${environment.backendUrl}/auth/token`, payload);
        }

        return throwError(() => new HttpErrorResponse({ status: 403, error: "Token is not exists" }));
    }

    public logout(): Observable<void> {
        const token = this.getAuthToken();

        if (token) {
            const payload = new HttpParams().set("refresh_token", token.refresh_token);
            return this.http.post<void>(`${environment.backendUrl}/auth/logout`, payload);
        }

        return throwError(() => new HttpErrorResponse({ status: 403, error: "Token is not exists" }));
    }

    public redirectToProfile(): void {
    }

    public getRoles(): string[] {
        return [];
    }
}
