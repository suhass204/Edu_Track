package com.edutrack.repository;

import com.edutrack.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByUsername(String username);
    Optional<Student> findByEmail(String email);
    boolean existsByUsernameOrEmail(String username, String email);
    List<Student> findByGrade(Integer grade);
}
