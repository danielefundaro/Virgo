package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Note;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends CommonRepository<Note> {
    Optional<Note> findNoteByUserIdAndName(String userId, String name);

    @Query(value = "SELECT n FROM Note n " +
            "LEFT JOIN Workspace w ON w=n.workspace " +
            "WHERE n.userId = :userId AND (n.name ILIKE %:name% OR w.name ILIKE %:workspace%)")
    Page<Note> findAllByUserIdAndFilter(String userId, String name, String workspace, PageRequest pageRequest);
}
