package com.review_app.epr.controller;

import com.review_app.epr.entity.Review;
import com.review_app.epr.repository.ReviewRepository;
import com.review_app.epr.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews") // <-- Base path
public class ReviewController {
    private final ReviewService reviewService;

    private static final Logger logger = LoggerFactory.getLogger(ReviewController.class);
    //private final ReviewService reviewService;
    private final ReviewRepository reviewRepository; // <--- NEW Field

    // 1. Single Constructor to Inject BOTH Dependencies
    public ReviewController(ReviewService reviewService, ReviewRepository reviewRepository) {
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository; // <--- NEW Injection
    }

    @GetMapping // <-- Mapping to the base path /api/v1/reviews
    public List<Review> getAllReviews() {
        return reviewService.findAllReviews();
    }
   //POST for adding reviews
    @PostMapping // Maps to POST /api/v1/reviews
    @ResponseStatus(HttpStatus.CREATED) // Sets the HTTP status code to 201 Created
    public Review createReview(@RequestBody Review review) {
        logger.info("Received POST request for review: {}");
        return reviewService.saveReview(review);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review updatedReview) {
        // 1. Find the existing review

        return reviewRepository.findById(id).map(review -> {
                    // 2. Update the fields based on the payload from the React form
                    logger.info("comment" + updatedReview.getContent());
                    review.setContent(updatedReview.getContent()); // New comment
                    review.setRating(updatedReview.getRating());   // New rating
                    review.setStatus("COMPLETED");                // Set status to COMPLETED

                    // 3. Save and return
                    Review savedReview = reviewRepository.save(review);
                    return ResponseEntity.ok(savedReview);
                })
                .orElseGet(() -> ResponseEntity.notFound().build()); // Return 404 if ID not found
    }

}