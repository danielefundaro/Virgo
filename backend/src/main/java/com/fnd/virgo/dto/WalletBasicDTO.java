package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class WalletBasicDTO {
    private Long id;
    private String type;
    private String info;
    private String salt;
    private String iv;
}
