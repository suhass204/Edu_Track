package com.edutrack.repository;

import com.edutrack.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProgressRepository extends MongoRepository<Progress, String> {
    List<Progress> findByStudentId(String studentId);
}
