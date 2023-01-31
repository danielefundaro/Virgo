package com.fnd.virgo.entity;

import com.fnd.virgo.enums.AuditTypeEnum;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "audit")
@Where(clause = "deleted <> 1")
public class Audit extends CommonFields {
    @Column(name = "user_id", length = 255, nullable = false)
    private String userId;
    @Column(name = "date", nullable = false)
    private Date date;
    @Column(name = "type", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditTypeEnum type;
    @Column(name = "table_name", length = 255, nullable = false)
    private String tableName;
    @OneToMany(mappedBy = "audit", cascade = CascadeType.ALL)
    private List<AuditTuple> tuples;
}
