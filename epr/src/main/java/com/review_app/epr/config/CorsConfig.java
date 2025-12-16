package com.review_app.epr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//CORS are important to implement in order to connect in UI which is in different URL
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/api/v1/**") // Apply this CORS policy to all paths under /api/v1
                .allowedOrigins("*") // Allows requests from ANY origin (for development)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allows common HTTP methods
                .allowedHeaders("*") // Allows all headers
                .allowCredentials(false) // Not using cookies/session for now
                .maxAge(3600); // How long the pre-flight response can be cached
    }
}