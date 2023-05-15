export interface KeycloakToken {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    not_before_policy?: number;
    session_state: string;
    otherClaims?: Map<string, any>;
    scope: string;
    error?: string;
    error_description?: string;
    error_uri?: string;
}