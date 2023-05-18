package com.fnd.virgo.service;

import com.fnd.virgo.model.KeycloakProfileRegistration;

public interface UserService {

    void save(KeycloakProfileRegistration keycloakUserRegistrationDTO);

    void sendForgotPasswordEmail(String email);

    void sendVerifyEmail(String email);
}
