package com.review_app.epr.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reviews") // This maps the class to a table named 'reviews' in your database
public class Review {

    @Id // Specifies the primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Uses the DB's identity column for auto-incrementing
    private Long id;

    private String reviewerName;
    private String revieweeName;
    private String content;
    private int rating;
    private String status;

    // Default constructor (required by JPA/Hibernate)
    public Review() {
    }

    // Constructor for creating new objects (excluding the ID)
    public Review(String reviewerName, String revieweeName, String content, int rating) {
        this.reviewerName = reviewerName;
        this.revieweeName = revieweeName;
        this.content = content;
        this.rating = rating;
        this.status = "Pending"; // When review is created by admin, the status should be pending.
    }

    // --- GETTERS AND SETTERS ---
    public String getReviewerName() {
        return reviewerName;
    }

    public String getRevieweeName() {
        return revieweeName;
    }

    public Long getId() {
        return id;
    }

    public int getRating() {
        return rating;
    }

    public String getStatus() {
        return status;
    }

    public String getContent() {
        return content;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public void setRevieweeName(String revieweeName) {
        this.revieweeName = revieweeName;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public void setRating(int rating) {
        this.rating = rating;
    }
}
