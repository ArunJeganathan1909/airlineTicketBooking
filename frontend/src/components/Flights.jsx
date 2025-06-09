import React, { useEffect, useState } from "react";
import AddFlightPage from "./AddFlightPage";
import AddFlyDetailsPage from "./AddFlyDetailsPage";
import "../styles/components/Flights.css";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null); // store selected flight
  const [showAddFlyDetailsModal, setShowAddFlyDetailsModal] = useState(false);
  const [selectedFlightCode, setSelectedFlightCode] = useState("");


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
    setSelectedFlight(flight);
    setShowAddFlightModal(true);
  };

  const handleOpenAddFlightModal = () => {
    setSelectedFlight(null); // reset for adding new flight
    setShowAddFlightModal(true);
  };

  const handleCloseAddFlightModal = () => {
    setShowAddFlightModal(false);
    setSelectedFlight(null);
    fetchFlights(); // Refresh the list after changes
  };

  const handleOpenAddFlyDetailsModal = (flightCode) => {
    setSelectedFlightCode(flightCode);
    setShowAddFlyDetailsModal(true);
  };

  const handleCloseAddFlyDetailsModal = () => {
    setShowAddFlyDetailsModal(false);
    setSelectedFlightCode("");
  };

  return (
    <div className="flights-page">
      <h2>Flights Management</h2>

      {/* Add Flight Button */}
      <div className="add-flight-button-container">
        <button onClick={handleOpenAddFlightModal}>Add Flight</button>
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
              <td className="action">
                <button onClick={() => handleEdit(flight)} className="edit">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(flight.id)}
                  className="delete"
                >
                  Delete
                </button>
                <button
                  onClick={() =>
                    handleOpenAddFlyDetailsModal(flight.flightCode)
                  }
                  className="add"
                >
                  Add Fly Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add/Edit Flight Modal */}
      {showAddFlightModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={handleCloseAddFlightModal}
            >
              &times;
            </button>
            <AddFlightPage
              onClose={handleCloseAddFlightModal}
              flightData={selectedFlight} // pass flight data
            />
          </div>
        </div>
      )}

      {/* Add Fly Details Modal */}
      {showAddFlyDetailsModal && selectedFlightCode && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-button"
              onClick={handleCloseAddFlyDetailsModal}
            >
              &times;
            </button>
            <AddFlyDetailsPage flightCode={selectedFlightCode} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;
