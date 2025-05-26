package com.airline.airlinebooking.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String airportName;
    private String airportCode;
    private String country;
    private String city;
}