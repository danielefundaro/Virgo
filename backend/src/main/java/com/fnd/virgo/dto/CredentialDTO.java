package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CredentialDTO extends CommonFieldsDTO {
    private String website;
    private String username;
    private String encryptPassword;
    private String salt;
}
