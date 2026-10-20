package com.edutrack.service;

import com.edutrack.exception.ApiException;
import com.edutrack.model.Admin;
import com.edutrack.model.Student;
import com.edutrack.model.Teacher;
import com.edutrack.repository.AdminRepository;
import com.edutrack.repository.StudentRepository;
import com.edutrack.repository.TeacherRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuthService {

    private final AdminRepository adminRepository;
    private final TeacherRepository teacherRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AdminRepository adminRepository, TeacherRepository teacherRepository,
                        StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.teacherRepository = teacherRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> setupAdmin(String username, String password) {
        if (adminRepository.findByUsername(username).isPresent()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Admin already exists");
        }
        Admin admin = new Admin(username, username, passwordEncoder.encode(password));
        adminRepository.save(admin);
        return Map.of("msg", "Admin created");
    }

    public boolean adminLogin(String username, String password) {
        return adminRepository.findByUsername(username)
            .map(a -> passwordEncoder.matches(password, a.getPassword()))
            .orElse(false);
    }

    public Teacher addTeacher(String username, String password, String name, String email, List<String> subjects) {
        if (teacherRepository.existsByUsernameOrEmail(username, email)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Teacher with this username or email already exists");
        }
        Teacher teacher = new Teacher();
        teacher.setId(email);
        teacher.setUsername(username);
        teacher.setPassword(passwordEncoder.encode(password));
        teacher.setName(name != null ? name : "Teacher");
        teacher.setEmail(email != null ? email : username + "@school.edu");
        teacher.setSubjects(subjects != null ? subjects : List.of("Mathematics"));
        return teacherRepository.save(teacher);
    }

    public Student addStudent(String username, String password, String name, String email, Integer grade, List<String> subjects) {
        if (studentRepository.existsByUsernameOrEmail(username, email)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Student with this username or email already exists");
        }
        Student student = new Student();
        student.setId(email);
        student.setUsername(username);
        student.setPassword(passwordEncoder.encode(password));
        student.setName(name != null ? name : "Student");
        student.setEmail(email != null ? email : username + "@school.edu");
        student.setGrade(grade != null ? grade : 10);
        student.setSubjects(subjects != null ? subjects : List.of("Mathematics", "Science"));
        return studentRepository.save(student);
    }

    public Teacher teacherLogin(String username, String password) {
        Teacher teacher = teacherRepository.findByUsername(username)
            .filter(t -> passwordEncoder.matches(password, t.getPassword()))
            .orElse(null);
        return teacher;
    }

    public Student studentLogin(String username, String password) {
        return studentRepository.findByUsername(username)
            .filter(s -> passwordEncoder.matches(password, s.getPassword()))
            .orElse(null);
    }

    public Teacher getTeacher(String teacherId) {
        return teacherRepository.findById(teacherId).orElse(null);
    }

    public Teacher updateTeacher(String teacherId, String name, List<String> subjects) {
        Teacher teacher = teacherRepository.findById(teacherId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Teacher not found"));
        if (name != null && !name.isBlank()) teacher.setName(name);
        if (subjects != null) teacher.setSubjects(subjects);
        return teacherRepository.save(teacher);
    }

    public Student getStudent(String studentId) {
        return studentRepository.findById(studentId).orElse(null);
    }

    public static Map<String, Object> teacherView(Teacher t) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("_id", t.getId());
        m.put("username", t.getUsername());
        m.put("name", t.getName());
        m.put("email", t.getEmail());
        m.put("subjects", t.getSubjects());
        return m;
    }

    public static Map<String, Object> studentView(Student s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("_id", s.getId());
        m.put("username", s.getUsername());
        m.put("name", s.getName());
        m.put("email", s.getEmail());
        m.put("grade", s.getGrade());
        m.put("subjects", s.getSubjects());
        return m;
    }
}
