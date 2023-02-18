package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class WorkspaceDTO extends CommonFieldsDTO {
    List<CredentialCoreDTO> credentials;
    List<NoteCoreDTO> notes;
}
