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
@Table(name = "credentials")
@Where(clause = "deleted = false")
public class Credential extends EncryptCommonFields {
    @Column(name = "website", nullable = false)
    private String website;
    @Column(name = "username")
    private String username;
    @Column(name = "passwd", nullable = false)
    private String passwd;
    @ManyToOne()
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;
}
