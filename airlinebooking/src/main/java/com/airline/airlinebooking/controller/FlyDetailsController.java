package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.Flight;
import com.airline.airlinebooking.model.FlyDetails;
import com.airline.airlinebooking.repository.FlightRepository;
import com.airline.airlinebooking.repository.FlyDetailsRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public List<List<FlyDetails>> searchFlights(
            @RequestParam String departureCode,
            @RequestParam String arrivalCode,
            @RequestParam String date, // leaving on
            @RequestParam(required = false) String returnDate // returning on
    ) {
        List<List<FlyDetails>> pairedResults = new ArrayList<>();

        // Outbound
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

            // Pair outbound and return flights based on same airline
            for (FlyDetails outbound : outboundFlights) {
                Flight flight = flightRepository.findAll().stream()
                        .filter(f -> f.getFlightCode().equalsIgnoreCase(outbound.getFlightCode()))
                        .findFirst()
                        .orElse(null);

                if (flight != null) {
                    String airlineName = flight.getAirlineName();
                    List<FlyDetails> matchingReturns = new ArrayList<>();
                    for (FlyDetails ret : returnFlights) {
                        Flight retFlight = flightRepository.findAll().stream()
                                .filter(f -> f.getFlightCode().equalsIgnoreCase(ret.getFlightCode()))
                                .findFirst()
                                .orElse(null);

                        if (retFlight != null && retFlight.getAirlineName().equalsIgnoreCase(airlineName)) {
                            // Add as a pair
                            List<FlyDetails> pair = new ArrayList<>();
                            pair.add(outbound);
                            pair.add(ret);
                            pairedResults.add(pair);
                        }
                    }
                }
            }
        } else {
            // One-way trip, return each outbound flight as its own pair (with one element)
            for (FlyDetails outbound : outboundFlights) {
                List<FlyDetails> pair = new ArrayList<>();
                pair.add(outbound);
                pairedResults.add(pair);
            }
        }

        return pairedResults;
    }

}
