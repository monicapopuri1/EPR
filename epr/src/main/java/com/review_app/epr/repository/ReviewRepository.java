package com.review_app.epr.repository;

import com.review_app.epr.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Spring Data JPA automatically provides methods like save(), findAll(), findById(), etc.
    // We don't need to write any methods here yet!

}
