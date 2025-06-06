import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilteredFlyDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);

  const departure = searchParams.get("departure");
  const arrival = searchParams.get("arrival");
  const date = searchParams.get("date");
  const returnDate = searchParams.get("returnDate");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `http://localhost:8080/api/fly-details/search?departureCode=${departure}&arrivalCode=${arrival}&date=${date}`;
        if (returnDate) {
          url += `&returnDate=${returnDate}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch filtered flights", err);
      }
    };

    if (departure && arrival && date) fetchData();
  }, [departure, arrival, date, returnDate]);

  // Separate outbound and return flights
  const outboundFlights = results.filter(
    (f) =>
      f.departureAirportCode === departure && f.arrivalAirportCode === arrival
  );

  const returnFlights = results.filter(
    (f) =>
      f.departureAirportCode === arrival && f.arrivalAirportCode === departure
  );

  return (
    <div>
      <h2>
        Flights from {departure} to {arrival} on {date}
      </h2>
      {outboundFlights.length === 0 ? (
        <p>No outbound flights found.</p>
      ) : (
        <ul>
          {outboundFlights.map((flight) => (
            <li key={flight.id}>
              Flight Code: {flight.flightCode} | Departure:{" "}
              {new Date(flight.departureTime).toLocaleString()} | Arrival:{" "}
              {new Date(flight.arrivalTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}

      {returnDate && (
        <>
          <h2>
            Return Flights from {arrival} to {departure} on {returnDate}
          </h2>
          {returnFlights.length === 0 ? (
            <p>No return flights found.</p>
          ) : (
            <ul>
              {returnFlights.map((flight) => (
                <li key={flight.id}>
                  Flight Code: {flight.flightCode} | Departure:{" "}
                  {new Date(flight.departureTime).toLocaleString()} |
                  Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default FilteredFlyDetailsPage;
