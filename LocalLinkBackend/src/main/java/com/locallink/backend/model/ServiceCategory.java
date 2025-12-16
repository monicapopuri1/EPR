package com.locallink.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum ServiceCategory {
    @JsonProperty("Home Repair") // Map the enum value to the string used in frontend
    HOME_REPAIR,
    @JsonProperty("Health & Wellness")
    HEALTH,
    @JsonProperty("Education")
    EDUCATION,
    @JsonProperty("Cleaning")
    CLEANING,
    @JsonProperty("Technology")
    TECHNOLOGY,
    @JsonProperty("Other")
    OTHER
}