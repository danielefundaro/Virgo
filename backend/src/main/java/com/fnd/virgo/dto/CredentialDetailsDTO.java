package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CredentialDetailsDTO extends EncryptCommonFieldsDTO {
    private String website;
    private String username;
    private String passwd;
    private WorkspaceDTO workspace;
}
