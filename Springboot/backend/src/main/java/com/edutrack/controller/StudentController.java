package com.edutrack.controller;

import com.edutrack.model.Video;
import com.edutrack.service.VideoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final VideoService videoService;

    public StudentController(VideoService videoService) {
        this.videoService = videoService;
    }

    @GetMapping("/videos")
    public List<Video> getVideos(@RequestParam(required = false) String grade,
                                  @RequestParam(required = false) String subject) {
        return videoService.findByGradeAndSubject(grade, subject);
    }
}
