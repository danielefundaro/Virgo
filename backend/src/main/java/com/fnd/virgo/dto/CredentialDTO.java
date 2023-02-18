package com.fnd.virgo.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CredentialDTO extends EncryptCommonFieldsDTO {
    private String website;
    private String username;
    private String passwd;
}
