package com.review_app.epr.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "employees")//this maps the class with employee table in DB
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true) //Uniqueness on email id, Ensures no two employees can have the same email
    private String email;

    private String role; // e.g., "Manager", "Developer"

    public Employee() {}

    public Employee(String name, String email, String role) {
        this.name = name;
        this.email = email;
        this.role = role;
    }
        public Long getId() {
            return id;
        }

        public String getName() {
            return name; // <- Missing this returns null for the 'name' field
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }


        public void setId(Long id) {
            this.id = id;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setEmail() {
            this.email= email;
        }

        public void setRole() {
            this.role= role;
        }
    }
