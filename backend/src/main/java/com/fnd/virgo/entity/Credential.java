package com.fnd.virgo.entity;


import com.fnd.virgo.model.TypeEnum;
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
@Where(clause = "deleted = false and type = 'CREDENTIAL'")
public class Credential extends EncryptCommonFields {
    @Column(name = "type", nullable = false, updatable = false)
    private String type = TypeEnum.CREDENTIAL.name();
    @Column(name = "website", nullable = false)
    private String website;
    @Column(name = "username")
    private String username;
    @Column(name = "passwd", nullable = false)
    private String passwd;
    @Column(name = "note")
    private String note;
}
