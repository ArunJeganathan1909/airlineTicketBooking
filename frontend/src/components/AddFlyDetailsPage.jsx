import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/components/AddFlyDetailsPage.css"; // Ensure the path is correct

const AddFlyDetailsPage = () => {
  const { flightCode } = useParams();

  const [departureAirportCode, setDepartureAirportCode] = useState("");
  const [arrivalAirportCode, setArrivalAirportCode] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [restTime, setRestTime] = useState("00H00M");
  const [airportCodes, setAirportCodes] = useState([]);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/flights");
        const data = await res.json();
        const flight = data.find((f) => f.flightCode === flightCode);
        if (flight) {
          setAirportCodes(flight.departureAirportCodes || []);
        }
      } catch (err) {
        console.error("Failed to fetch flight data", err);
      }
    };

    fetchFlight();
  }, [flightCode]);

  const handleDepartureSelect = (value) => {
    setDepartureAirportCode(value);
    const alt = airportCodes.find((code) => code !== value);
    if (alt) setArrivalAirportCode(alt);
  };

  const handleArrivalSelect = (value) => {
    setArrivalAirportCode(value);
    const alt = airportCodes.find((code) => code !== value);
    if (alt) setDepartureAirportCode(alt);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const flyDetails = {
      flightCode,
      departureAirportCode,
      arrivalAirportCode,
      departureTime,
      arrivalTime,
      restTime: `PT${restTime.toUpperCase()}`,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/fly-details/flight/${flightCode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flyDetails),
        }
      );

      if (response.ok) {
        alert("FlyDetails added successfully!");
        setDepartureAirportCode("");
        setArrivalAirportCode("");
        setDepartureTime("");
        setArrivalTime("");
        setRestTime("00H00M");
      } else {
        alert("Failed to add FlyDetails");
      }
    } catch (error) {
      console.error("Error", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-fly-details-container">
      <div className="fly-form-card">
        <h2>Add Fly Details to flight: {flightCode}</h2>

        <form onSubmit={handleSubmit} className="fly-form">
          <select
            value={departureAirportCode}
            onChange={(e) => handleDepartureSelect(e.target.value)}
            required
          >
            <option value="">Select Departure Airport</option>
            {airportCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <select
            value={arrivalAirportCode}
            onChange={(e) => handleArrivalSelect(e.target.value)}
            required
          >
            <option value="">Select Arrival Airport</option>
            {airportCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            value={departureTime}
            onChange={(e) => setDepartureTime(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            value={arrivalTime}
            onChange={(e) => setArrivalTime(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Rest Time (e.g., 01H30M)"
            value={restTime}
            onChange={(e) => setRestTime(e.target.value)}
            required
          />

          <button type="submit" className="submit-button">
            Add Fly Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFlyDetailsPage;
