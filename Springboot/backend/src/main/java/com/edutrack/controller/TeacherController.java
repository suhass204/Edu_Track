package com.edutrack.controller;

import com.edutrack.model.Video;
import com.edutrack.service.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/teacher")
public class TeacherController {

    private final VideoService videoService;

    public TeacherController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/add-video")
    public ResponseEntity<Map<String, Object>> addVideo(@RequestBody Map<String, String> body) {
        try {
            Video video = videoService.addVideo(
                body.get("title"), body.get("description"), body.get("url"),
                body.get("grade"), body.get("subject"), body.get("addedBy"));
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", "Video added successfully", "video", video));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Failed to add video"));
        }
    }
}
