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
@Table(name = "wallets")
@Where(clause = "deleted = false")
public class Wallet extends EncryptCommonFields {
    @Column(name = "type", nullable = false)
    private String type;
    @Column(name = "website")
    private String website;
    @Column(name = "username")
    private String username;
    @Column(name = "passwd")
    private String passwd;
    @Column(name = "content")
    private String content;
    @Column(name = "note")
    private String note;
}
