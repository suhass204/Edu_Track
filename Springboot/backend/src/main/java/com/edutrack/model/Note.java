package com.edutrack.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "notes")
public class Note {
    @Id
    private String id;
    private String filename;
    private String grade;
    private Instant uploadDate = Instant.now();

    public Note() {}

    @JsonProperty("_id")
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
    public Instant getUploadDate() { return uploadDate; }
    public void setUploadDate(Instant uploadDate) { this.uploadDate = uploadDate; }
}
