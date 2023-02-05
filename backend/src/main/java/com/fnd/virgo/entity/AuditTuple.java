package com.fnd.virgo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "audit_tuple")
@Where(clause = "deleted = false")
public class AuditTuple extends CommonFields {
    @Column(name = "date", nullable = false)
    private Date date = new Date();
    @Column(name = "tuple_id", nullable = false)
    private Long tupleId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "audit_id", nullable = false)
    private Audit audit;

}
