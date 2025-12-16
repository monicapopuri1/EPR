package com.review_app.epr.service;

import com.review_app.epr.entity.Review;
import com.review_app.epr.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    //METHOD TO view all reviews
    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }

    // Method to save a new review
    public Review saveReview(Review review) {
        // This calls the JpaRepository's built-in save method
        return reviewRepository.save(review);
    }}