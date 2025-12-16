package com.locallink.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
// Note: Requires the Lombok dependency in your pom.xml/build.gradle

@Data
@Document(collection = "servicesTree")
public class Service {

    @Id
    private String id;
    private String name;
    private String category;
    private String description;

    private PriceRate priceRate;
    private String address;
    private double rating;
    private boolean isAvailable;

    // 3. Ensure you have the getter for the 'location' field
    // The CRUCIAL geospatial field with a 2dsphere index
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    // Constructors (required for some libraries, recommended)
    public Service() {}

    public Service(String name, String description, GeoJsonPoint location) {
        this.name = name;
        this.description = description;
        this.location = location;
    }
    // --- Getters and Setters ---

}