package com.edutrack.controller;

import com.edutrack.service.VideoService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/recommend")
    public Map<String, Object> recommend(@RequestBody Map<String, String> body) {
        var videos = videoService.recommend(body.get("studentId"), body.get("grade"), body.get("subject"));
        return Map.of("success", true, "videos", videos);
    }
}
