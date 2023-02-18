package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CredentialCoreDTO extends EncryptCommonFieldsCoreDTO {
    private String website;
    private String username;
    private String passwd;
}
