package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.Flight;
import com.airline.airlinebooking.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @Autowired
    private FlightRepository flightRepository;



    @PostMapping
    public Flight addFlight(@RequestBody Flight flight) {
        return flightRepository.save(flight);
    }

    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    @GetMapping("/{id}")
    public Flight getFlight(@PathVariable long id) {
        return flightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteFlight(@PathVariable long id) {
        flightRepository.deleteById(id);
    }
}
