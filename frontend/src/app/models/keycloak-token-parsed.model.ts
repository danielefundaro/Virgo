export interface KeycloakTokenParsed {
	iss?: string;
	sub?: string;
	aud?: string;
	exp?: number;
	iat?: number;
	auth_time?: number;
	nonce?: string;
	acr?: string;
	amr?: string;
	azp?: string;
	session_state?: string;
	realm_access?: KeycloakRoles;
	resource_access?: KeycloakResourceAccess;
	[key: string]: any; // Add other attributes here.
}

interface KeycloakResourceAccess {
	[key: string]: KeycloakRoles
}

interface KeycloakRoles {
	roles: string[];
}