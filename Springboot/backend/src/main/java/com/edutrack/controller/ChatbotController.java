package com.edutrack.controller;

import com.edutrack.exception.ApiException;
import com.edutrack.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final GeminiService geminiService;

    public ChatbotController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/query")
    public Map<String, Object> query(@RequestBody Map<String, String> body) {
        String query = body.get("query");
        String userRole = body.get("userRole");
        if (query == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Query is required");
        }
        String rolePrompt = "teacher".equals(userRole)
            ? "You are EduTrack's AI assistant for teachers. Help teachers with student management, quiz creation, and educational support."
            : "You are EduTrack's AI assistant for students. Help students understand subjects, prepare for tests, and learn concepts clearly.";
        String response = geminiService.generate(rolePrompt + "\n\nUser Query: " + query);
        return Map.of("success", true, "role", userRole, "query", query, "response", response);
    }
}
