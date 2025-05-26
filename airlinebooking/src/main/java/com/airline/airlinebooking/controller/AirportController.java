package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.Airport;
import com.airline.airlinebooking.service.AirportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/airports")
public class AirportController {

    @Autowired
    private AirportService airportService;

    @PostMapping
    public Airport addAirport(@RequestBody Airport airport) {
        return airportService.addAirport(airport);
    }

    @GetMapping
    public List<Airport> getAllAirports() {
        return airportService.getAllAirports();
    }

    @GetMapping("/{id}")
    public Airport getAirportById(@PathVariable Long id) {
        return airportService.getAirportById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteAirport(@PathVariable Long id) {
        airportService.deleteAirport(id);
    }
}
