package com.edutrack.repository;

import com.edutrack.model.Teacher;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TeacherRepository extends MongoRepository<Teacher, String> {
    Optional<Teacher> findByUsername(String username);
    Optional<Teacher> findByEmail(String email);
    boolean existsByUsernameOrEmail(String username, String email);
}
