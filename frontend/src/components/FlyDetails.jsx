import React, { useEffect, useState } from "react";
import "../styles/components/FlyDetails.css";

const FlyDetails = () => {
  const [flyDetails, setFlyDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchFlyDetails();
  }, []);

  const fetchFlyDetails = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/fly-details");
      const data = await response.json();
      setFlyDetails(data);
      setFilteredDetails(data);
    } catch (err) {
      console.error("Error fetching fly details:", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = flyDetails.filter(
      (detail) =>
        detail.flightCode.toLowerCase().includes(query) ||
        detail.departureAirportCode.toLowerCase().includes(query) ||
        detail.arrivalAirportCode.toLowerCase().includes(query)
    );
    setFilteredDetails(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fly detail?"))
      return;
    try {
      await fetch(`http://localhost:8080/api/fly-details/${id}`, {
        method: "DELETE",
      });
      alert("Fly detail deleted successfully.");
      fetchFlyDetails();
    } catch (err) {
      console.error("Error deleting fly detail:", err);
    }
  };

  const handleEdit = (detail) => {
    alert("Edit functionality to be implemented!");
    // For real implementation, show a modal or pre-fill the form with detail data
  };

  return (
    <div className="flydetails-page">
      <h2>Fly Details Management</h2>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Flight Code or Airport Codes"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* FlyDetails Table */}
      <table className="flydetails-table">
        <thead>
          <tr>
            <th>Flight Code</th>
            <th>Departure Airport</th>
            <th>Arrival Airport</th>
            <th>Departure Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDetails.map((detail) => (
            <tr key={detail.id}>
              <td>{detail.flightCode}</td>
              <td>{detail.departureAirportCode}</td>
              <td>{detail.arrivalAirportCode}</td>
              <td>{new Date(detail.departureTime).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(detail)}>Edit</button>
                <button onClick={() => handleDelete(detail.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlyDetails;
