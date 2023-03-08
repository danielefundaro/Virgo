(function(windows){
    window.env = window.env || {};

    // Environment variables
    window.env.backendUrl = "${BACKEND_URL}";
    window.env.keycloakUrl = "${KEYCLOAK_URL}";
    window.env.realmName = "${REALM_NAME}";
    window.env.clientId = "${CLIENT_ID}";
})(this);