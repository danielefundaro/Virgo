package com.fnd.virgo.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "wallet")
@Where(clause = "deleted = false")
public class Wallet extends EncryptCommonFields {
    @Column(name = "type", nullable = false)
    private String type;
    @Column(name = "website", length = Integer.MAX_VALUE)
    private String website;
    @Column(name = "username", length = Integer.MAX_VALUE)
    private String username;
    @Column(name = "passwd", length = Integer.MAX_VALUE)
    private String passwd;
    @Column(name = "content", length = Integer.MAX_VALUE)
    private String content;
    @Column(name = "note", length = Integer.MAX_VALUE)
    private String note;
}
