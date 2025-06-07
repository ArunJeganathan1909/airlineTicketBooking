package com.airline.airlinebooking.service;

import com.airline.airlinebooking.model.Airport;
import com.airline.airlinebooking.repository.AirportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportService {

    @Autowired
    private AirportRepository airportRepository;

    public Airport addAirport(Airport airport) {
        return airportRepository.save(airport);
    }

    public List<Airport> getAllAirports() {
        return airportRepository.findAll();
    }

    public Airport getAirportById(Long id) {
        return airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found with ID: " + id));
    }

    public void deleteAirport(Long id) {
        airportRepository.deleteById(id);
    }


}
