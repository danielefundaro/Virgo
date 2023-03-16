package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WalletDTO extends EncryptCommonFieldsDTO {
    private String type;
    private String website;
    private String username;
    private String passwd;
    private String content;
    private String note;
}
