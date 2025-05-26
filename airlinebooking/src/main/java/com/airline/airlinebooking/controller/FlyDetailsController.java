package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.Flight;
import com.airline.airlinebooking.model.FlyDetails;
import com.airline.airlinebooking.repository.FlightRepository;
import com.airline.airlinebooking.repository.FlyDetailsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    @Transactional
    public List<FlyDetails> addFlyDetailsToFlight(@PathVariable String flightCode, @RequestBody FlyDetails flyDetails) {
        Flight flight = flightRepository.findAll().stream()
                .filter(f -> f.getFlightCode().equalsIgnoreCase(flightCode))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Flight not found with flightCode: " + flightCode));

        flyDetails.setFlightCode(flightCode);
        FlyDetails outbound = flyDetailsRepository.save(flyDetails);
        flight.getFlyDetails().add(outbound);

        List<FlyDetails> generatedDetails = new ArrayList<>();
        generatedDetails.add(outbound);

        // Parse travelingTime string (e.g., "2H30M") into Duration
        Duration travelDuration = parseDurationFromString(flight.getTravelingTime());

        // Create round trips for the next 2 months, every 7 days (14-day cycle)
        LocalDateTime nextDeparture = outbound.getArrivalTime().plus(outbound.getRestTime());
        LocalDateTime endDate = outbound.getDepartureTime().plusMonths(2);

        boolean isReturn = true;
        FlyDetails previous = outbound;

        while (nextDeparture.isBefore(endDate)) {
            FlyDetails next = new FlyDetails();
            next.setFlightCode(flightCode);

            if (isReturn) {
                next.setDepartureAirportCode(previous.getArrivalAirportCode());
                next.setArrivalAirportCode(previous.getDepartureAirportCode());
            } else {
                next.setDepartureAirportCode(previous.getDepartureAirportCode());
                next.setArrivalAirportCode(previous.getArrivalAirportCode());
            }

            next.setDepartureTime(nextDeparture);
            next.setArrivalTime(nextDeparture.plus(travelDuration));
            next.setRestTime(outbound.getRestTime());

            nextDeparture = next.getArrivalTime().plus(next.getRestTime());

            FlyDetails saved = flyDetailsRepository.save(next);
            flight.getFlyDetails().add(saved);
            generatedDetails.add(saved);

            isReturn = !isReturn; // alternate directions
            previous = next;
        }

        flightRepository.save(flight);
        return generatedDetails;
    }

    private Duration parseDurationFromString(String timeStr) {
        try {
            return Duration.parse("PT" + timeStr.toUpperCase().replace("H", "H").replace("M", "M"));
        } catch (Exception e) {
            throw new RuntimeException("Invalid travelingTime format. Expected something like '2H30M'.");
        }
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

    @GetMapping("/search")
    public List<FlyDetails> searchFlights(
            @RequestParam String departureCode,
            @RequestParam String arrivalCode,
            @RequestParam String date // Format: yyyy-MM-dd
    ) {
        LocalDateTime start = LocalDateTime.parse(date + "T00:00:00");
        LocalDateTime end = LocalDateTime.parse(date + "T23:59:59");
        return flyDetailsRepository.findByDepartureAirportCodeAndArrivalAirportCodeAndDepartureTimeBetween(
                departureCode, arrivalCode, start, end
        );
    }

}
