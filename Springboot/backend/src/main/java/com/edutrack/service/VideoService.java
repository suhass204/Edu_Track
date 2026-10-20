package com.edutrack.service;

import com.edutrack.model.Video;
import com.edutrack.repository.VideoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private static final Logger log = LoggerFactory.getLogger(VideoService.class);

    private final VideoRepository videoRepository;
    private final RestTemplate restTemplate;

    @Value("${edutrack.recommender.url}")
    private String recommenderUrl;

    public VideoService(VideoRepository videoRepository, RestTemplate restTemplate) {
        this.videoRepository = videoRepository;
        this.restTemplate = restTemplate;
    }

    public Video addVideo(String title, String description, String url, String grade, String subject, String addedBy) {
        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setUrl(url);
        video.setGrade(grade);
        video.setSubject(subject);
        video.setAddedBy(addedBy);
        return videoRepository.save(video);
    }

    public List<Video> findByGradeAndSubject(String grade, String subject) {
        if (grade != null && subject != null) return videoRepository.findByGradeAndSubject(grade, subject);
        return videoRepository.findAll();
    }

    @SuppressWarnings("unchecked")
    public List<Video> recommend(String studentId, String grade, String subject) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> req = new LinkedHashMap<>();
            req.put("studentId", studentId);
            req.put("grade", grade);
            req.put("subject", subject);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(req, headers);
            Map<String, Object> resp = restTemplate.postForObject(recommenderUrl + "/recommend", entity, Map.class);
            if (resp == null) return fallback(grade, subject);
            List<Map<String, Object>> recs = (List<Map<String, Object>>) resp.get("recommendations");
            if (recs == null || recs.isEmpty()) return fallback(grade, subject);
            List<String> ids = recs.stream().map(r -> (String) r.get("videoId")).collect(Collectors.toList());
            List<Video> videos = videoRepository.findByIdIn(ids);
            Map<String, Video> byId = videos.stream().collect(Collectors.toMap(Video::getId, v -> v));
            List<Video> ordered = new ArrayList<>();
            for (String id : ids) {
                if (byId.containsKey(id)) ordered.add(byId.get(id));
            }
            return ordered;
        } catch (Exception e) {
            log.warn("Recommender unavailable, falling back to popularity/recency: {}", e.getMessage());
            return fallback(grade, subject);
        }
    }

    private List<Video> fallback(String grade, String subject) {
        List<Video> candidates = findByGradeAndSubject(grade, subject);
        candidates.sort(Comparator.comparing(Video::getCreatedAt).reversed());
        return candidates.stream().limit(5).collect(Collectors.toList());
    }
}
