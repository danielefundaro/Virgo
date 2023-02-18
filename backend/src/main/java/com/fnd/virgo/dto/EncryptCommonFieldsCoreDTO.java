package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EncryptCommonFieldsCoreDTO extends CommonFieldsDTO {
    private String salt;
    private String iv;
}
