package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.Audit;
import com.fnd.virgo.entity.AuditTuple;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.service.CommonService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public abstract class CommonServiceImpl<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> implements CommonService<C, D, R> {
    private final AuditRepository auditRepository;
    private final ModelMapper modelMapper;

    @Autowired
    protected CommonServiceImpl(AuditRepository auditRepository) {
        this.modelMapper = new ModelMapper();
        this.auditRepository = auditRepository;
    }

    @Override
    public List<D> getAll() {
        String userId = "a";
        List<C> cList = getRepository().findAll();

        // Save the audit info into db
        String info = String.format("The user %s got all %ss. Count %s", userId, getClassEntity().getSimpleName(), cList.size());
        saveAuditInfo(cList.stream().map(CommonFields::getId).collect(Collectors.toList()), userId, AuditTypeEnum.SELECT_ALL, info, true);

        return cList.stream().map(c -> modelMapper.map(c, getClassDTO())).collect(Collectors.toList());
    }

    @Override
    public D save(@NotNull D d) {
        String userId = "a";
        C c = findEntity(d, userId);

        if (c != null) {
            String error = String.format("The user %s found the %s while saving it with name: %s", userId, getClassEntity().getSimpleName(), d.getName());
            saveAuditInfo(Collections.singletonList(c.getId()), userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        c = modelMapper.map(d, getClassEntity());
        c.setUserId(userId);
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s saved a new %s with id %s", userId, getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(Collections.singletonList(c.getId()), userId, AuditTypeEnum.INSERT, info, true);

        return modelMapper.map(c, getClassDTO());
    }

    @Override
    public D update(D d) {
        String userId = "a";
        C c = findEntity(d, userId);

        if (c == null) {
            String error = String.format("The user %s didn't find the %s while updating name: %s", userId, getClassEntity().getSimpleName(), d.getName());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        c.setName(d.getName());
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s updated the %s with id %s", userId, getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(Collections.singletonList(c.getId()), userId, AuditTypeEnum.UPDATE, info, true);

        return modelMapper.map(c, getClassDTO());
    }

    @Override
    public D delete(D d) {
        String userId = "a";
        C c = findEntity(d, userId);

        if (c == null) {
            String error = String.format("The user %s didn't find the %s while deleting name: %s", userId, getClassEntity().getSimpleName(), d.getName());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        c.setDeleted(true);
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s deleted the %s with id %s", userId, getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(Collections.singletonList(c.getId()), userId, AuditTypeEnum.DELETE, info, true);

        return modelMapper.map(c, getClassDTO());
    }

    protected void saveAuditInfo(String userId, String description) {
        saveAuditInfo(null, userId, description);
    }

    protected void saveAuditInfo(List<Long> ids, String userId, String description) {
        saveAuditInfo(ids, userId, AuditTypeEnum.ERROR, description, false);
    }

    protected void saveAuditInfo(List<Long> ids, String userId, AuditTypeEnum auditTypeEnum, String description, boolean showLog) {
        Audit audit = new Audit();
        Date now = new Date();

        audit.setDate(now);
        audit.setUserId(userId);
        audit.setType(auditTypeEnum);
        audit.setTableName(getClassEntity().getSimpleName());
        audit.setDescription(description);

        if (ids != null) {
            audit.setTuples(ids.stream().map(id -> {
                AuditTuple auditTuple = new AuditTuple();

                auditTuple.setDate(now);
                auditTuple.setAudit(audit);
                auditTuple.setTupleId(id);

                return auditTuple;
            }).collect(Collectors.toList()));
        }

        auditRepository.save(audit);

        if (showLog)
            log.info(description);
    }
}
