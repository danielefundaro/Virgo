package com.fnd.virgo.service;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.repository.CommonRepository;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

public interface CommonService<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> extends BasicService<C, D, R> {

    C findEntity(@NotNull D d, String userId);

    D getById(Long id, JwtAuthenticationToken jwtAuthenticationToken);

    D save(D d, JwtAuthenticationToken jwtAuthenticationToken);

    D update(@NotNull D d, JwtAuthenticationToken jwtAuthenticationToken);

    D delete(Long id, JwtAuthenticationToken jwtAuthenticationToken);
}
