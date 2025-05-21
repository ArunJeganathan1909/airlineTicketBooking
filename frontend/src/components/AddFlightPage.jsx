import React, { useState } from "react";

const AddFlightPage = () => {
  const [flightCode, setFlightCode] = useState("");
  const [airlineName, setAirlineName] = useState("");
  const [departureAirportCodes, setDepartureAirportCodes] = useState("");
  const [travelingTime, setTravelingTime] = useState("");
  const [createdFlight, setCreatedFlight] = useState(null);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(flightData),
      });

      if (response.ok) {
        const data = await response.json();
        setCreatedFlight(data);
        alert("Flight added successfully!");
      } else {
        alert("Failed to add flight");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <div>
        <h2>Add New Flight</h2>
        <form onSubmit={handleFlightSubmit}>
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
            placeholder="Traveling Time (e.g., 2h 30m)"
            value={travelingTime}
            onChange={(e) => setTravelingTime(e.target.value)}
            required
          />
          <button type="submit">Add Flight</button>
        </form>

        {createdFlight && (
          <div>
            <h3>Flight Added: {createdFlight.flightCode}</h3>
            <p>Now you can add FlyDetails to this flight.</p>
            <a href={`/add-fly-details/${createdFlight.flightCode}`}>
              ➕ Go to Add FlyDetails
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFlightPage;
