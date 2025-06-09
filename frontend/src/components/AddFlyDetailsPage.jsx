import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import "../styles/components/AddFlyDetailsPage.css";
=======
import "../styles/components/AddFlyDetailsPage.css"; // Ensure the path is correct

const AddFlyDetailsPage = ({ flightCode }) => {
  // const { flightCode } = useParams();
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1

const AddFlyDetailsPage = ({ flightCode, detailData, onClose }) => {
  const [departureAirportCode, setDepartureAirportCode] = useState("");
  const [arrivalAirportCode, setArrivalAirportCode] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [restTime, setRestTime] = useState("00H00M");
  const [airportCodes, setAirportCodes] = useState([]);
  const departureTimeFormatted = new Date(departureTime).toISOString();


  useEffect(() => {
    if (detailData) {
      // Editing mode
      setDepartureAirportCode(detailData.departureAirportCode);
      setArrivalAirportCode(detailData.arrivalAirportCode);
      setDepartureTime(detailData.departureTime.slice(0, 16)); // ISO string to yyyy-MM-ddTHH:mm
      setArrivalTime(detailData.arrivalTime.slice(0, 16));
      setRestTime(formatDuration(detailData.restTime));
    } else {
      // Reset form for adding
      setDepartureAirportCode("");
      setArrivalAirportCode("");
      setDepartureTime("");
      setArrivalTime("");
      setRestTime("00H00M");
    }
  }, [detailData]);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/flights");
        const data = await res.json();
        const flight = data.find(
          (f) => f.flightCode === (detailData?.flightCode || flightCode)
        );
        if (flight) {
          setAirportCodes(flight.departureAirportCodes || []);
        }
      } catch (err) {
        console.error("Failed to fetch flight data", err);
      }
    };

    fetchFlight();
  }, [flightCode, detailData]);

  const formatDuration = (duration) => {
    if (!duration) return "00H00M";
    const matches = duration.match(/PT(\d+H)?(\d+M)?/);
    const hours = matches[1] ? matches[1].replace("H", "") : "00";
    const minutes = matches[2] ? matches[2].replace("M", "") : "00";
    return `${hours.padStart(2, "0")}H${minutes.padStart(2, "0")}M`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const flyDetails = {
      flightCode: detailData?.flightCode || flightCode,
      departureAirportCode,
      arrivalAirportCode,
      departureTime,
      arrivalTime,
      restTime: `PT${restTime.toUpperCase()}`,
    };

    try {
      const url = detailData
        ? `http://localhost:8080/api/fly-details/${detailData.id}`
        : `http://localhost:8080/api/fly-details/flight/${flightCode}`;
      const method = detailData ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flyDetails),
      });

      if (response.ok) {
        alert(
          detailData
            ? "FlyDetails updated successfully!"
            : "FlyDetails added successfully!"
        );
        onClose();
      } else {
        alert("Failed to save FlyDetails");
      }
    } catch (error) {
      console.error("Error", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="add-fly-details-container">
      <div className="fly-form-card">
        <h2>
          {detailData
            ? `Edit Fly Details (Flight: ${detailData.flightCode})`
            : `Add Fly Details to flight: ${flightCode}`}
        </h2>
        <form onSubmit={handleSubmit} className="fly-form">
          <select
            value={departureAirportCode}
            onChange={(e) => setDepartureAirportCode(e.target.value)}
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
            onChange={(e) => setArrivalAirportCode(e.target.value)}
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
            {detailData ? "Update Fly Details" : "Add Fly Details"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFlyDetailsPage;
