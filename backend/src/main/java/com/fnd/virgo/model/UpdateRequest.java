package com.fnd.virgo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fnd.virgo.dto.CommonFieldsDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UpdateRequest<D extends CommonFieldsDTO> {
    @JsonProperty(value = "old", required = true)
    private D oldInfo;
    @JsonProperty(value = "new", required = true)
    private D newInfo;
}
