package com.fnd.virgo.entity;


import com.fnd.virgo.enums.TypeEnum;
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
    @Column(name = "type", nullable = false)
    private String type = TypeEnum.CREDENTIAL.name();
    @Column(name = "website", length = Integer.MAX_VALUE)
    private String website;
    @Column(name = "username", length = Integer.MAX_VALUE)
    private String username;
    @Column(name = "passwd", length = Integer.MAX_VALUE)
    private String passwd;
    @Column(name = "note", length = Integer.MAX_VALUE)
    private String note;
}
