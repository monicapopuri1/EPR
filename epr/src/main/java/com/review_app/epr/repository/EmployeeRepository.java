package com.review_app.epr.repository;

import com.review_app.epr.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Add custom methods here later, like finding by email
}