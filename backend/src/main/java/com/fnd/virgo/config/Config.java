package com.fnd.virgo.config;

import com.fnd.virgo.service.KeycloakService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Component
public class Config implements WebMvcConfigurer {
    private final KeycloakService keycloakService;

    @Autowired
    public Config(KeycloakService keycloakService) {
        this.keycloakService = keycloakService;
    }

    @Override
    public void addInterceptors(@NotNull InterceptorRegistry registry) {
        registry.addInterceptor(new CustomInterceptor(keycloakService))
                .excludePathPatterns("/error")
                .addPathPatterns("/**");
    }
}
