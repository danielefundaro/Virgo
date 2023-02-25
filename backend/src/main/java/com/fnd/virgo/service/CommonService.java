package com.fnd.virgo.service;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.repository.CommonRepository;
import org.jetbrains.annotations.NotNull;

import java.util.List;

public interface CommonService<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> {

    R getRepository();

    Class<D> getClassDTO();

    Class<C> getClassEntity();

    C findEntity(@NotNull D d, String userId);

    List<D> getAll();

    D getById(Long id);

    D save(D d);

    D update(@NotNull D d);

    D delete(Long id);
}
