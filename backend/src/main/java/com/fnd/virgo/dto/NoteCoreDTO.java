package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class NoteCoreDTO extends EncryptCommonFieldsCoreDTO {
    private String content;
}