package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.WorkspaceDTO;
import com.fnd.virgo.entity.Workspace;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.CredentialRepository;
import com.fnd.virgo.repository.NoteRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.CredentialService;
import com.fnd.virgo.service.NoteService;
import com.fnd.virgo.service.WorkspaceService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class WorkspaceServiceImpl extends CommonServiceImpl<Workspace, WorkspaceDTO, WorkspaceRepository> implements WorkspaceService {
    private final WorkspaceRepository workspaceRepository;
    private final CredentialService credentialService;
    private final NoteService noteService;

    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository, AuditRepository auditRepository, CredentialRepository credentialRepository, NoteRepository noteRepository) {
        super(auditRepository);
        this.workspaceRepository = workspaceRepository;
        this.credentialService = new CredentialServiceImpl(credentialRepository, workspaceRepository, auditRepository);
        this.noteService = new NoteServiceImpl(noteRepository, workspaceRepository, auditRepository);
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

    @Override
    public Page<Workspace> findAllByFilter(String value, String userId, PageRequest pageRequest) {
        return workspaceRepository.findAllByUserIdAndNameContainsIgnoreCase(userId, value, pageRequest);
    }

    @Override
    public WorkspaceDTO delete(Long id, @NotNull JwtAuthenticationToken jwtAuthenticationToken) {
        WorkspaceDTO workspaceDTO = super.delete(id, jwtAuthenticationToken);
        workspaceDTO.getCredentials().forEach(credentialDTO -> credentialService.delete(credentialDTO.getId(), jwtAuthenticationToken));
        workspaceDTO.getNotes().forEach(noteDTO -> noteService.delete(noteDTO.getId(), jwtAuthenticationToken));

        return workspaceDTO;
    }
}
