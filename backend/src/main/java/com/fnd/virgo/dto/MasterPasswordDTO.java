package com.fnd.virgo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class MasterPasswordDTO {
    private Long id;
    private String userId;
    private String hashPasswd;
    private String salt;
}
