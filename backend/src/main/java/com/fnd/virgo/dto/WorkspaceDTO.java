package com.fnd.virgo.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class WorkspaceDTO extends CommonFieldsDTO {
    @JsonIgnore
    List<CredentialDTO> credentials;
    @JsonIgnore
    List<NoteDTO> notes;
}
