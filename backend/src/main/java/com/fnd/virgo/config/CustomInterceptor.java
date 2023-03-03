package com.fnd.virgo.config;

import com.fnd.virgo.service.KeycloakService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@Slf4j
public class CustomInterceptor implements HandlerInterceptor {
    private final KeycloakService keycloakService;

    public CustomInterceptor(KeycloakService keycloakService) {
        this.keycloakService = keycloakService;
    }

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull Object handler) {
        String token = request.getHeader("Authorization");

        if (token != null) {
            boolean isActive = keycloakService.tokenIsActive(token);

            if (!isActive)
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "");
        }

        return true;
    }
}
