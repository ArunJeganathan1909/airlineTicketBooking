import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "../styles/components/BookingForm.css";
import { useUser } from "../context/UserContext";
import Navbar from "./Navbar";

const BookingForm = () => {
  const location = useLocation();
  const { outbound, returnFlight } = location.state || {};
  const { user } = useUser();

  const [travelers, setTravelers] = useState([
    { name: "", age: "", gender: "", passportNumber: "" },
  ]);

  const handleTravelerChange = (index, field, value) => {
    const updated = [...travelers];
    updated[index][field] = value;
    setTravelers(updated);
  };

  const handleAddTraveler = () => {
    setTravelers([
      ...travelers,
      { name: "", age: "", gender: "", passportNumber: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      flightCode: outbound.flightCode,
      outboundTime: outbound.departureTime,
      returnTime: returnFlight ? returnFlight.departureTime : null,
      passengers: travelers,
      username: user?.username,
    };
    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Booking successful!");
      } else {
        alert("Failed to book ticket.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("An error occurred while booking.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="booking-container">
        <h2>Book Ticket</h2>

        <div className="flight-details">
          <h3>Outbound Flight</h3>
          <p>Flight Code: {outbound.flightCode}</p>
          <p>Departure: {new Date(outbound.departureTime).toLocaleString()}</p>
          <p>Arrival: {new Date(outbound.arrivalTime).toLocaleString()}</p>

          {returnFlight && (
            <>
              <h3>Return Flight</h3>
              <p>Flight Code: {returnFlight.flightCode}</p>
              <p>
                Departure:{" "}
                {new Date(returnFlight.departureTime).toLocaleString()}
              </p>
              <p>
                Arrival: {new Date(returnFlight.arrivalTime).toLocaleString()}
              </p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="traveler-form">
          <h3>Traveler Details</h3>
          {travelers.map((traveler, index) => (
            <div key={index} className="traveler-fields">
              <input
                type="text"
                placeholder="Name"
                value={traveler.name}
                onChange={(e) =>
                  handleTravelerChange(index, "name", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Age"
                value={traveler.age}
                onChange={(e) =>
                  handleTravelerChange(index, "age", e.target.value)
                }
                required
              />
              <select
                value={traveler.gender}
                onChange={(e) =>
                  handleTravelerChange(index, "gender", e.target.value)
                }
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="text"
                placeholder="Passport Number"
                value={traveler.passportNumber}
                onChange={(e) =>
                  handleTravelerChange(index, "passportNumber", e.target.value)
                }
                required
              />
            </div>
          ))}

          <button type="button" onClick={handleAddTraveler}>
            ➕ Add Traveler
          </button>
          <button type="submit" className="submit-button">
            Book Now
          </button>
        </form>
      </div>
    </>
  );
};

export default BookingForm;
