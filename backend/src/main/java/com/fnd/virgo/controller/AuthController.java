package com.fnd.virgo.controller;

import com.fnd.virgo.config.PermitRequest;
import com.fnd.virgo.service.KeycloakService;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "auth")
@Validated
public class AuthController {
    private final KeycloakService keycloakService;

    public AuthController(KeycloakService keycloakService) {
        this.keycloakService = keycloakService;
    }

    @PostMapping(value = {PermitRequest.LOGIN_REQUEST}, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public AccessTokenResponse login(@RequestParam String username, @RequestParam String password, @RequestParam("grant_type") String grantType) {
        return keycloakService.login(username, password, grantType);
    }

    @PostMapping(value = "/logout", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public void logout(@RequestParam("refresh_token") String token, JwtAuthenticationToken jwtAuthenticationToken) {
        keycloakService.logout(token, jwtAuthenticationToken);
    }

    @PostMapping(value = {PermitRequest.REFRESH_TOKEN_REQUEST}, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    public AccessTokenResponse refreshToken(@RequestParam("refresh_token") String token, @RequestParam("grant_type") String grantType) {
        return keycloakService.refreshToken(token, grantType);
    }
}
