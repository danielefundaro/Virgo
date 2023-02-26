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

    @Query(value = "SELECT c FROM Credential c WHERE c.userId = :userId AND (c.deleted IS NULL OR c.deleted = false) AND (c.website LIKE %:website% OR c.username LIKE %:username% OR c.name LIKE %:name%)")
    Page<Credential> findAllByUserIdAndFilter(String userId, String website, String username, String name, PageRequest pageRequest);
}
