package com.locallink.backend.model;

import lombok.Data;
// Note: Requires the Lombok dependency in your pom.xml/build.gradle

@Data
public class PriceRate {
    private String type; // e.g., "Hourly", "Flat Fee", "Per Job"
    private double amount;
    private String currency = "USD";
}