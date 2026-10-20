package com.edutrack.service;

import com.edutrack.exception.ApiException;
import com.edutrack.model.Quiz;
import com.edutrack.model.Student;
import com.edutrack.repository.QuizRepository;
import com.edutrack.repository.StudentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final StudentRepository studentRepository;

    public QuizService(QuizRepository quizRepository, StudentRepository studentRepository) {
        this.quizRepository = quizRepository;
        this.studentRepository = studentRepository;
    }

    public Quiz create(Quiz quiz) {
        if (quiz.getTitle() == null || quiz.getSubject() == null || quiz.getGrade() == null
            || quiz.getDuration() == null || quiz.getQuestions() == null || quiz.getQuestions().isEmpty()
            || quiz.getDeadline() == null || quiz.getTeacherId() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "All required fields must be provided");
        }
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            Quiz.Question q = quiz.getQuestions().get(i);
            if (q.getQuestion() == null || q.getOptions() == null || q.getOptions().size() < 2) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Question " + (i + 1) + " is invalid. Must have question text and at least 2 options.");
            }
            if (q.getCorrectAnswer() == null || q.getCorrectAnswer() < 0 || q.getCorrectAnswer() >= q.getOptions().size()) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Question " + (i + 1) + " has invalid correct answer index.");
            }
        }
        quiz.recalculateTotalPoints();
        return quizRepository.save(quiz);
    }

    public List<Quiz> byTeacher(String teacherId) {
        return quizRepository.findByTeacherIdOrderByCreatedAtDesc(teacherId);
    }

    public List<Quiz> forStudent(String studentId) {
        Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));
        return activeQuizzesForGrade(student.getGrade());
    }

    public List<Quiz> byGrade(Integer grade) {
        return activeQuizzesForGrade(grade);
    }

    private List<Quiz> activeQuizzesForGrade(Integer grade) {
        Date now = new Date();
        return quizRepository.findByGrade(grade).stream()
            .filter(Quiz::isActive)
            .filter(q -> q.getDeadline() != null && q.getDeadline().after(now))
            .sorted(Comparator.comparing(Quiz::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
            .toList();
    }

    public Quiz get(String quizId) {
        return quizRepository.findById(quizId)
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Quiz not found"));
    }

    /** Returns quiz with answers stripped, validated for the given student. */
    public Quiz getForStudent(String quizId, String studentId) {
        Quiz quiz = get(quizId);
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null || !Objects.equals(student.getGrade(), quiz.getGrade())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You are not eligible to take this quiz");
        }
        boolean submitted = quiz.getSubmissions().stream().anyMatch(s -> s.getStudentId().equals(studentId));
        if (submitted) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You have already submitted this quiz");
        }
        for (Quiz.Question q : quiz.getQuestions()) {
            q.setCorrectAnswer(null);
        }
        return quiz;
    }

    public Map<String, Object> submit(String quizId, String studentId, List<Map<String, Object>> answers, Integer timeTaken) {
        Quiz quiz = get(quizId);
        boolean submitted = quiz.getSubmissions().stream().anyMatch(s -> s.getStudentId().equals(studentId));
        if (submitted) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "You have already submitted this quiz");
        }
        if (new Date().after(quiz.getDeadline())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Quiz deadline has passed");
        }

        int totalScore = 0;
        List<Quiz.Answer> graded = new ArrayList<>();
        for (int i = 0; i < quiz.getQuestions().size(); i++) {
            Quiz.Question question = quiz.getQuestions().get(i);
            final int idx = i;
            Map<String, Object> studentAnswer = answers.stream()
                .filter(a -> ((Number) a.get("questionIndex")).intValue() == idx)
                .findFirst().orElse(null);
            if (studentAnswer != null) {
                Integer selected = ((Number) studentAnswer.get("selectedAnswer")).intValue();
                boolean correct = selected.equals(question.getCorrectAnswer());
                int pts = correct ? question.getPoints() : 0;
                totalScore += pts;

                Quiz.Answer a = new Quiz.Answer();
                a.setQuestionIndex(i);
                a.setSelectedAnswer(selected);
                a.setCorrect(correct);
                a.setPointsEarned(pts);
                graded.add(a);
            }
        }
        int percentage = quiz.getTotalPoints() == 0 ? 0 : (int) Math.round((totalScore * 100.0) / quiz.getTotalPoints());

        Quiz.Submission submission = new Quiz.Submission();
        submission.setStudentId(studentId);
        submission.setScore(percentage);
        submission.setAnswers(graded);
        submission.setTimeTaken(timeTaken);
        quiz.getSubmissions().add(submission);
        quizRepository.save(quiz);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("success", true);
        result.put("message", "Quiz submitted successfully");
        result.put("score", percentage);
        result.put("totalPoints", quiz.getTotalPoints());
        result.put("earnedPoints", totalScore);
        return result;
    }

    public Quiz update(String quizId, Map<String, Object> updates) {
        Quiz quiz = get(quizId);
        if (updates.containsKey("title")) quiz.setTitle((String) updates.get("title"));
        if (updates.containsKey("subject")) quiz.setSubject((String) updates.get("subject"));
        if (updates.containsKey("isActive")) quiz.setActive((Boolean) updates.get("isActive"));
        quizRepository.save(quiz);
        return quiz;
    }

    public void delete(String quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Quiz not found");
        }
        quizRepository.deleteById(quizId);
    }

    /** Replicates p4's teacher progress-report aggregation (class stats, ranked students). */
    public Map<String, Object> progressReport(Integer gradeFilter) {
        List<Student> students = gradeFilter != null ? studentRepository.findByGrade(gradeFilter) : studentRepository.findAll();
        List<Quiz> quizzes = gradeFilter != null ? quizRepository.findByGrade(gradeFilter) : quizRepository.findAll();

        Map<String, List<Integer>> scoresByStudent = new LinkedHashMap<>();
        Map<String, List<Map<String, Object>>> quizzesByStudent = new LinkedHashMap<>();
        Map<String, Date> lastSubmissionByStudent = new LinkedHashMap<>();

        for (Quiz quiz : quizzes) {
            for (Quiz.Submission sub : quiz.getSubmissions()) {
                scoresByStudent.computeIfAbsent(sub.getStudentId(), k -> new ArrayList<>()).add(sub.getScore());
                Map<String, Object> qEntry = new LinkedHashMap<>();
                qEntry.put("quizId", quiz.getId());
                qEntry.put("title", quiz.getTitle());
                qEntry.put("subject", quiz.getSubject());
                qEntry.put("score", sub.getScore());
                qEntry.put("submittedAt", sub.getSubmittedAt());
                qEntry.put("timeTaken", sub.getTimeTaken());
                quizzesByStudent.computeIfAbsent(sub.getStudentId(), k -> new ArrayList<>()).add(qEntry);
                Date submittedAt = Date.from(sub.getSubmittedAt());
                lastSubmissionByStudent.merge(sub.getStudentId(), submittedAt, (a, b) -> b.after(a) ? b : a);
            }
        }

        List<Map<String, Object>> comprehensive = new ArrayList<>();
        for (Student s : students) {
            List<Integer> scores = scoresByStudent.getOrDefault(s.getId(), List.of());
            boolean hasData = !scores.isEmpty();
            int avg = hasData ? (int) Math.round(scores.stream().mapToInt(Integer::intValue).average().orElse(0)) : 0;
            String improvement = computeImprovement(scores);

            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("_id", s.getId());
            entry.put("name", s.getName());
            entry.put("username", s.getUsername());
            entry.put("grade", s.getGrade());
            entry.put("email", s.getEmail());
            entry.put("scores", scores);
            entry.put("quizzes", quizzesByStudent.getOrDefault(s.getId(), List.of()));
            entry.put("totalQuizzes", scores.size());
            entry.put("averageScore", avg);
            entry.put("improvement", improvement);
            entry.put("lastSubmission", lastSubmissionByStudent.get(s.getId()));
            entry.put("hasQuizData", hasData);
            comprehensive.add(entry);
        }

        comprehensive.sort((a, b) -> {
            boolean ah = (boolean) a.get("hasQuizData"), bh = (boolean) b.get("hasQuizData");
            if (ah && !bh) return -1;
            if (!ah && bh) return 1;
            return (int) b.get("averageScore") - (int) a.get("averageScore");
        });
        for (int i = 0; i < comprehensive.size(); i++) {
            comprehensive.get(i).put("rank", i + 1);
        }

        int totalStudents = comprehensive.size();
        long activeStudents = comprehensive.stream().filter(e -> (boolean) e.get("hasQuizData")).count();
        List<Map<String, Object>> withScores = comprehensive.stream().filter(e -> (int) e.get("averageScore") > 0).toList();
        int classAverage = withScores.isEmpty() ? 0 : (int) Math.round(withScores.stream().mapToInt(e -> (int) e.get("averageScore")).average().orElse(0));

        Map<String, Object> classStats = new LinkedHashMap<>();
        classStats.put("totalStudents", totalStudents);
        classStats.put("activeStudents", (int) activeStudents);
        classStats.put("inactiveStudents", totalStudents - (int) activeStudents);
        classStats.put("classAverage", classAverage);
        classStats.put("participationRate", totalStudents > 0 ? (int) Math.round((activeStudents * 100.0) / totalStudents) : 0);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("classStats", classStats);
        data.put("allStudents", comprehensive);
        data.put("topStudents", comprehensive.stream().filter(e -> (boolean) e.get("hasQuizData")).limit(10).toList());
        data.put("inactiveStudents", comprehensive.stream().filter(e -> !(boolean) e.get("hasQuizData")).toList());

        return Map.of("success", true, "data", data);
    }

    private String computeImprovement(List<Integer> scores) {
        if (scores.size() < 4) return "0%";
        int mid = scores.size() / 2;
        double firstHalf = scores.subList(0, mid).stream().mapToInt(Integer::intValue).average().orElse(0);
        double secondHalf = scores.subList(mid, scores.size()).stream().mapToInt(Integer::intValue).average().orElse(0);
        int improvement = (int) Math.round(secondHalf - firstHalf);
        return (improvement > 0 ? "+" : "") + improvement + "%";
    }
}
