package com.edutrack.controller;

import com.edutrack.model.Quiz;
import com.edutrack.service.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestBody Quiz quiz) {
        Quiz saved = quizService.create(quiz);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message", "Quiz created successfully", "quiz", saved));
    }

    @GetMapping("/teacher/{teacherId}")
    public Map<String, Object> byTeacher(@PathVariable String teacherId) {
        return Map.of("success", true, "quizzes", quizService.byTeacher(teacherId));
    }

    @GetMapping("/student/{studentId}")
    public Map<String, Object> forStudent(@PathVariable String studentId) {
        return Map.of("success", true, "quizzes", quizService.forStudent(studentId));
    }

    @GetMapping("/grade/{grade}")
    public Map<String, Object> byGrade(@PathVariable String grade) {
        int numericGrade = Integer.parseInt(grade.replaceAll("[^0-9]", ""));
        return Map.of("success", true, "quizzes", quizService.byGrade(numericGrade), "grade", grade);
    }

    @GetMapping("/teacher/{teacherId}/progress")
    public Map<String, Object> progress(@PathVariable String teacherId, @RequestParam(required = false) String grade) {
        Integer numericGrade = null;
        if (grade != null && !grade.equalsIgnoreCase("All Classes")) {
            numericGrade = Integer.parseInt(grade.replaceAll("[^0-9]", ""));
        }
        return quizService.progressReport(numericGrade);
    }

    @GetMapping("/{quizId}")
    public Map<String, Object> get(@PathVariable String quizId, @RequestParam(required = false) String studentId) {
        Quiz quiz = studentId != null ? quizService.getForStudent(quizId, studentId) : quizService.get(quizId);
        return Map.of("success", true, "quiz", quiz);
    }

    @PostMapping("/{quizId}/submit")
    public Map<String, Object> submit(@PathVariable String quizId, @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> answers = (List<Map<String, Object>>) body.get("answers");
        Object timeTakenRaw = body.get("timeTaken");
        Integer timeTaken = timeTakenRaw == null ? null : ((Number) timeTakenRaw).intValue();
        return quizService.submit(quizId, (String) body.get("studentId"), answers, timeTaken);
    }

    @PutMapping("/{quizId}")
    public Map<String, Object> update(@PathVariable String quizId, @RequestBody Map<String, Object> body) {
        Quiz quiz = quizService.update(quizId, body);
        return Map.of("success", true, "message", "Quiz updated successfully", "quiz", quiz);
    }

    @DeleteMapping("/{quizId}")
    public Map<String, Object> delete(@PathVariable String quizId) {
        quizService.delete(quizId);
        return Map.of("success", true, "message", "Quiz deleted successfully");
    }

    @GetMapping("/{quizId}/results")
    public Map<String, Object> results(@PathVariable String quizId) {
        return Map.of("success", true, "quiz", quizService.get(quizId));
    }
}
