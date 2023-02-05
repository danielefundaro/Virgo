package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Credential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CredentialRepository extends PagingAndSortingRepository<Credential, Long>, JpaSpecificationExecutor<Credential>, JpaRepository<Credential, Long> {
    Optional<Credential> findCredentialByUserIdAndWebsiteAndUsername(String userId, String website, String username);
}
