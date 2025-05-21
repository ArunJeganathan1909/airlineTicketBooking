package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.Flight;
import com.airline.airlinebooking.model.FlyDetails;
import com.airline.airlinebooking.repository.FlightRepository;
import com.airline.airlinebooking.repository.FlyDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/fly-details")
public class FlyDetailsController {

    @Autowired
    private FlyDetailsRepository flyDetailsRepository;

    @Autowired
    private FlightRepository flightRepository;

    @PostMapping("/flight/{flightCode}")
    public FlyDetails addFlyDetailsToFlight(@PathVariable String flightCode,@RequestBody FlyDetails flyDetails) {
        Flight flight = flightRepository.findAll().stream()
                .filter(f -> f.getFlightCode().equalsIgnoreCase(flightCode))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Flight not found with flightCode: " + flightCode));

        flyDetails.setFlightCode(flightCode);

        // Save fly details independently
        FlyDetails saved = flyDetailsRepository.save(flyDetails);

        // Add to flight and update flight
        flight.getFlyDetails().add(saved);
        flightRepository.save(flight);

        return saved;
    }

    @GetMapping("/flight/{flightCode}")
    public List<FlyDetails> getFlyDetailsByFlightCode(@PathVariable String flightCode) {
        return flyDetailsRepository.findByFlightCode(flightCode);
    }

    @GetMapping("/{id}")
    public FlyDetails getFlyDetailById(@PathVariable long id) {
        return flyDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteFlyDetail(@PathVariable long id) {
        flyDetailsRepository.deleteById(id);
    }
}
