import React, { useState } from "react";
import "../styles/components/AddAirportPage.css"; 

const AddAirportPage = () => {
  const [airportName, setAirportName] = useState("");
  const [airportCode, setAirportCode] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAirport = {
      airportName,
      airportCode,
      country,
      city,
    };

    try {
      const res = await fetch("http://localhost:8080/api/airports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAirport),
      });

      if (res.ok) {
        alert("Airport added successfully!");
        setAirportName("");
        setAirportCode("");
        setCountry("");
        setCity("");
      } else {
        alert("Failed to add airport.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="airport-container">
      <div className="airport-form-card">
        <h2>Add New Airport</h2>
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
          <button type="submit" className="submit-button">Add Airport</button>
        </form>
      </div>
    </div>
  );
};

export default AddAirportPage;
