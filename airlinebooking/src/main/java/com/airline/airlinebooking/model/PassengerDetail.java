package com.airline.airlinebooking.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class PassengerDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String passportNumber;
    private String gender; // Male or Female
}
