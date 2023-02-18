package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.WorkspaceDTO;
import com.fnd.virgo.entity.Audit;
import com.fnd.virgo.entity.AuditTuple;
import com.fnd.virgo.entity.CommonFields;
import com.fnd.virgo.entity.Workspace;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.WorkspaceService;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WorkspaceServiceImpl implements WorkspaceService {
    private final AuditRepository auditRepository;
    private final WorkspaceRepository workspaceRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository, AuditRepository auditRepository) {
        this.workspaceRepository = workspaceRepository;
        this.modelMapper = new ModelMapper();
        this.auditRepository = auditRepository;
    }

    @Override
    public List<WorkspaceDTO> getAll() {
        String userId = "a";
        List<Workspace> notes = workspaceRepository.findAll();

        // Save the audit info into db
        String info = String.format("The user %s got all the notes. Count %s", userId, notes.size());
        saveAuditInfo(notes.stream().map(CommonFields::getId).collect(Collectors.toList()), userId, AuditTypeEnum.SELECT_ALL, info, true);

        return notes.stream().map(workspace -> modelMapper.map(workspace, WorkspaceDTO.class)).collect(Collectors.toList());
    }

    @Override
    public WorkspaceDTO save(@NotNull WorkspaceDTO workspaceDTO) {
        String userId = "a";
        Workspace workspace = getWorkspace(workspaceDTO, userId);

        if (workspace != null) {
            String error = String.format("The user %s found the workspace while saving it with name: %s", userId, workspaceDTO.getName());
            saveAuditInfo(Collections.singletonList(workspace.getId()), userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        workspace = modelMapper.map(workspaceDTO, Workspace.class);
        workspace.setUserId(userId);
        workspace = workspaceRepository.save(workspace);

        // Save the audit info into db
        String info = String.format("The user %s saved a new workspace with id %s", userId, workspace.getId());
        saveAuditInfo(Collections.singletonList(workspace.getId()), userId, AuditTypeEnum.INSERT, info, true);

        return modelMapper.map(workspace, WorkspaceDTO.class);
    }

    @Override
    public WorkspaceDTO update(WorkspaceDTO workspaceDTO) {
        String userId = "a";
        Workspace workspace = getWorkspace(workspaceDTO, userId);

        if (workspace == null) {
            String error = String.format("The user %s didn't find the workspace while updating name: %s", userId, workspaceDTO.getName());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        workspace.setName(workspaceDTO.getName());
        workspace = workspaceRepository.save(workspace);

        // Save the audit info into db
        String info = String.format("The user %s updated the workspace with id %s", userId, workspace.getId());
        saveAuditInfo(Collections.singletonList(workspace.getId()), userId, AuditTypeEnum.UPDATE, info, true);

        return modelMapper.map(workspace, WorkspaceDTO.class);
    }

    @Override
    public WorkspaceDTO delete(WorkspaceDTO workspaceDTO) {
        String userId = "a";
        Workspace workspace = getWorkspace(workspaceDTO, userId);

        if (workspace == null) {
            String error = String.format("The user %s didn't find the workspace while deleting name: %s", userId, workspaceDTO.getName());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        workspace.setDeleted(true);
        workspace = workspaceRepository.save(workspace);

        // Save the audit info into db
        String info = String.format("The user %s deleted the workspace with id %s", userId, workspace.getId());
        saveAuditInfo(Collections.singletonList(workspace.getId()), userId, AuditTypeEnum.DELETE, info, true);

        return modelMapper.map(workspace, WorkspaceDTO.class);
    }

    private Workspace getWorkspace(@NotNull WorkspaceDTO workspaceDTO, String userId) {
        Optional<Workspace> optionalNote = workspaceRepository.findWorkspaceByUserIdAndName(userId, workspaceDTO.getName());
        return optionalNote.orElse(null);
    }

    private void saveAuditInfo(String userId, String description) {
        saveAuditInfo(null, userId, description);
    }

    private void saveAuditInfo(List<Long> ids, String userId, String description) {
        saveAuditInfo(ids, userId, AuditTypeEnum.ERROR, description, false);
    }

    private void saveAuditInfo(List<Long> ids, String userId, AuditTypeEnum auditTypeEnum, String description, boolean showLog) {
        Audit audit = new Audit();
        Date now = new Date();

        audit.setDate(now);
        audit.setUserId(userId);
        audit.setType(auditTypeEnum);
        audit.setTableName(Workspace.class.getSimpleName());
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
