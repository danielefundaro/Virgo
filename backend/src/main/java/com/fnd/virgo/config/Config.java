package com.fnd.virgo.config;

import com.fnd.virgo.service.KeycloakService;
import com.fnd.virgo.service.MasterPasswordService;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class Config implements WebMvcConfigurer {
    private final KeycloakService keycloakService;
    private final MasterPasswordService masterPasswordService;

    public Config(KeycloakService keycloakService, MasterPasswordService masterPasswordService) {
        this.keycloakService = keycloakService;
        this.masterPasswordService = masterPasswordService;
    }

    @Override
    public void addInterceptors(@NotNull InterceptorRegistry registry) {
        InterceptorRegistration registration = registry.addInterceptor(new CustomInterceptor(keycloakService, masterPasswordService))
                .excludePathPatterns("/error", "/master-password", "/master-password/");

        for (PermitRequest request : PermitRequest.values()) {
            registration = registration.excludePathPatterns(request.toString());
        }

        registration.addPathPatterns("/**");
    }
}
