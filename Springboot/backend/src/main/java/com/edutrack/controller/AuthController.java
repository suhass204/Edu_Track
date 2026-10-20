package com.edutrack.controller;

import com.edutrack.model.Student;
import com.edutrack.model.Teacher;
import com.edutrack.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/setup-admin")
    public ResponseEntity<Map<String, Object>> setupAdmin(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.setupAdmin(body.get("username"), body.get("password")));
    }

    @PostMapping("/admin-login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> body) {
        boolean ok = authService.adminLogin(body.get("username"), body.get("password"));
        if (ok) return ResponseEntity.ok(Map.of("success", true));
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false));
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/add-teacher")
    public ResponseEntity<Map<String, Object>> addTeacher(@RequestBody Map<String, Object> body) {
        Teacher teacher = authService.addTeacher(
            (String) body.get("username"), (String) body.get("password"),
            (String) body.get("name"), (String) body.get("email"),
            (List<String>) body.get("subjects"));
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Teacher added successfully",
            "teacher", AuthService.teacherView(teacher)));
    }

    @SuppressWarnings("unchecked")
    @PostMapping("/add-student")
    public ResponseEntity<Map<String, Object>> addStudent(@RequestBody Map<String, Object> body) {
        Object gradeRaw = body.get("grade");
        Integer grade = gradeRaw == null ? null :
            (gradeRaw instanceof Number n ? n.intValue() : Integer.parseInt(gradeRaw.toString().replaceAll("[^0-9]", "")));
        Student student = authService.addStudent(
            (String) body.get("username"), (String) body.get("password"),
            (String) body.get("name"), (String) body.get("email"),
            grade, (List<String>) body.get("subjects"));
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Student added successfully",
            "student", AuthService.studentView(student)));
    }

    @PostMapping("/teacher-login")
    public ResponseEntity<Map<String, Object>> teacherLogin(@RequestBody Map<String, String> body) {
        Teacher teacher = authService.teacherLogin(body.get("username"), body.get("password"));
        if (teacher == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "error", "Invalid credentials"));
        }
        return ResponseEntity.ok(Map.of("success", true, "teacher", AuthService.teacherView(teacher)));
    }

    @PostMapping("/student-login")
    public ResponseEntity<Map<String, Object>> studentLogin(@RequestBody Map<String, String> body) {
        Student student = authService.studentLogin(body.get("username"), body.get("password"));
        if (student == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "error", "Invalid credentials"));
        }
        return ResponseEntity.ok(Map.of("success", true, "student", AuthService.studentView(student)));
    }

    @GetMapping("/user/teacher/{teacherId}")
    public ResponseEntity<Map<String, Object>> getTeacher(@PathVariable String teacherId) {
        Teacher teacher = authService.getTeacher(teacherId);
        if (teacher == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "error", "Teacher not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, "teacher", AuthService.teacherView(teacher)));
    }

    @GetMapping("/user/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getStudent(@PathVariable String studentId) {
        Student student = authService.getStudent(studentId);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "error", "Student not found"));
        }
        return ResponseEntity.ok(Map.of("success", true, "student", AuthService.studentView(student)));
    }
}
