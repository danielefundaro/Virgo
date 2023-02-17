package com.fnd.virgo.service;

import com.fnd.virgo.dto.NoteDTO;

import java.util.List;

public interface NoteService {
    List<NoteDTO> getAll();

    NoteDTO save(NoteDTO NoteDTO);

    NoteDTO update(NoteDTO NoteDTO);

    NoteDTO delete(NoteDTO NoteDTO);
}
