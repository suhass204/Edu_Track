package com.edutrack.repository;

import com.edutrack.model.VideoInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface VideoInteractionRepository extends MongoRepository<VideoInteraction, String> {
    List<VideoInteraction> findByStudentId(String studentId);
}
