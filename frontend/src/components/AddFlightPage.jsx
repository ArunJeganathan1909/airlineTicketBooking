import React, { useState, useEffect } from "react";
import "../styles/components/AddFlightPage.css";

const AddFlightPage = ({ onClose, flightData }) => {
  const [flightCode, setFlightCode] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [departureAirportCodes, setDepartureAirportCodes] = useState("");
  const [travelingTime, setTravelingTime] = useState("");

  useEffect(() => {
    if (flightData) {
      setFlightCode(flightData.flightCode);
      setAirlineName(flightData.airlineName);
      setDepartureAirportCodes(flightData.departureAirportCodes.join(", "));
      setTravelingTime(flightData.travelingTime);
    } else {
      setFlightCode("");
      setAirlineName("");
      setDepartureAirportCodes("");
      setTravelingTime("");
    }
  }, [flightData]);

  const handleFlightSubmit = async (e) => {
    e.preventDefault();

    const flightPayload = {
      flightCode,
      airlineName,
      departureAirportCodes: departureAirportCodes
        .split(",")
        .map((code) => code.trim()),
      travelingTime,
      flyDetails: [],
    };

    try {
      const url = flightData
        ? `http://localhost:8080/api/flights/${flightData.id}`
        : "http://localhost:8080/api/flights";
      const method = flightData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flightPayload),
      });

      if (response.ok) {
        alert(
          flightData
            ? "Flight updated successfully!"
            : "Flight added successfully!"
        );
        onClose();
      } else {
        alert("Failed to save flight");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-flight-container">
      <div className="form-card">
        <h2>{flightData ? "Edit Flight" : "Add New Flight"}</h2>
        <form onSubmit={handleFlightSubmit} className="flight-form">
          <input
            type="text"
            placeholder="Flight Code"
            value={flightCode}
            onChange={(e) => setFlightCode(e.target.value)}
            required
            disabled={!!flightData} // Flight code is not editable during edit
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
            {flightData ? "Update Flight" : "Add Flight"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFlightPage;
