package com.fnd.virgo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@MappedSuperclass
public class CommonFields {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;
    @Column(name = "user_id", nullable = false)
    private String userId;
    @Column(name = "name", nullable = false)
    private String name;
}
