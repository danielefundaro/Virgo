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
@Where(clause = "deleted = false and type = 'NOTE'")
public class Note extends EncryptCommonFields {
    @Column(name = "type", nullable = false)
    private String type = TypeEnum.NOTE.name();
    @Column(name = "content", length = Integer.MAX_VALUE)
    private String content;
}
