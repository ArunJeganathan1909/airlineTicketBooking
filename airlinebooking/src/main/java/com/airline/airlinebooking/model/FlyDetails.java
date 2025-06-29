package com.airline.airlinebooking.model;

import com.fasterxml.jackson.annotation.JsonFormat;
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

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime departureTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private LocalDateTime arrivalTime;

    @Column(name = "rest_time")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private Duration restTime;
}