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
@Where(clause = "deleted = false")
public class Audit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;
    @Column(name = "user_id", nullable = false)
    private String userId;
    @Column(name = "date", nullable = false)
    private Date date = new Date();
    @Column(name = "type", length = 50, nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditTypeEnum type;
    @Column(name = "table_name", nullable = false)
    private String tableName;
    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    private String description;
    @OneToMany(mappedBy = "audit", cascade = CascadeType.ALL)
    private List<AuditTuple> tuples;
}
