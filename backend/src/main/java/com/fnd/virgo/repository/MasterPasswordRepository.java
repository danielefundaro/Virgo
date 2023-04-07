package com.fnd.virgo.repository;

import com.fnd.virgo.entity.MasterPassword;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface MasterPasswordRepository extends PagingAndSortingRepository<MasterPassword, Long>, JpaSpecificationExecutor<MasterPassword>, JpaRepository<MasterPassword, Long> {
    Optional<MasterPassword> findMasterPasswordByUserId(String userId);
}
