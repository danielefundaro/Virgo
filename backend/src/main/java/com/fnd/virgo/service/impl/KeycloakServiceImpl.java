package com.fnd.virgo.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fnd.virgo.service.KeycloakService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.keycloak.authorization.client.representation.TokenIntrospectionResponse;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class KeycloakServiceImpl implements KeycloakService {
    @Value("${spring.security.oauth2.client.provider.keycloak.issuer-uri}")
    private String keycloakIssuerUri;
    @Value("${spring.security.oauth2.client.registration.keycloak.client-id}")
    private String clientId;
    @Value("${keycloak.realm.client-secret:}")
    private String clientSecret;
    @Value("${spring.security.oauth2.client.provider.keycloak.token-uri}")
    private String keycloakTokenUri;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public KeycloakServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public AccessTokenResponse login(String username, String password, String grantType) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("username", username);
        form.add("password", password);
        form.add("grant_type", grantType);
        form.add("score", "openid");

        return getAccessToken(form);
    }

    @Override
    public void logout(String token, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String url = String.format("%s/protocol/openid-connect/logout", keycloakIssuerUri);
        HttpHeaders httpHeaders = new HttpHeaders();
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("refresh_token", token);
        httpHeaders.setBearerAuth(jwtAuthenticationToken.getToken().getTokenValue());

        ResponseEntity<String> response = postResponseEntity(url, httpHeaders, form);

        if (response.getStatusCode().is2xxSuccessful()) {
            log.info("Successfully logged out from Keycloak");
        } else {
            log.error("Could not propagate logout to Keycloak");
        }
    }

    @Override
    public AccessTokenResponse refreshToken(String token, String grantType) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("refresh_token", token);
        form.add("grant_type", grantType);

        return getAccessToken(form);
    }

    @Override
    public boolean tokenIsActive(String accessToken) {
        String url = String.format("%s/introspect", keycloakTokenUri);
        HttpHeaders httpHeaders = new HttpHeaders();
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        boolean isActive = false;

        form.add("token", accessToken.replace("Bearer ", ""));
        httpHeaders.setBasicAuth(clientId, clientSecret);

        ResponseEntity<String> response = postResponseEntity(url, httpHeaders, form);

        if (response.getStatusCode().is2xxSuccessful() && response.hasBody()) {
            try {
                TokenIntrospectionResponse tokenIntrospectionResponse = objectMapper.readValue(response.getBody(), TokenIntrospectionResponse.class);
                Map<?, ?> realmAccess = (Map<?, ?>) tokenIntrospectionResponse.getOtherClaims().get("realm_access");
                List<?> roles = new ArrayList<>();

                if (realmAccess != null)
                    roles = (List<?>) realmAccess.get("roles");

                isActive = tokenIntrospectionResponse.getActive() && !roles.isEmpty() && roles.contains("user");
            } catch (JsonProcessingException e) {
                return false;
            }
        }

        log.trace(String.format("Token is active %s", isActive));
        return isActive;
    }

    private AccessTokenResponse getAccessToken(MultiValueMap<String, String> form) {
        ResponseEntity<String> response = postResponseEntity(keycloakTokenUri, new HttpHeaders(), form);

        if (!response.getStatusCode().is2xxSuccessful() || !response.hasBody()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token not acquired");
        }

        try {
            return objectMapper.readValue(response.getBody(), AccessTokenResponse.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token not acquired");
        }
    }

    @NotNull
    private ResponseEntity<String> postResponseEntity(String url, @NotNull HttpHeaders httpHeaders, MultiValueMap<String, String> form) {
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, httpHeaders);
        try {
            return restTemplate.exchange(url, HttpMethod.POST, request, String.class);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(e.getStatusCode(), e.getResponseBodyAsString());
        }
    }
}
