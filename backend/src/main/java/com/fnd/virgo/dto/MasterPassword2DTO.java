package com.fnd.virgo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class MasterPassword2DTO extends MasterPasswordDTO {
    @JsonProperty(value = "wallet")
    private List<WalletBasicDTO> walletBasicDTOList;
}
