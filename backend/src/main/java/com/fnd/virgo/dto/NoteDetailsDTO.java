package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NoteDetailsDTO extends EncryptCommonFieldsDTO {
    private String content;
    private WorkspaceDTO workspace;
}
