package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.NoteDTO;
import com.fnd.virgo.entity.Note;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.NoteRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class NoteServiceImpl extends EncryptCommonServiceImpl<Note, NoteDTO, NoteRepository> implements NoteService {
    private final NoteRepository noteRepository;

    public NoteServiceImpl(NoteRepository noteRepository, WorkspaceRepository workspaceRepository, AuditRepository auditRepository) {
        super(workspaceRepository, auditRepository);
        this.noteRepository = noteRepository;
    }

    @Override
    public NoteRepository getRepository() {
        return this.noteRepository;
    }

    @Override
    public Class<NoteDTO> getClassDTO() {
        return NoteDTO.class;
    }

    @Override
    public Class<Note> getClassEntity() {
        return Note.class;
    }

    @Override
    public Note findEntity(@NotNull NoteDTO noteDTO, String userId) {
        Optional<Note> optionalNote = noteRepository.findNoteByUserIdAndName(userId, noteDTO.getName());
        return optionalNote.orElse(null);
    }

    @Override
    public Page<Note> findAllByFilter(String value, String userId, PageRequest pageRequest) {
        return noteRepository.findAllByUserIdAndNameContainsIgnoreCase(userId, value, pageRequest);
    }
}
