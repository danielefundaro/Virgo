package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Credential;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredentialRepository extends CommonRepository<Credential> {
    Optional<Credential> findCredentialByUserIdAndWebsiteAndUsername(String userId, String website, String username);
}
