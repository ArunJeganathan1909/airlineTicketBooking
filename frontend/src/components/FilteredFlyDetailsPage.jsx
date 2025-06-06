import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/components/FilteredFlyDetailsPage.css";

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

  const handleBookTicket = (pair) => {
    const outboundCode = pair[0]?.flightCode;
    const returnCode = pair[1]?.flightCode;

    alert(
      `Booking ticket:\nOutbound Flight: ${outboundCode}\nReturn Flight: ${
        returnCode || "N/A"
      }`
    );
  };

  return (
    <div className="page-container">
      <h2>Filtered Flights</h2>
      {results.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <div className="flight-list">
          {results.map((pair, index) => (
            <div key={index} className="flight-item">
              <div className="flight-info">
                <strong>Outbound:</strong> Flight Code: {pair[0].flightCode} | Departure:{" "}
                {new Date(pair[0].departureTime).toLocaleString()} | Arrival:{" "}
                {new Date(pair[0].arrivalTime).toLocaleString()}
              </div>

              {pair.length > 1 && (
                <div className="flight-info">
                  <strong>Return:</strong> Flight Code: {pair[1].flightCode} | Departure:{" "}
                  {new Date(pair[1].departureTime).toLocaleString()} | Arrival:{" "}
                  {new Date(pair[1].arrivalTime).toLocaleString()}
                </div>
              )}

              <button className="book-button" onClick={() => handleBookTicket(pair)}>
                Book Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilteredFlyDetailsPage;
