package com.review_app.epr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // NEW IMPORT

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Corrected syntax for Spring Security 6+
        http
                // 1. Disable CSRF (Cross-Site Request Forgery) for API development
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configure authorization rules
                .authorizeHttpRequests(authorize -> authorize
                        // Allow ALL requests to any URL
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}