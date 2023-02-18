package com.fnd.virgo.service;

import com.fnd.virgo.dto.WorkspaceDetailsDTO;

import java.util.List;

public interface WorkspaceService {
    List<WorkspaceDetailsDTO> getAll();

    WorkspaceDetailsDTO save(WorkspaceDetailsDTO workspaceDetailsDTO);

    WorkspaceDetailsDTO update(WorkspaceDetailsDTO workspaceDetailsDTO);

    WorkspaceDetailsDTO delete(WorkspaceDetailsDTO workspaceDetailsDTO);
}
