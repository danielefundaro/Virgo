package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Workspace;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkspaceRepository extends CommonRepository<Workspace> {
    Optional<Workspace> findWorkspaceByUserIdAndName(String userId, String name);

    Page<Workspace> findAllByUserIdAndNameContainsIgnoreCase(String userId, String name, PageRequest pageRequest);
}
