package com.fnd.virgo.controller;

import com.fnd.virgo.config.PermitRequest;
import com.fnd.virgo.model.KeycloakProfileRegistration;
import com.fnd.virgo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping(value = "users")
@Validated
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object get(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
    }

    @PostMapping(value = {PermitRequest.USER_SAVE_REQUEST}, consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private void save(@RequestBody KeycloakProfileRegistration keycloakUserRegistrationDTO) {
        this.userService.save(keycloakUserRegistrationDTO);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object update(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
    }

    @PutMapping(value = {PermitRequest.FORGOT_PASSWORD_REQUEST}, consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    private void sendForgotPasswordEmail(@RequestParam String email) {
        this.userService.sendForgotPasswordEmail(email);
    }

    @PatchMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object patch(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object delete(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
    }
}
