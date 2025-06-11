package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.FlyDetails;
import com.airline.airlinebooking.repository.FlyDetailsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.airline.airlinebooking.model.Flight;
import com.airline.airlinebooking.repository.FlightRepository;

import java.time.Duration;
import java.time.LocalDate;
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

        Duration travelDuration = parseDurationFromString(flight.getTravelingTime());

        LocalDateTime nextDeparture = outbound.getArrivalTime().plus(outbound.getRestTime());
        LocalDateTime endDate = outbound.getDepartureTime().plusDays(10);

        FlyDetails previous = outbound;

        while (nextDeparture.isBefore(endDate)) {
            LocalDate flightDay = nextDeparture.toLocalDate();

            // Check if this flightCode has less than 4 flights for this date
            long flightCountForDay = flyDetailsRepository.findByFlightCode(flightCode).stream()
                    .filter(f -> f.getDepartureTime().toLocalDate().equals(flightDay))
                    .count();

            if (flightCountForDay >= 4) {
                // Skip this day (advance to the next day)
                nextDeparture = nextDeparture.plusDays(1).withHour(0).withMinute(0);
                continue;
            }

            FlyDetails next = new FlyDetails();
            next.setFlightCode(flightCode);

            // Always set departure from the last arrival airport
            next.setDepartureAirportCode(previous.getArrivalAirportCode());

            // Decide the arrival airport by toggling between the first outbound route
            if (next.getDepartureAirportCode().equalsIgnoreCase(outbound.getDepartureAirportCode())) {
                next.setArrivalAirportCode(outbound.getArrivalAirportCode());
            } else {
                next.setArrivalAirportCode(outbound.getDepartureAirportCode());
            }

            next.setDepartureTime(nextDeparture);
            next.setArrivalTime(nextDeparture.plus(travelDuration));
            next.setRestTime(outbound.getRestTime());

            // Check for duplicates
            boolean exists = flyDetailsRepository.existsByFlightCodeAndDepartureAirportCodeAndArrivalAirportCodeAndDepartureTime(
                    next.getFlightCode(),
                    next.getDepartureAirportCode(),
                    next.getArrivalAirportCode(),
                    next.getDepartureTime()
            );

            if (!exists) {
                FlyDetails saved = flyDetailsRepository.save(next);
                flight.getFlyDetails().add(saved);
                generatedDetails.add(saved);
            }

            nextDeparture = next.getArrivalTime().plus(next.getRestTime());
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

    @GetMapping
    public List<FlyDetails> getAllFlyDetails() {
        return flyDetailsRepository.findAll();
    }

    @GetMapping("/{id}")
    public FlyDetails getFlyDetailById(@PathVariable long id) {
        return flyDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight detail not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public void deleteFlyDetail(@PathVariable long id) {
        flyDetailsRepository.deleteById(id);
    }

    // (Existing search endpoint stays here)
    @GetMapping("/search")
    public List<List<FlyDetails>> searchFlights(
            @RequestParam String departureCode,
            @RequestParam String arrivalCode,
            @RequestParam String date, // leaving on
            @RequestParam(required = false) String returnDate // returning on
    ) {
        List<List<FlyDetails>> pairedResults = new ArrayList<>();

        // Outbound flights
        LocalDate localDate = LocalDate.parse(date);
        LocalDateTime start = localDate.atStartOfDay();
        LocalDateTime end = start.plusDays(1).minusSeconds(1);

        List<FlyDetails> outboundFlights = flyDetailsRepository
                .findByDepartureAirportCodeAndArrivalAirportCodeAndDepartureTimeBetween(
                        departureCode, arrivalCode, start, end);

        if (returnDate != null) {
            LocalDate returnLocalDate = LocalDate.parse(returnDate);
            LocalDateTime returnStart = returnLocalDate.atStartOfDay();
            LocalDateTime returnEnd = returnStart.plusDays(1).minusSeconds(1);

            List<FlyDetails> returnFlights = flyDetailsRepository
                    .findByDepartureAirportCodeAndArrivalAirportCodeAndDepartureTimeBetween(
                            arrivalCode, departureCode, returnStart, returnEnd);

            for (FlyDetails outbound : outboundFlights) {
                List<FlyDetails> pair = new ArrayList<>();
                pair.add(outbound);
                for (FlyDetails ret : returnFlights) {
                    pair.add(ret);
                    pairedResults.add(new ArrayList<>(pair));
                    pair.remove(ret);
                }
            }
        } else {
            for (FlyDetails outbound : outboundFlights) {
                List<FlyDetails> pair = new ArrayList<>();
                pair.add(outbound);
                pairedResults.add(pair);
            }
        }

        return pairedResults;
    }

    // Placeholder for update functionality
    @PutMapping("/{id}")
    @Transactional
    public FlyDetails updateFlyDetail(@PathVariable long id, @RequestBody FlyDetails updatedDetail) {
        FlyDetails existingDetail = flyDetailsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight detail not found with ID: " + id));

        existingDetail.setFlightCode(updatedDetail.getFlightCode());
        existingDetail.setDepartureAirportCode(updatedDetail.getDepartureAirportCode());
        existingDetail.setArrivalAirportCode(updatedDetail.getArrivalAirportCode());
        existingDetail.setDepartureTime(updatedDetail.getDepartureTime());
        existingDetail.setArrivalTime(updatedDetail.getArrivalTime());
        existingDetail.setRestTime(updatedDetail.getRestTime());

        return flyDetailsRepository.save(existingDetail);
    }


}