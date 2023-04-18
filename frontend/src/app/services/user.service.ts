import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile, KeycloakTokenParsed } from 'keycloak-js';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private keycloakService: KeycloakService) { }

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

    public login(): void {
        this.keycloakService.login();
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
