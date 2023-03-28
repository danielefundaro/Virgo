package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;

public interface WalletRepository extends CommonRepository<Wallet> {
    @Query(value = "SELECT wa FROM Wallet wa " +
            "LEFT JOIN Workspace wo ON wo=wa.workspace " +
            "WHERE wa.userId = :userId AND (wa.website ILIKE %:website% OR wa.username ILIKE %:username% OR wa.name ILIKE %:name% OR wo.name ILIKE %:workspace%)")
    Page<Wallet> findAllByUserIdAndFilter(String userId, String website, String username, String name, String workspace, PageRequest pageRequest);
}
