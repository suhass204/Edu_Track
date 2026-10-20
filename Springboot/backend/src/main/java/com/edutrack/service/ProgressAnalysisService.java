package com.edutrack.service;

import com.edutrack.model.Progress;
import com.edutrack.repository.ProgressRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProgressAnalysisService {

    private final ProgressRepository progressRepository;
    private final GeminiService geminiService;

    public ProgressAnalysisService(ProgressRepository progressRepository, GeminiService geminiService) {
        this.progressRepository = progressRepository;
        this.geminiService = geminiService;
    }

    public Map<String, Object> analyze(String studentId, List<Map<String, Object>> quizResults, Integer score) {
        String prompt = """
            You are an educational performance analysis AI for EduTrack.
            Analyze the student's quiz performance in detail.

            Student ID: %s

            Quiz Data:
            %s

            Please return the output as a JSON object with the following keys:
            - strengths
            - weaknesses
            - recommendedPath
            - confidenceLevel
            - summary
            Please ensure "confidenceLevel" is a number between 0 and 100, not a string.
            """.formatted(studentId, quizResults);

        String raw = geminiService.generate(prompt);
        JsonNode analysis = geminiService.extractJson(raw);

        Progress progress = new Progress();
        progress.setStudentId(studentId);
        if (!quizResults.isEmpty() && quizResults.get(0).get("quizId") != null) {
            progress.setQuizId(quizResults.get(0).get("quizId").toString());
        }
        progress.setScore(score != null ? score : 0);
        Progress.Analysis a = new Progress.Analysis();
        a.setStrengths(toStringList(analysis.get("strengths")));
        a.setWeaknesses(toStringList(analysis.get("weaknesses")));
        a.setRecommendedPath(toStringList(analysis.get("recommendedPath")));
        a.setConfidence(analysis.has("confidenceLevel") ? analysis.get("confidenceLevel").asDouble(0) : 0);
        a.setSummary(analysis.has("summary") ? analysis.get("summary").asText("") : "");
        progress.setAnalysis(a);
        progressRepository.save(progress);

        return Map.of("success", true, "message", "Progress analyzed and stored successfully", "analysis", analysis);
    }

    private List<String> toStringList(JsonNode node) {
        List<String> list = new ArrayList<>();
        if (node != null && node.isArray()) {
            node.forEach(n -> list.add(n.asText()));
        }
        return list;
    }

    public List<Progress> forStudent(String studentId) {
        return progressRepository.findByStudentId(studentId);
    }

    public List<Progress> all() {
        return progressRepository.findAll();
    }
}
