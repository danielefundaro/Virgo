package com.fnd.virgo.service;

import com.fnd.virgo.dto.NoteDTO;
import com.fnd.virgo.entity.Note;
import com.fnd.virgo.repository.NoteRepository;

public interface NoteService extends EncryptCommonService<Note, NoteDTO, NoteRepository> {
}
