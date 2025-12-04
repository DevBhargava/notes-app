package com.notes.app.repository;

import com.notes.app.entity.Note;
import com.notes.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findByUser(User user);
    List<Note> findByUserId(Long userId);
    Optional<Note> findByIdAndUser(Long id, User user);
}