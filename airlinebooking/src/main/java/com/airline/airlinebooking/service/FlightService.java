package com.airline.airlinebooking.service;

import com.airline.airlinebooking.model.Flight;
import com.airline.airlinebooking.model.FlyDetails;
import com.airline.airlinebooking.repository.FlightRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class FlightService {

    @Autowired
    private FlightRepository flightRepository;

    public Flight createFlightWithReturn(Flight flight) {
        List<FlyDetails> details = flight.getFlyDetails();

        if (details.size() == 1) {
            FlyDetails outbound = details.get(0);

            FlyDetails inbound = new FlyDetails();
            inbound.setDepartureAirportCode(outbound.getArrivalAirportCode());
            inbound.setArrivalAirportCode(outbound.getDepartureAirportCode());

            // Calculate return departure time with rest
            LocalDateTime returnDeparture = outbound.getArrivalTime().plus(outbound.getRestTime());
            inbound.setDepartureTime(returnDeparture);

            // Estimate travel time based on outbound
            Duration travelDuration = Duration.between(outbound.getDepartureTime(), outbound.getArrivalTime());
            inbound.setArrivalTime(returnDeparture.plus(travelDuration));

            inbound.setRestTime(Duration.ZERO); // no rest on return
            details.add(inbound);
        }

        return flightRepository.save(flight);
    }
}
