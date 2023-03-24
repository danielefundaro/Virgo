package com.fnd.virgo.controller;

import com.fnd.virgo.dto.NoteDTO;
import com.fnd.virgo.entity.Note;
import com.fnd.virgo.repository.NoteRepository;
import com.fnd.virgo.service.NoteService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "notes")
@Validated
public class NoteController implements CommonController<Note, NoteDTO, NoteRepository, NoteService> {
    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @Override
    public NoteService getService() {
        return this.noteService;
    }
}
