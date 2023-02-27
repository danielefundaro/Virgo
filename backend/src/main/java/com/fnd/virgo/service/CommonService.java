package com.fnd.virgo.service;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.model.Searcher;
import com.fnd.virgo.repository.CommonRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

import java.util.List;

public interface CommonService<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> {

    R getRepository();

    Class<D> getClassDTO();

    Class<C> getClassEntity();

    C findEntity(@NotNull D d, String userId);

    Page<C> findAllByFilter(String value, String userId, PageRequest pageRequest);

    List<D> getAll(JwtAuthenticationToken jwtAuthenticationToken);

    D getById(Long id, JwtAuthenticationToken jwtAuthenticationToken);

    D save(D d, JwtAuthenticationToken jwtAuthenticationToken);

    Page<D> search(Searcher searcher, JwtAuthenticationToken jwtAuthenticationToken);

    D update(@NotNull D d, JwtAuthenticationToken jwtAuthenticationToken);

    D delete(Long id, JwtAuthenticationToken jwtAuthenticationToken);
}
