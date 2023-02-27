package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.EncryptCommonFieldsDTO;
import com.fnd.virgo.entity.EncryptCommonFields;
import com.fnd.virgo.entity.Workspace;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.EncryptCommonService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public abstract class EncryptCommonServiceImpl<C extends EncryptCommonFields, D extends EncryptCommonFieldsDTO, R extends CommonRepository<C>> extends CommonServiceImpl<C, D, R> implements EncryptCommonService<C, D, R> {

    private final WorkspaceRepository workspaceRepository;

    @Autowired
    protected EncryptCommonServiceImpl(WorkspaceRepository workspaceRepository, AuditRepository auditRepository) {
        super(auditRepository);
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public D save(@NotNull D d, JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        checkWorkspace(d, userId);
        return super.save(d, jwtAuthenticationToken);
    }

    @Override
    public D update(@NotNull D d, JwtAuthenticationToken jwtAuthenticationToken) {
        String userId = jwtAuthenticationToken.getName();
        checkWorkspace(d, userId);
        return super.update(d, jwtAuthenticationToken);
    }

    private void checkWorkspace(@NotNull D d, String userId) {
        if (d.getWorkspace() == null || d.getWorkspace().getId() == null) {
            String error = String.format("The user %s didn't specify the workspace of %s while saving it with name %s", userId, getClassEntity().getSimpleName(), d.getName());
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Workspace missing");
        }

        Optional<Workspace> optionalWorkspace = workspaceRepository.findByIdAndUserId(d.getWorkspace().getId(), userId);

        if (optionalWorkspace.isEmpty()) {
            String error = String.format("The user %s didn't find the workspace of %s while saving it with name %s", userId, getClassEntity().getSimpleName(), d.getName());
            saveAuditInfo(userId, error);

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Workspace not found");
        }
    }
}
