export const environment = {
    backendUrl: (window as any).env.backendUrl || "http://localhost:9090",
    keycloak: {
        baseurl: (window as any).env.keycloakUrl || "http://localhost:8080",
        realmName: (window as any).env.realmName || "virgo-realm",
        clientId: (window as any).env.clientId || "virgo-login-app",
    }
};
