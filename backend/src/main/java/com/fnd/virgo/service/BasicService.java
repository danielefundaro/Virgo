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

public interface BasicService<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> {

    R getRepository();

    Class<D> getClassDTO();

    Class<C> getClassEntity();

    Page<C> findAllByFilter(String value, String userId, PageRequest pageRequest);

    List<D> getAll(JwtAuthenticationToken keycloakAuthenticationToken);

    Page<D> search(@NotNull Searcher searcher, JwtAuthenticationToken keycloakAuthenticationToken);
}
