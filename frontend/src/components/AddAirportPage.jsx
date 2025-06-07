import React, { useState, useEffect } from "react";
import "../styles/components/AddAirportPage.css";

const AddAirportPage = ({ onClose, airportData }) => {
  const [airportName, setAirportName] = useState("");
  const [airportCode, setAirportCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  useEffect(() => {
    if (airportData) {
      setAirportName(airportData.airportName);
      setAirportCode(airportData.airportCode);
      setCountry(airportData.country);
      setCity(airportData.city);
    } else {
      setAirportName("");
      setAirportCode("");
      setCountry("");
      setCity("");
    }
  }, [airportData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAirport = {
      airportName,
      airportCode,
      country,
      city,
    };

    try {
      const url = airportData
        ? `http://localhost:8080/api/airports/${airportData.id}`
        : "http://localhost:8080/api/airports";
      const method = airportData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAirport),
      });

      if (res.ok) {
        alert(
          airportData
            ? "Airport updated successfully!"
            : "Airport added successfully!"
        );
        onClose();
      } else {
        alert("Failed to save airport.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="airport-container">
      <div className="airport-form-card">
        <h2>{airportData ? "Edit Airport" : "Add New Airport"}</h2>
        <form onSubmit={handleSubmit} className="airport-form">
          <input
            type="text"
            placeholder="Airport Name"
            value={airportName}
            onChange={(e) => setAirportName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Airport Code (e.g. LAX)"
            value={airportCode}
            onChange={(e) => setAirportCode(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          <button type="submit" className="submit-button">
            {airportData ? "Update Airport" : "Add Airport"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAirportPage;
