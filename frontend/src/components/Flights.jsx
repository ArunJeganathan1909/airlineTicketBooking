import React, { useEffect, useState } from "react";
import AddFlightPage from "./AddFlightPage";
import "../styles/components/Flights.css";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Fetch all flights on mount
  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/flights");
      const data = await response.json();
      setFlights(data);
      setFilteredFlights(data);
    } catch (err) {
      console.error("Error fetching flights:", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = flights.filter(
      (flight) =>
        flight.flightCode.toLowerCase().includes(query) ||
        flight.airlineName.toLowerCase().includes(query)
    );
    setFilteredFlights(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    try {
      await fetch(`http://localhost:8080/api/flights/${id}`, {
        method: "DELETE",
      });
      alert("Flight deleted successfully.");
      fetchFlights();
    } catch (err) {
      console.error("Error deleting flight:", err);
    }
  };

  const handleEdit = (flight) => {
    alert("Edit functionality to be implemented!");
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    fetchFlights(); // Refresh the list after adding
  };

  return (
    <div className="flights-page">
      <h2>Flights Management</h2>

      {/* Add Flight Button */}
      <div className="add-flight-button-container">
        <button onClick={() => setShowAddModal(true)}>Add Flight</button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Flight Code or Airline Name"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      {/* Flight Table */}
      <table className="flights-table">
        <thead>
          <tr>
            <th>Flight Code</th>
            <th>Airline Name</th>
            <th>Departure Airports</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFlights.map((flight) => (
            <tr key={flight.id}>
              <td>{flight.flightCode}</td>
              <td>{flight.airlineName}</td>
              <td>{flight.departureAirportCodes.join(", ")}</td>
              <td>
                <button onClick={() => handleEdit(flight)}>Edit</button>
                <button onClick={() => handleDelete(flight.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Flight Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <AddFlightPage onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;
