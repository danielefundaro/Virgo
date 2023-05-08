import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private keycloakService: KeycloakService, private http: HttpClient) { }

    public getLoggedUser(): KeycloakTokenParsed | undefined {
        try {
            return this.keycloakService.getKeycloakInstance().idTokenParsed;
        } catch (e) {
            return undefined;
        }
    }

    public isLoggedIn(): Promise<boolean> {
        return this.keycloakService.isLoggedIn();
    }

    public loadUserProfile(): Promise<KeycloakProfile> {
        return this.keycloakService.loadUserProfile();
    }

    public updateToken(): Promise<boolean> {
        return this.keycloakService.updateToken();
    }

    public isTokenExpired(): boolean {
        return this.keycloakService.isTokenExpired();
    }

    public login(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.backendUrl}/auth/login`, { username, password, "grant_type": "password"});
    }

    public logout(): void {
        this.keycloakService.clearToken();
        this.keycloakService.logout(window.location.origin);
    }

    public redirectToProfile(): void {
        this.keycloakService.getKeycloakInstance().accountManagement();
    }

    public getRoles(): string[] {
        return this.keycloakService.getUserRoles();
    }
}
