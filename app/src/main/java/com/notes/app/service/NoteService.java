package com.notes.app.service;

import com.notes.app.dto.NoteRequest;
import com.notes.app.entity.Note;
import com.notes.app.entity.User;
import com.notes.app.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    public List<Note> getAllNotes(String email) {
        User user = userDetailsService.getUserByEmail(email);
        
        if (user.getRole() == User.Role.ADMIN) {
            return noteRepository.findAll();
        }
        return noteRepository.findByUser(user);
    }

    public Note createNote(NoteRequest request, String email) {
        User user = userDetailsService.getUserByEmail(email);
        
        Note note = new Note();
        note.setTitle(request.getTitle());
        note.setDescription(request.getDescription());
        note.setUser(user);
        
        return noteRepository.save(note);
    }

    public Note updateNote(Long id, NoteRequest request, String email) {
        User user = userDetailsService.getUserByEmail(email);
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found"));

        if (user.getRole() != User.Role.ADMIN && !note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to update this note");
        }

        note.setTitle(request.getTitle());
        note.setDescription(request.getDescription());
        
        return noteRepository.save(note);
    }

    public void deleteNote(Long id, String email) {
        User user = userDetailsService.getUserByEmail(email);
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found"));

        if (user.getRole() != User.Role.ADMIN && !note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this note");
        }

        noteRepository.delete(note);
    }

    public Note getNoteById(Long id, String email) {
        User user = userDetailsService.getUserByEmail(email);
        Note note = noteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Note not found"));

        if (user.getRole() != User.Role.ADMIN && !note.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to view this note");
        }

        return note;
    }
}