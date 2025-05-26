package com.airline.airlinebooking.repository;

import com.airline.airlinebooking.model.FlyDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FlyDetailsRepository extends JpaRepository<FlyDetails, Long> {
    List<FlyDetails> findByFlightCode(String flightCode);

    List<FlyDetails> findByDepartureAirportCodeAndArrivalAirportCodeAndDepartureTimeBetween(
            String departureCode,
            String arrivalCode,
            LocalDateTime start,
            LocalDateTime end
    );
}
