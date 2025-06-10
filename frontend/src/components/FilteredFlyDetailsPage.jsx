import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "../styles/components/FilteredFlyDetailsPage.css";
import Navbar from "./Navbar";

const FilteredFlyDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const totalTravelers = location.state?.totalTravelers || 1; // fallback to 1

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
    navigate("/flight-booking", {
      state: {
        outbound: pair[0],
        returnFlight: pair[1] || null,
      },
    });
  };
  return (
    <>
      <Navbar />
      <div className="page-container">
        <h2>Filtered Flights</h2>
        {results.length === 0 ? (
          <p>No flights found.</p>
        ) : (
          <div className="flight-list">
            {results.map((pair, index) => (
              <div key={index} className="flight-item">
                <div className="flight-info">
                  <strong>Outbound:</strong> Flight Code: {pair[0].flightCode} |
                  Departure: {new Date(pair[0].departureTime).toLocaleString()}{" "}
                  | Arrival: {new Date(pair[0].arrivalTime).toLocaleString()}
                </div>

                {pair.length > 1 && (
                  <div className="flight-info">
                    <strong>Return:</strong> Flight Code: {pair[1].flightCode} |
                    Departure:{" "}
                    {new Date(pair[1].departureTime).toLocaleString()} |
                    Arrival: {new Date(pair[1].arrivalTime).toLocaleString()}
                  </div>
                )}

                {/* Calculate and display total booking price */}
                <div className="flight-info">
                  <strong>Total Price:</strong>{" "}
                  {pair[0].ticketPrice
                    ? `$${(pair[0].ticketPrice * totalTravelers).toFixed(2)}`
                    : "N/A"}
                </div>

                <button
                  className="book-button"
                  onClick={() => handleBookTicket(pair)}
                >
                  Book Ticket
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FilteredFlyDetailsPage;
