package com.airline.airlinebooking.controller;

import com.airline.airlinebooking.model.Booking;
import com.airline.airlinebooking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingRepository.save(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/flight/{flightCode}")
    public List<Booking> getBookingsByFlightCode(@PathVariable String flightCode) {
        return bookingRepository.findByFlightCode(flightCode);
    }

    @GetMapping("/user/{username}")
    public List<Booking> getBookingsByUser(@PathVariable String username) {
        return bookingRepository.findByUsername(username);
    }
}
