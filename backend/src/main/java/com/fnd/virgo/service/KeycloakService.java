package com.fnd.virgo.service;

import org.keycloak.representations.AccessTokenResponse;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface KeycloakService {
    AccessTokenResponse login(String username, String password, String grantType);

    void logout(String refreshToken, JwtAuthenticationToken jwtAuthenticationToken);

    AccessTokenResponse refreshToken(String token, String grantType);

    boolean tokenIsActive(String accessToken);
}
