package com.edutrack.controller;

import com.edutrack.service.ProgressAnalysisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressAnalysisService progressAnalysisService;

    public ProgressController(ProgressAnalysisService progressAnalysisService) {
        this.progressAnalysisService = progressAnalysisService;
    }

    @PostMapping("/analyze")
    public Map<String, Object> analyze(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> quizResults = (List<Map<String, Object>>) body.get("quizResults");
        Object scoreRaw = body.get("score");
        Integer score = scoreRaw == null ? null : ((Number) scoreRaw).intValue();
        return progressAnalysisService.analyze((String) body.get("studentId"), quizResults, score);
    }

    @GetMapping("/{studentId}")
    public Map<String, Object> forStudent(@PathVariable String studentId) {
        return Map.of("success", true, "data", progressAnalysisService.forStudent(studentId));
    }

    @GetMapping
    public Map<String, Object> all() {
        return Map.of("success", true, "data", progressAnalysisService.all());
    }
}
