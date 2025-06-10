package com.airline.airlinebooking.repository;

import com.airline.airlinebooking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByFlightCode(String flightCode);
    List<Booking> findByUsername(String username);
}
