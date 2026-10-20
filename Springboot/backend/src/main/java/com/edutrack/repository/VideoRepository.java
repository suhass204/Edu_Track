package com.edutrack.repository;

import com.edutrack.model.Video;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByGradeAndSubject(String grade, String subject);
    List<Video> findByIdIn(List<String> ids);
}
