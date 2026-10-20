package com.edutrack.controller;

import com.edutrack.exception.ApiException;
import com.edutrack.model.Student;
import com.edutrack.model.Video;
import com.edutrack.repository.StudentRepository;
import com.edutrack.service.VideoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final VideoService videoService;
    private final StudentRepository studentRepository;

    public StudentController(VideoService videoService, StudentRepository studentRepository) {
        this.videoService = videoService;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/videos")
    public List<Video> getVideos(@RequestParam(required = false) String grade,
                                  @RequestParam(required = false) String subject) {
        return videoService.findByGradeAndSubject(grade, subject);
    }

    /** Grade is resolved server-side from the student's own record, not from client input. */
    @GetMapping("/{studentId}/videos")
    public List<Video> getVideosForStudent(@PathVariable String studentId,
                                            @RequestParam(required = false) String subject) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));
        return videoService.findByGradeAndSubject(String.valueOf(student.getGrade()), subject);
    }
}
