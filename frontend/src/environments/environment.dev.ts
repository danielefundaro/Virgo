export const environment = {
    backendUrl: (window as any).env.backendUrl,
    keycloak: {
        baseUrl: (window as any).env.keycloakUrl,
        realmName: (window as any).env.realmName,
        clientId: (window as any).env.clientId,
    }
};
