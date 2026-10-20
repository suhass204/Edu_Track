package com.edutrack.controller;

import com.edutrack.model.Note;
import com.edutrack.service.NoteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> upload(@RequestParam("note") MultipartFile note,
                                                        @RequestParam("grade") String grade) {
        Note saved = noteService.upload(note, grade);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Note uploaded successfully", "note", saved));
    }

    @GetMapping("/grade/{grade}")
    public List<Note> byGrade(@PathVariable String grade) {
        return noteService.byGrade(grade);
    }

    /** Grade is resolved server-side from the student's own record, not from client input. */
    @GetMapping("/student/{studentId}")
    public List<Note> byStudent(@PathVariable String studentId) {
        return noteService.byStudent(studentId);
    }
}
