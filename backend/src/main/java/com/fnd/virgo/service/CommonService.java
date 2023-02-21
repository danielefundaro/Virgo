package com.fnd.virgo.service;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.model.UpdateRequest;
import com.fnd.virgo.repository.CommonRepository;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;

import java.util.List;

public interface CommonService<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> {

    ModelMapper modelMapper = new ModelMapper();

    R getRepository();

    Class<D> getClassDTO();

    Class<C> getClassEntity();

    C findEntity(@NotNull D d, String userId);

    List<D> getAll();

    D save(D d);

    D update(UpdateRequest<D> updateRequest);

    D delete(D d);
}
