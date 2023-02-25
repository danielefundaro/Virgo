package com.fnd.virgo.repository;

import com.fnd.virgo.entity.CommonFields;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

@NoRepositoryBean
public interface CommonRepository<C extends CommonFields> extends PagingAndSortingRepository<C, Long>, JpaSpecificationExecutor<C>, JpaRepository<C, Long> {
    List<C> findAllByUserId(String userId);

    Optional<C> findByIdAndUserId(Long id, String userId);
}
