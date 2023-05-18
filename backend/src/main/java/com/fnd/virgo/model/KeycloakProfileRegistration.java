package com.fnd.virgo.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class KeycloakProfileRegistration {
    private String email;
    private String firstName;
    private String lastName;
    private String username;
    private String password;
    private boolean enabled = true;
    private boolean emailVerified = false;
    private boolean totp = false;
    private String[] realmRoles = {"default-roles-virgo-realm"};
}
