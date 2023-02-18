package com.fnd.virgo.controller;

import com.fnd.virgo.dto.WorkspaceDTO;
import com.fnd.virgo.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "workspaces")
@Validated
public class WorkspaceController {
    private final WorkspaceService workspaceService;

    @Autowired
    public WorkspaceController(WorkspaceService workspaceService) {
        this.workspaceService = workspaceService;
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private List<WorkspaceDTO> getAll() {
        return workspaceService.getAll();
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private WorkspaceDTO save(@RequestBody WorkspaceDTO workspaceDTO) {
        return workspaceService.save(workspaceDTO);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private WorkspaceDTO update(@RequestBody WorkspaceDTO workspaceDTO) {
        return workspaceService.update(workspaceDTO);
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private WorkspaceDTO delete(@RequestBody WorkspaceDTO workspaceDTO) {
        return workspaceService.delete(workspaceDTO);
    }
}
