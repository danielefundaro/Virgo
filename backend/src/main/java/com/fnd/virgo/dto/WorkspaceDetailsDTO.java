package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class WorkspaceDetailsDTO extends CommonFieldsDTO {
    List<CredentialDTO> credentials;
    List<NoteDTO> notes;
}
