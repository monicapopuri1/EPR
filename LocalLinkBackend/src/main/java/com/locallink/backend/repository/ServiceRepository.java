package com.locallink.backend.repository;

import com.locallink.backend.model.Service;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;


public interface ServiceRepository extends MongoRepository<Service, String> {

    /**
     * Geospatial query: Finds Services near a given geographical point within a specified distance.
     * Spring Data automatically executes the MongoDB $nearSphere query.
     */
    List<Service> findByLocationNear(Point point, Distance distance);

    /**
     * Combines geospatial query with a category filter.
     */
    List<Service> findByLocationNearAndCategory(Point point, Distance distance, String category);


    // Note: Standard CRUD methods like save(), existsById(), findAll(), etc., are inherited.


}