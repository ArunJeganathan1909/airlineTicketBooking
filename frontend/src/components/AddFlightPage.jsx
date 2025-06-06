import React, { useState } from "react";
import "../styles/components/AddFlightPage.css";

const AddFlightPage = ({ onClose }) => {
  const [flightCode, setFlightCode] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [departureAirportCodes, setDepartureAirportCodes] = useState("");
  const [travelingTime, setTravelingTime] = useState("");

  const handleFlightSubmit = async (e) => {
    e.preventDefault();

    const flightData = {
      flightCode,
      airlineName,
      departureAirportCodes: departureAirportCodes
        .split(",")
        .map((code) => code.trim()),
      travelingTime,
      flyDetails: [],
    };

    try {
      const response = await fetch("http://localhost:8080/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightData),
      });

      if (response.ok) {
        alert("Flight added successfully!");
        // Reset form
        setFlightCode("");
        setAirlineName("");
        setDepartureAirportCodes("");
        setTravelingTime("");
        onClose(); // Close modal and refresh flights
      } else {
        alert("Failed to add flight");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-flight-container">
      <div className="form-card">
        <h2>Add New Flight</h2>
        <form onSubmit={handleFlightSubmit} className="flight-form">
          <input
            type="text"
            placeholder="Flight Code"
            value={flightCode}
            onChange={(e) => setFlightCode(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Airline Name"
            value={airlineName}
            onChange={(e) => setAirlineName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Departure Airport Codes (comma-separated)"
            value={departureAirportCodes}
            onChange={(e) => setDepartureAirportCodes(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Traveling Time (e.g., 2H30M)"
            value={travelingTime}
            onChange={(e) => setTravelingTime(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">
            Add Flight
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFlightPage;
