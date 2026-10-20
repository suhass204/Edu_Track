package com.edutrack.model;

import org.springframework.data.annotation.CreatedDate;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String title;
    private String subject;
    private Integer grade;
    private String mode = "test"; // test | practice
    private Integer duration;
    private Integer numberOfQuestions;
    private List<Question> questions = new ArrayList<>();
    private String teacherId; // email ref
    private Date deadline;
    private boolean isActive = true;
    private int totalPoints = 0;
    private List<Submission> submissions = new ArrayList<>();

    @CreatedDate
    private Instant createdAt;
    @LastModifiedDate
    private Instant updatedAt;

    public static class Question {
        private String question;
        private List<String> options = new ArrayList<>();
        private Integer correctAnswer;
        private int points = 1;

        public String getQuestion() { return question; }
        public void setQuestion(String question) { this.question = question; }
        public List<String> getOptions() { return options; }
        public void setOptions(List<String> options) { this.options = options; }
        public Integer getCorrectAnswer() { return correctAnswer; }
        public void setCorrectAnswer(Integer correctAnswer) { this.correctAnswer = correctAnswer; }
        public int getPoints() { return points; }
        public void setPoints(int points) { this.points = points; }
    }

    public static class Answer {
        private int questionIndex;
        private Integer selectedAnswer;
        private boolean isCorrect;
        private int pointsEarned;

        public int getQuestionIndex() { return questionIndex; }
        public void setQuestionIndex(int questionIndex) { this.questionIndex = questionIndex; }
        public Integer getSelectedAnswer() { return selectedAnswer; }
        public void setSelectedAnswer(Integer selectedAnswer) { this.selectedAnswer = selectedAnswer; }
        public boolean isCorrect() { return isCorrect; }
        public void setCorrect(boolean correct) { isCorrect = correct; }
        public int getPointsEarned() { return pointsEarned; }
        public void setPointsEarned(int pointsEarned) { this.pointsEarned = pointsEarned; }
    }

    public static class Submission {
        private String studentId; // email ref
        private int score;
        private List<Answer> answers = new ArrayList<>();
        private Instant submittedAt = Instant.now();
        private Integer timeTaken;

        public String getStudentId() { return studentId; }
        public void setStudentId(String studentId) { this.studentId = studentId; }
        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }
        public List<Answer> getAnswers() { return answers; }
        public void setAnswers(List<Answer> answers) { this.answers = answers; }
        public Instant getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(Instant submittedAt) { this.submittedAt = submittedAt; }
        public Integer getTimeTaken() { return timeTaken; }
        public void setTimeTaken(Integer timeTaken) { this.timeTaken = timeTaken; }
    }

    public void recalculateTotalPoints() {
        this.totalPoints = questions.stream().mapToInt(Question::getPoints).sum();
    }

    @JsonProperty("_id")
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Integer getGrade() { return grade; }
    public void setGrade(Integer grade) { this.grade = grade; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }
    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
    public List<Question> getQuestions() { return questions; }
    public void setQuestions(List<Question> questions) { this.questions = questions; }
    public String getTeacherId() { return teacherId; }
    public void setTeacherId(String teacherId) { this.teacherId = teacherId; }
    public Date getDeadline() { return deadline; }
    public void setDeadline(Date deadline) { this.deadline = deadline; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
    public int getTotalPoints() { return totalPoints; }
    public void setTotalPoints(int totalPoints) { this.totalPoints = totalPoints; }
    public List<Submission> getSubmissions() { return submissions; }
    public void setSubmissions(List<Submission> submissions) { this.submissions = submissions; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
