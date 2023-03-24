package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.CommonFieldsDTO;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.service.CommonService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@Slf4j
public abstract class CommonServiceImpl<C extends CommonFields, D extends CommonFieldsDTO, R extends CommonRepository<C>> extends BasicServiceImpl<C, D, R> implements CommonService<C, D, R> {
    private final ModelMapper modelMapper;

    protected CommonServiceImpl(AuditRepository auditRepository) {
        super(auditRepository);
        this.modelMapper = new ModelMapper();
    }

    @Override
    public D getById(Long id, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        C c = findEntity(id, userId);

        if (c == null) {
            String error = String.format("The user %s didn't find the %s while searching it with id %s", userId, getClassEntity().getSimpleName(), id);
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        String info = String.format("The user %s got the %s with id %s", userId, getClassEntity().getSimpleName(), id);
        saveAuditInfo(c.getId(), userId, AuditTypeEnum.SELECT, info);

        return modelMapper.map(c, getClassDTO());
    }

    @Override
    public D save(@NotNull D d, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        C c = findEntity(d, userId);

        if (c != null) {
            String error = String.format("The user %s found the %s while saving it with id %s", userId, getClassEntity().getSimpleName(), c.getId());
            saveAuditInfo(c.getId(), userId, AuditTypeEnum.ERROR, error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        return saveEntity(d, userId, AuditTypeEnum.SAVE);
    }

    @Override
    public D update(@NotNull D d, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        C cOld = findEntity(d.getId(), userId), cNew = findEntity(d, userId);

        if (cOld == null) {
            String error = String.format("The user %s didn't find the %s while updating it with id %s", userId, getClassEntity().getSimpleName(), d.getId());
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        if (cNew != null && !cNew.getId().equals(cOld.getId())) {
            String error = String.format("The user %s found the %s while updating it with id %s", userId, getClassEntity().getSimpleName(), cNew.getId());
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        return saveEntity(d, userId, AuditTypeEnum.UPDATE);
    }

    @Override
    public D delete(Long id, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        C c = findEntity(id, userId);

        if (c == null) {
            String error = String.format("The user %s didn't find the %s while deleting it with id %s", userId, getClassEntity().getSimpleName(), id);
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        c.setDeleted(true);
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s deleted the %s with id %s", userId, getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(c.getId(), userId, AuditTypeEnum.DELETE, info);

        return modelMapper.map(c, getClassDTO());
    }

    private D saveEntity(D d, String userId, @NotNull AuditTypeEnum auditTypeEnum) {
        C c = modelMapper.map(d, getClassEntity());
        c.setUserId(userId);
        c = getRepository().save(c);

        // Save the audit info into db
        String info = String.format("The user %s %sd the %s with id %s", userId, auditTypeEnum.name().toLowerCase(), getClassEntity().getSimpleName(), c.getId());
        saveAuditInfo(c.getId(), userId, auditTypeEnum, info);

        return modelMapper.map(c, getClassDTO());
    }
}
