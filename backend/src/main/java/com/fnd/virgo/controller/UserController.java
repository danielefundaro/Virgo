package com.fnd.virgo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "users")
@Validated
public class UserController {
    @GetMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object get(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object save(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private Object update(JwtAuthenticationToken jwtAuthenticationToken) {
        return null;
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
