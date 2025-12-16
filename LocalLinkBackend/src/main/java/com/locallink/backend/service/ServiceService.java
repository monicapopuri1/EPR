package com.locallink.backend.service;

import com.locallink.backend.model.Service;
import com.locallink.backend.repository.ServiceRepository;
import java.util.List;
import java.util.Optional;
//Simport org.springframework.stereotype.Service;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
@org.springframework.stereotype.Service
public class ServiceService {

    // In-memory data store for demonstration
   // private final List<Service> services = new ArrayList<>();
    private final ServiceRepository serviceRepository;
    // 1. Business Logic: Create/Save a nßew Service

    // Dependency Injection via constructor
    public ServiceService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

   // 🛠️ STEP 2: REPLACE IN-MEMORY LOGIC WITH REPOSITORY CALLS

    // 1. Create/Save a new Service (uses the Repository)
    public Service createService(Service newService) {
        // The Repository will handle saving to MongoDB and generating the ID.
        return serviceRepository.save(newService);
    }

    // 2. Business Logic: Get all Services
    public List<Service> findAllServices() {
        return serviceRepository.findAll();
    }

    // --- NEW SEARCH METHOD ---
    /**
     * Finds services near the specified point within the given distance.
     * @param point The center point (longitude, latitude).
     * @param distance The maximum search radius.
     * @return A list of matching Service entities.
     */
    public List<Service> findNearbyServices(Point point, Distance distance) {
        // Business logic could be added here (e.g., logging the search area, pre-filtering)

        // Calls the custom method defined in the ServiceRepository interface
        return serviceRepository.findByLocationNear(point, distance);
    }
}