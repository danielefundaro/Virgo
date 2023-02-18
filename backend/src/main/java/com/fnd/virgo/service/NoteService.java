package com.fnd.virgo.service;

import com.fnd.virgo.dto.NoteDetailsDTO;

import java.util.List;

public interface NoteService {
    List<NoteDetailsDTO> getAll();

    NoteDetailsDTO save(NoteDetailsDTO noteDTO);

    NoteDetailsDTO update(NoteDetailsDTO noteDTO);

    NoteDetailsDTO delete(NoteDetailsDTO noteDTO);
}
