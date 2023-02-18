package com.fnd.virgo.controller;

import com.fnd.virgo.dto.WorkspaceDetailsDTO;
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
    private List<WorkspaceDetailsDTO> getAll() {
        return workspaceService.getAll();
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private WorkspaceDetailsDTO save(@RequestBody WorkspaceDetailsDTO workspaceDetailsDTO) {
        return workspaceService.save(workspaceDetailsDTO);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private WorkspaceDetailsDTO update(@RequestBody WorkspaceDetailsDTO workspaceDetailsDTO) {
        return workspaceService.update(workspaceDetailsDTO);
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private WorkspaceDetailsDTO delete(@RequestBody WorkspaceDetailsDTO workspaceDetailsDTO) {
        return workspaceService.delete(workspaceDetailsDTO);
    }
}
