package com.fnd.virgo.dto;

import com.fnd.virgo.enums.AuditTypeEnum;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AuditDTO extends CommonFieldsDTO {
    private Date date;
    @Enumerated(EnumType.STRING)
    private AuditTypeEnum type;
    private String userId;
    private String tableName;
    private List<AuditTupleDTO> tuples;
}
