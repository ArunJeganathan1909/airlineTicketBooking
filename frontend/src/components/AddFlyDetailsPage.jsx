import React, { useState } from "react";
import { useParams } from "react-router-dom";

const AddFlyDetailsPage = () => {
  const { flightCode } = useParams();

  const [departureAirportCode, setDepartureAirportCode] = useState("");
  const [arrivalAirportCode, setArrivalAirportCode] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [restTime, setRestTime] = useState("00H00M");

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
        setRestTime("00:00:00");
      } else {
        alert("Failed to add FlyDetails");
      }
    } catch (error) {
      console.error("Error", error);
      alert("Something went wrong");
    }
  };

  return (
    <div>
      <h2> Add Fly Details to flight: {flightCode}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Departure Airport Code"
          value={departureAirportCode}
          onChange={(e) => setDepartureAirportCode(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Arrival Airport Code"
          value={arrivalAirportCode}
          onChange={(e) => setArrivalAirportCode(e.target.value)}
          required
        />
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
        <button type="submit">Add Fly Details</button>
      </form>
    </div>
  );
};

export default AddFlyDetailsPage;
