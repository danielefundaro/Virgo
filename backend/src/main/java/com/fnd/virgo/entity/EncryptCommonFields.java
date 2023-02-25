package com.fnd.virgo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@MappedSuperclass
public class EncryptCommonFields extends CommonFields {
    @Column(name = "salt", nullable = false)
    private String salt;
    @Column(name = "iv", nullable = false)
    private String iv;
    @ManyToOne()
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;
}
