package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends CommonRepository<Note> {
    Optional<Note> findNoteByUserIdAndName(String userId, String name);

    Page<Note> findAllByUserIdAndNameContainsIgnoreCase(String userId, String name, PageRequest pageRequest);
}
