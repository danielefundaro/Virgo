package com.fnd.virgo.service;

import com.fnd.virgo.dto.WorkspaceDTO;

import java.util.List;

public interface WorkspaceService {
    List<WorkspaceDTO> getAll();

    WorkspaceDTO save(WorkspaceDTO workspaceDTO);

    WorkspaceDTO update(WorkspaceDTO workspaceDTO);

    WorkspaceDTO delete(WorkspaceDTO workspaceDTO);
}
