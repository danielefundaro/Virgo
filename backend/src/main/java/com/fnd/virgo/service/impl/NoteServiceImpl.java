package com.fnd.virgo.service.impl;

import com.fnd.virgo.dto.NoteDetailsDTO;
import com.fnd.virgo.dto.WorkspaceDTO;
import com.fnd.virgo.entity.*;
import com.fnd.virgo.enums.AuditTypeEnum;
import com.fnd.virgo.repository.AuditRepository;
import com.fnd.virgo.repository.NoteRepository;
import com.fnd.virgo.repository.WorkspaceRepository;
import com.fnd.virgo.service.NoteService;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class NoteServiceImpl implements NoteService {
    private final AuditRepository auditRepository;
    private final WorkspaceRepository workspaceRepository;
    private final NoteRepository noteRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public NoteServiceImpl(NoteRepository noteRepository, AuditRepository auditRepository, WorkspaceRepository workspaceRepository) {
        this.noteRepository = noteRepository;
        this.workspaceRepository = workspaceRepository;
        this.modelMapper = new ModelMapper();
        this.auditRepository = auditRepository;
    }

    @Override
    public List<NoteDetailsDTO> getAll() {
        String userId = "a";
        List<Note> notes = noteRepository.findAll();

        // Save the audit info into db
        String info = String.format("The user %s got all the notes. Count %s", userId, notes.size());
        saveAuditInfo(notes.stream().map(CommonFields::getId).collect(Collectors.toList()), userId, AuditTypeEnum.SELECT_ALL, info, true);

        return notes.stream().map(note -> modelMapper.map(note, NoteDetailsDTO.class)).collect(Collectors.toList());
    }

    @Override
    public NoteDetailsDTO save(@NotNull NoteDetailsDTO noteDetailsDTO) {
        String userId = "a";
        Note note = getNote(noteDetailsDTO, userId);

        if (note != null) {
            String error = String.format("The user %s found the note while saving it with name: %s", userId, noteDetailsDTO.getName());
            saveAuditInfo(Collections.singletonList(note.getId()), userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.CONFLICT, "Object already exists");
        }

        note = modelMapper.map(noteDetailsDTO, Note.class);
        note.setWorkspace(getWorkspace(noteDetailsDTO.getWorkspace(), userId));
        note.setUserId(userId);
        note = noteRepository.save(note);

        // Save the audit info into db
        String info = String.format("The user %s saved a new note with id %s", userId, note.getId());
        saveAuditInfo(Collections.singletonList(note.getId()), userId, AuditTypeEnum.INSERT, info, true);

        return modelMapper.map(note, NoteDetailsDTO.class);
    }

    @Override
    public NoteDetailsDTO update(NoteDetailsDTO noteDetailsDTO) {
        String userId = "a";
        Note note = getNote(noteDetailsDTO, userId);

        if (note == null) {
            String error = String.format("The user %s didn't find the note while updating name: %s", userId, noteDetailsDTO.getName());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        note.setName(noteDetailsDTO.getName());
        note.setContent(noteDetailsDTO.getContent());
        note.setSalt(noteDetailsDTO.getSalt());
        note.setIv(noteDetailsDTO.getIv());
        note = noteRepository.save(note);

        // Save the audit info into db
        String info = String.format("The user %s updated the note with id %s", userId, note.getId());
        saveAuditInfo(Collections.singletonList(note.getId()), userId, AuditTypeEnum.UPDATE, info, true);

        return modelMapper.map(note, NoteDetailsDTO.class);
    }

    @Override
    public NoteDetailsDTO delete(NoteDetailsDTO noteDetailsDTO) {
        String userId = "a";
        Note note = getNote(noteDetailsDTO, userId);

        if (note == null) {
            String error = String.format("The user %s didn't find the note while deleting name: %s", userId, noteDetailsDTO.getName());
            saveAuditInfo(userId, error);
            log.error(error);

            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Object not found");
        }

        note.setDeleted(true);
        note = noteRepository.save(note);

        // Save the audit info into db
        String info = String.format("The user %s deleted the note with id %s", userId, note.getId());
        saveAuditInfo(Collections.singletonList(note.getId()), userId, AuditTypeEnum.DELETE, info, true);

        return modelMapper.map(note, NoteDetailsDTO.class);
    }

    private Note getNote(@NotNull NoteDetailsDTO noteDetailsDTO, String userId) {
        Optional<Note> optionalNote = noteRepository.findNoteByUserIdAndName(userId, noteDetailsDTO.getName());
        return optionalNote.orElse(null);
    }

    private Workspace getWorkspace(@NotNull WorkspaceDTO workspaceDTO, String userId) {
        Optional<Workspace> optionalNote = workspaceRepository.findWorkspaceByUserIdAndName(userId, workspaceDTO.getName());
        return optionalNote.orElse(null);
    }

    private void saveAuditInfo(String userId, String description) {
        saveAuditInfo(null, userId, description);
    }

    private void saveAuditInfo(List<Long> ids, String userId, String description) {
        saveAuditInfo(ids, userId, AuditTypeEnum.ERROR, description, false);
    }

    private void saveAuditInfo(List<Long> ids, String userId, AuditTypeEnum auditTypeEnum, String description, boolean showLog) {
        Audit audit = new Audit();
        Date now = new Date();

        audit.setDate(now);
        audit.setUserId(userId);
        audit.setType(auditTypeEnum);
        audit.setTableName(Note.class.getSimpleName());
        audit.setDescription(description);

        if (ids != null) {
            audit.setTuples(ids.stream().map(id -> {
                AuditTuple auditTuple = new AuditTuple();

                auditTuple.setDate(now);
                auditTuple.setAudit(audit);
                auditTuple.setTupleId(id);

                return auditTuple;
            }).collect(Collectors.toList()));
        }

        auditRepository.save(audit);

        if (showLog)
            log.info(description);
    }
}
