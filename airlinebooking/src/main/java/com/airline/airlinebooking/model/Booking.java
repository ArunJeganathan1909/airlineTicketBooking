package com.airline.airlinebooking.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

// Booking.java
@Entity
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightCode;
    private String username; // ✅ Add this field

    private LocalDateTime outboundTime;
    private LocalDateTime returnTime;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PassengerDetail> passengers;
}

