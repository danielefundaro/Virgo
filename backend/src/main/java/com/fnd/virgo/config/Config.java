package com.fnd.virgo.config;

import com.fnd.virgo.service.KeycloakService;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@RequiredArgsConstructor
@Component
public class Config implements WebMvcConfigurer {
    private final KeycloakService keycloakService;
    @Override
    public void addInterceptors(@NotNull InterceptorRegistry registry) {
        registry.addInterceptor(new CustomInterceptor(keycloakService)).addPathPatterns("/**");
    }
}
