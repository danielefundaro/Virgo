package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Wallet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface WalletRepository extends CommonRepository<Wallet> {
    Optional<Wallet> findByIdAndUserIdAndType(Long id, String userId, String type);
    @Query(value = "SELECT w FROM Wallet w WHERE w.userId = :userId AND (w.deleted IS NULL OR w.deleted = false) AND (w.website LIKE %:website% OR w.username LIKE %:username% OR w.name LIKE %:name% OR w.content LIKE %:content%)")
    Page<Wallet> findAllByUserIdAndFilter(String userId, String website, String username, String name, String content, PageRequest pageRequest);
}
