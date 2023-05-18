package com.fnd.virgo.service.impl;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fnd.virgo.model.KeycloakProfileNoPassword;
import com.fnd.virgo.model.KeycloakProfileRegistration;
import com.fnd.virgo.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.keycloak.representations.AccessTokenResponse;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Value("${keycloak.url}")
    private String keycloakUrl;
    @Value("${keycloak.realm}")
    private String keycloakRealm;
    @Value("${keycloak.admin.username}")
    private String keycloakAdminUsername;
    @Value("${keycloak.admin.password}")
    private String keycloakAdminPassword;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final ModelMapper modelMapper;

    public UserServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.modelMapper = new ModelMapper();
    }

    @Override
    public void save(KeycloakProfileRegistration keycloakProfileDTO) {
        String url = String.format("%s/admin/realms/%s/users", keycloakUrl, keycloakRealm);
        AccessTokenResponse adminToken = getAdminToken();
        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setBearerAuth(adminToken.getToken());
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        try {
            responseEntity(url, HttpMethod.POST, httpHeaders, modelMapper.map(keycloakProfileDTO, KeycloakProfileNoPassword.class));
        } catch (Exception e) {
            log.error("Error with user registration procedure");
            return;
        }

        // Send verify email automatically
        this.sendVerifyEmail(keycloakProfileDTO.getEmail());
    }

    @Override
    public void sendForgotPasswordEmail(String email) {
        AccessTokenResponse adminToken = getAdminToken();
        String userId;

        try {
            userId = getUserIdByEmail(email, adminToken);
        } catch (Exception e) {
            log.error("User not found");
            return;
        }

        // Send email to the user
        String url = String.format("%s/admin/realms/%s/users/%s/execute-actions-email", keycloakUrl, keycloakRealm, userId);
        HttpHeaders httpHeaders = new HttpHeaders();

        httpHeaders.setBearerAuth(adminToken.getToken());
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);

        try {
            responseEntity(url, HttpMethod.PUT, httpHeaders, "[\"UPDATE_PASSWORD\"]");
        } catch (Exception e) {
            log.error("Error to send email");
        }
    }

    @Override
    public void sendVerifyEmail(String email) {
        AccessTokenResponse adminToken = getAdminToken();
        String userId;

        try {
            userId = getUserIdByEmail(email, adminToken);
        } catch (Exception e) {
            log.error("User not found");
            return;
        }

        // Send verify email
        String urlSearchUser = String.format("%s/admin/realms/%s/users/%s/send-verify-email", keycloakUrl, keycloakRealm, userId);
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(adminToken.getToken());

        try {
            responseEntity(urlSearchUser, HttpMethod.PUT, httpHeaders, null);
        } catch (Exception e) {
            log.error("Error to send email");
        }
    }

    private AccessTokenResponse getAdminToken() {
        String url = String.format("%s/realms/master/protocol/openid-connect/token", keycloakUrl);
        HttpHeaders httpHeaders = new HttpHeaders();
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("client_id", "admin-cli");
        form.add("client_secret", "");
        form.add("username", keycloakAdminUsername);
        form.add("password", keycloakAdminPassword);
        form.add("grant_type", "password");
        form.add("scope", "openid");

        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        try {
            return responseEntity(url, HttpMethod.POST, httpHeaders, form, AccessTokenResponse.class);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token not acquired");
        }
    }

    @Nullable
    private String getUserIdByEmail(String email, @NotNull AccessTokenResponse adminToken) throws Exception {
        String url = String.format("%s/admin/realms/%s/users?email=%s&exact=true", keycloakUrl, keycloakRealm, email);
        JavaType mapType = objectMapper.getTypeFactory().constructParametricType(Map.class, String.class, Object.class);
        JavaType type = objectMapper.getTypeFactory().constructParametricType(List.class, mapType);
        List<Map<String, Object>> usersList;
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(adminToken.getToken());

        try {
            usersList = responseEntity(url, HttpMethod.GET, httpHeaders, null, type);
        } catch (Exception e) {
            throw new Exception("User not found");
        }

        if (usersList.size() == 0) {
            throw new Exception("User not found");
        }

        return usersList.get(0).get("id").toString();
    }

    private <T> T responseEntity(String url, HttpMethod httpMethod, HttpHeaders httpHeaders, Object form) throws Exception {
        return responseEntity(url, httpMethod, httpHeaders, form, (Class<T>) null);
    }

    @Nullable
    private <T> T responseEntity(String url, HttpMethod httpMethod, HttpHeaders httpHeaders, Object form, Class<T> clazz) throws Exception {
        ResponseEntity<String> response = getStringResponseEntity(url, httpMethod, httpHeaders, form);

        if (response.hasBody() && clazz != null)
            return objectMapper.readValue(response.getBody(), clazz);

        return null;
    }

    private <T> T responseEntity(String url, HttpMethod httpMethod, HttpHeaders httpHeaders, Object form, JavaType type) throws Exception {
        ResponseEntity<String> response = getStringResponseEntity(url, httpMethod, httpHeaders, form);
        return objectMapper.readValue(response.getBody(), type);
    }

    @NotNull
    private ResponseEntity<String> getStringResponseEntity(String url, HttpMethod httpMethod, HttpHeaders httpHeaders, Object form) throws Exception {
        HttpEntity<Object> request = new HttpEntity<>(form, httpHeaders);
        ResponseEntity<String> response = restTemplate.exchange(url, httpMethod, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new Exception("Failed request");
        }

        return response;
    }
}
