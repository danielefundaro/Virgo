package com.fnd.virgo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
public class AuditTupleDTO extends CommonFieldsDTO {
    private Date date;
    private Long tupleId;
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private AuditDTO audit;
}
