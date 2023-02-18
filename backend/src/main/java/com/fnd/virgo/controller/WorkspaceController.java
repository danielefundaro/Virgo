package com.fnd.virgo.controller;

import com.fnd.virgo.dto.WorkspaceDTO;
import com.fnd.virgo.entity.Workspace;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "workspaces")
@Validated
public class WorkspaceController implements CommonController<Workspace, WorkspaceDTO, WorkspaceRepository, WorkspaceService> {
    private final WorkspaceService workspaceService;

    @Autowired
    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @Override
    public WorkspaceService getService() {
        return this.workspaceService;
    }
}
