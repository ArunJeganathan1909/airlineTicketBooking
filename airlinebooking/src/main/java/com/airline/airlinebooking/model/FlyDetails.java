package com.airline.airlinebooking.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Duration;
import java.time.LocalDateTime;

@Entity
@Data
public class FlyDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String flightCode;

    private String departureAirportCode;
    private String arrivalAirportCode;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;

    @Column(name = "rest_time")
    private Duration restTime;
}
