package com.fnd.virgo.repository;

import com.fnd.virgo.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends CommonRepository<Note> {
    Optional<Note> findNoteByUserIdAndName(String userId, String name);
}
