package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.NoteDTO;
import com.fnd.virgo.entity.Note;
import com.fnd.virgo.model.UpdateRequest;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.NoteRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class NoteServiceImpl extends EncryptCommonServiceImpl<Note, NoteDTO, NoteRepository> implements NoteService {
    private final NoteRepository noteRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public NoteServiceImpl(NoteRepository noteRepository, WorkspaceRepository workspaceRepository, AuditRepository auditRepository) {
        super(workspaceRepository, auditRepository);
        this.noteRepository = noteRepository;
        this.modelMapper = new ModelMapper();
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
    public NoteDTO update(@NotNull UpdateRequest<NoteDTO> updateRequest) {
        String userId = "a";
        NoteDTO savedNoteDTO = super.update(updateRequest);
        Note note = findEntity(savedNoteDTO, userId);

        note.setContent(updateRequest.getNewInfo().getContent());
        note = noteRepository.save(note);

        return modelMapper.map(note, getClassDTO());
    }
}
