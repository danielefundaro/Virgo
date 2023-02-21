package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.EncryptCommonFieldsDTO;
import com.fnd.virgo.dto.WorkspaceCoreDTO;
import com.fnd.virgo.entity.EncryptCommonFields;
import com.fnd.virgo.entity.Workspace;
import com.fnd.virgo.model.UpdateRequest;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CommonRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.EncryptCommonService;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
    public D save(@NotNull D d) {
        String userId = "a";
        Workspace workspace = getEntityWorkspace(d.getWorkspace(), userId);

        d.setWorkspace(null);
        d = super.save(d);

        C c = findEntity(d, userId);
        c.setWorkspace(workspace);
        c.setUserId(userId);
        c = getRepository().save(c);

        return modelMapper.map(c, getClassDTO());
    }

    @Override
    public D update(@NotNull UpdateRequest<D> updateRequest) {
        String userId = "a";
        D savedD = super.update(updateRequest);
        C c = findEntity(savedD, userId);
        Workspace workspace = getEntityWorkspace(updateRequest.getNewInfo().getWorkspace(), userId);

        c.setSalt(updateRequest.getNewInfo().getSalt());
        c.setIv(updateRequest.getNewInfo().getIv());
        c.setWorkspace(workspace);
        c = getRepository().save(c);

        return modelMapper.map(c, getClassDTO());
    }

    public Workspace getEntityWorkspace(@NotNull WorkspaceCoreDTO workspaceDTO, String userId) {
        Optional<Workspace> optionalNote = workspaceRepository.findWorkspaceByUserIdAndName(userId, workspaceDTO.getName());
        return optionalNote.orElse(null);
    }
}
