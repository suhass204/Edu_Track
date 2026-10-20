package com.edutrack.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Thin client for Google's Generative Language API (Gemini), replacing p4's @google/generative-ai usage. */
@Service
public class GeminiService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${edutrack.gemini.api-key}")
    private String apiKey;

    @Value("${edutrack.gemini.model}")
    private String model;

    public GeminiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generate(String prompt) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, Object> body = Map.of("contents", List.of(
            Map.of("parts", List.of(Map.of("text", prompt)))
        ));
        Map<?, ?> resp = restTemplate.postForObject(url, new HttpEntity<>(body, headers), Map.class);
        try {
            JsonNode node = objectMapper.valueToTree(resp);
            return node.at("/candidates/0/content/parts/0/text").asText("");
        } catch (Exception e) {
            return "";
        }
    }

    public JsonNode extractJson(String text) {
        String cleaned = text.replace("```json", "").replace("```", "").trim();
        try {
            return objectMapper.readTree(cleaned);
        } catch (Exception e) {
            Pattern p = Pattern.compile("\\{[\\s\\S]*}");
            Matcher m = p.matcher(text);
            if (m.find()) {
                try {
                    return objectMapper.readTree(m.group());
                } catch (Exception ignored) {
                }
            }
            return objectMapper.createObjectNode().put("summary", text);
        }
    }
}
