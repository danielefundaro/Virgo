package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Note;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends CommonRepository<Note> {
    Optional<Note> findNoteByUserIdAndName(String userId, String name);
}
