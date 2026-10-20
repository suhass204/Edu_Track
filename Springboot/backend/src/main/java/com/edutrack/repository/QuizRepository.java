package com.edutrack.repository;

import com.edutrack.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByTeacherIdOrderByCreatedAtDesc(String teacherId);
    List<Quiz> findByGrade(Integer grade);
}
