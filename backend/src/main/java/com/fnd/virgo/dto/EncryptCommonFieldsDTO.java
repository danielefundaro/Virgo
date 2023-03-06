package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EncryptCommonFieldsDTO extends CommonFieldsDTO {
    private String salt;
    private String iv;
    private WorkspaceDTO workspace;
}
