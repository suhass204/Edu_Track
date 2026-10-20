package com.edutrack.service;

import com.edutrack.exception.ApiException;
import com.edutrack.model.Note;
import com.edutrack.model.Student;
import com.edutrack.repository.NoteRepository;
import com.edutrack.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final StudentRepository studentRepository;

    @Value("${edutrack.uploads.dir}")
    private String uploadsDir;

    public NoteService(NoteRepository noteRepository, StudentRepository studentRepository) {
        this.noteRepository = noteRepository;
        this.studentRepository = studentRepository;
    }

    public Note upload(MultipartFile file, String grade) {
        if (grade == null || grade.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Grade is required");
        }
        String original = file.getOriginalFilename() != null ? file.getOriginalFilename() : "note.pdf";
        if (!original.toLowerCase().endsWith(".pdf")) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Only PDFs are allowed");
        }
        try {
            Path dir = Paths.get(uploadsDir);
            Files.createDirectories(dir);
            String filename = System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 9) + ".pdf";
            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            Note note = new Note();
            note.setFilename(filename);
            note.setGrade(grade);
            return noteRepository.save(note);
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    public List<Note> byGrade(String grade) {
        return noteRepository.findByGrade(grade);
    }

    /** Resolves the grade from the student's own record so a student can never fetch another grade's notes. */
    public List<Note> byStudent(String studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));
        return noteRepository.findByGrade("Grade " + student.getGrade());
    }
}
