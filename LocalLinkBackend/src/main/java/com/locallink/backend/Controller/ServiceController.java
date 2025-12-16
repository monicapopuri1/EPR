package com.locallink.backend.Controller;

import com.locallink.backend.model.Service;
import com.locallink.backend.service.ServiceService;
import com.locallink.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;
    private final ServiceService serviceService;
    // Dependency Injection: Spring automatically provides the ServiceService bean
    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }
    // --- SEARCH API ENDPOINT ---
    // Example call: /api/services/nearby?lat=40.7100&lon=-74.0000&maxDistanceInKm=10
    @GetMapping("/nearby") // HTTP GET to /api/services/nearby
    public List<Service> getNearbyServices(
            @RequestParam double lat, // Query Parameter: latitude
            @RequestParam double lon, // Query Parameter: longitude
            @RequestParam(defaultValue = "5") double maxDistanceInKm) { // Query Parameter: radius (optional, defaults to 5km)
        System.out.println("Hey I am in getNearbyServices of controller");
        // 1. Prepare MongoDB GeoJSON format: Point(longitude, latitude)
        Point point = new Point(lon, lat);

        // 2. Prepare Distance in Kilometers
        Distance distance = new Distance(maxDistanceInKm, Metrics.KILOMETERS);
        System.out.println("Hey I am in getNearbyServices of controller");
        // 3. Delegate the search to the service layer
        return serviceService.findNearbyServices(point, distance);
    }
    // --- Booking Placeholder (Example of another endpoint) ---
    @PostMapping("/api/{serviceId}/book")
    public ResponseEntity<String> bookServiceClient(@PathVariable String serviceId) {
        // In a real application, implement booking logic here
        if (serviceRepository.existsById(serviceId)) {
            return ResponseEntity.ok("Service " + serviceId + " booked successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // API Endpoint 1: POST to CREATE a new service
    @PostMapping // HTTP POST to /api/v1/services
    public Service addService(@RequestBody Service newService) {
        // Delegates logic to the Service layer
        System.out.println("Hey I am in addService of controller");
        return serviceService.createService(newService);
    }

    // API Endpoint 2: GET to LIST all services
    @GetMapping // New, unique path: /api/services/all
    public List<Service> getServices() {
        // Delegates logic to the Service layer
        System.out.println("Hey I am in getServices of controller");
        return serviceService.findAllServices();
    }


}