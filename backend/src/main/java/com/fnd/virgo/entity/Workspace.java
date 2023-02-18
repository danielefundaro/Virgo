package com.fnd.virgo.entity;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Where;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "workspaces")
@Where(clause = "deleted = false")
public class Workspace extends CommonFields {
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL)
    private List<Credential> credentials;
    @OneToMany(mappedBy = "workspace", cascade = CascadeType.ALL)
    private List<Note> notes;
}
