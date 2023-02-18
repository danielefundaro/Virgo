package com.fnd.virgo.entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "notes")
@Where(clause = "deleted = false")
public class Note extends EncryptCommonFields {
    @Column(name = "content", nullable = false)
    private String content;
    @ManyToOne()
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
}
