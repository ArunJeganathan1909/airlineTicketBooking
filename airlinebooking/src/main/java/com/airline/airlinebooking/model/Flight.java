package com.airline.airlinebooking.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightCode;
    private String airlineName;

    @ElementCollection
    private List<String> departureAirportCodes;

    private  String travelingTime;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FlyDetails> flyDetails;;
}
