package com.fnd.virgo.controller;

import com.fnd.virgo.dto.NoteDetailsDTO;
import com.fnd.virgo.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "notes")
@Validated
public class NoteController {
    private final NoteService noteService;

    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private List<NoteDetailsDTO> getAll() {
        return noteService.getAll();
    }

    @PostMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.CREATED)
    private NoteDetailsDTO save(@RequestBody NoteDetailsDTO noteDetailsDTO) {
        return noteService.save(noteDetailsDTO);
    }

    @PutMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private NoteDetailsDTO update(@RequestBody NoteDetailsDTO noteDetailsDTO) {
        return noteService.update(noteDetailsDTO);
    }

    @DeleteMapping(value = "/", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(code = HttpStatus.OK)
    private NoteDetailsDTO delete(@RequestBody NoteDetailsDTO noteDetailsDTO) {
        return noteService.delete(noteDetailsDTO);
    }
}
