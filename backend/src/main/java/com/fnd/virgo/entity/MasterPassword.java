package com.fnd.virgo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "master_passwords")
public class MasterPassword {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;
    @Column(name = "user_id", nullable = false)
    private String userId;
    @Column(name = "hash_passwd", nullable = false)
    private String hashPasswd;
    @Column(name = "salt", nullable = false)
    private String salt;
}
