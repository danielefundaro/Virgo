package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Credential;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredentialRepository extends CommonRepository<Credential> {
    Optional<Credential> findCredentialByUserIdAndWebsiteAndUsername(String userId, String website, String username);

    @Query(value = "SELECT c FROM Credential c " +
            "LEFT JOIN Workspace w ON w=c.workspace " +
            "WHERE c.userId = :userId AND (c.website ILIKE %:website% OR c.username ILIKE %:username% OR c.name ILIKE %:name% OR w.name ILIKE %:workspace%)")
    Page<Credential> findAllByUserIdAndFilter(String userId, String website, String username, String name, String workspace, PageRequest pageRequest);
}
