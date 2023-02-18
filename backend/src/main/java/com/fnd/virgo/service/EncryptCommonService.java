package com.fnd.virgo.service;

import com.fnd.virgo.dto.EncryptCommonFieldsDTO;
import com.fnd.virgo.entity.EncryptCommonFields;
import com.fnd.virgo.repository.CommonRepository;

public interface EncryptCommonService<C extends EncryptCommonFields, D extends EncryptCommonFieldsDTO, R extends CommonRepository<C>> extends CommonService<C, D, R> {
}
