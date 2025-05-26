import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FilteredFlyDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);

  const departure = searchParams.get("departure");
  const arrival = searchParams.get("arrival");
  const date = searchParams.get("date");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/fly-details/search?departureCode=${departure}&arrivalCode=${arrival}&date=${date}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Failed to fetch filtered flights", err);
      }
    };

    if (departure && arrival && date) fetchData();
  }, [departure, arrival, date]);

  return (
    <div>
      <h2>Flights from {departure} to {arrival} on {date}</h2>
      {results.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <ul>
          {results.map((flight) => (
            <li key={flight.id}>
              Flight Code: {flight.flightCode} | Departure: {flight.departureTime} | Arrival: {flight.arrivalTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilteredFlyDetailsPage;
