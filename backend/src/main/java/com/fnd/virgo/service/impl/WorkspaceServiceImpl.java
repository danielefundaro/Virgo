package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.WorkspaceDTO;
import com.fnd.virgo.entity.Workspace;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.WorkspaceService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class WorkspaceServiceImpl extends CommonServiceImpl<Workspace, WorkspaceDTO, WorkspaceRepository> implements WorkspaceService {
    private final WorkspaceRepository workspaceRepository;

    @Autowired
    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository, AuditRepository auditRepository) {
        super(auditRepository);
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public WorkspaceRepository getRepository() {
        return this.workspaceRepository;
    }

    @Override
    public Class<WorkspaceDTO> getClassDTO() {
        return WorkspaceDTO.class;
    }

    @Override
    public Class<Workspace> getClassEntity() {
        return Workspace.class;
    }

    @Override
    public Workspace findEntity(@NotNull WorkspaceDTO workspaceDTO, String userId) {
        Optional<Workspace> optionalNote = workspaceRepository.findWorkspaceByUserIdAndName(userId, workspaceDTO.getName());
        return optionalNote.orElse(null);
    }
}
