package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Workspace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WorkspaceRepository extends PagingAndSortingRepository<Workspace, Long>, JpaSpecificationExecutor<Workspace>, JpaRepository<Workspace, Long> {
    Optional<Workspace> findWorkspaceByUserIdAndName(String userId, String name);
}
