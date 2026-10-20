package com.edutrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "video_interactions")
public class VideoInteraction {
    @Id
    private String id;
    private String studentId; // email ref
    private String videoId;
    private double watchedPercent;
    private Double rating;
    private Instant completedAt = Instant.now();

    @JsonProperty("_id")
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    public String getVideoId() { return videoId; }
    public void setVideoId(String videoId) { this.videoId = videoId; }
    public double getWatchedPercent() { return watchedPercent; }
    public void setWatchedPercent(double watchedPercent) { this.watchedPercent = watchedPercent; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
