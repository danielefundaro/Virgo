package com.fnd.virgo.config;

import com.fnd.virgo.dto.MasterPasswordDTO;
import com.fnd.virgo.error.MyResponseStatusException;
import com.fnd.virgo.error.enums.ErrorCode;
import com.fnd.virgo.model.KeycloakUser;
import com.fnd.virgo.service.KeycloakService;
import com.fnd.virgo.service.MasterPasswordService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class CustomInterceptor implements HandlerInterceptor {
    private final KeycloakService keycloakService;
    private final MasterPasswordService masterPasswordService;

    public CustomInterceptor(KeycloakService keycloakService, MasterPasswordService masterPasswordService) {
        this.keycloakService = keycloakService;
        this.masterPasswordService = masterPasswordService;
    }

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) {
        String token = request.getHeader("Authorization");

        if (token == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "invalid token");
        }

        KeycloakUser keycloakUser = keycloakService.tokenIsActive(token);

        if (!keycloakUser.isActive())
            throw new MyResponseStatusException(HttpStatus.UNAUTHORIZED, ErrorCode.TOKEN_EXPIRED, "token expired");

        MasterPasswordDTO masterPasswordDTO = masterPasswordService.getByUserId(keycloakUser.getId());

        if (masterPasswordDTO == null || masterPasswordDTO.getHashPasswd() == null || masterPasswordDTO.getHashPasswd().isBlank())
            throw new MyResponseStatusException(HttpStatus.CONFLICT, ErrorCode.MASTER_PASSWORD_MISSING, "Must set master password");

        return true;
    }
}
