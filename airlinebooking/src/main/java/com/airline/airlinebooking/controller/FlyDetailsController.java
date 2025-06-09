package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.FlyDetails;
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

<<<<<<< HEAD



=======
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
}
