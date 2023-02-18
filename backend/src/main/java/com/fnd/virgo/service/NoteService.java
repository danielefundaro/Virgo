package com.fnd.virgo.service;

import com.fnd.virgo.dto.NoteDTO;

import java.util.List;

public interface NoteService {
    List<NoteDTO> getAll();

    NoteDTO save(NoteDTO noteDTO);

    NoteDTO update(NoteDTO noteDTO);

    NoteDTO delete(NoteDTO noteDTO);
}
