import React, { useEffect, useState } from "react";
import AddAirportPage from "./AddAirportPage";
import "../styles/components/Airport.css";

const Airport = () => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/airports");
      const data = await response.json();
      setAirports(data);
      setFilteredAirports(data);
    } catch (err) {
      console.error("Error fetching airports:", err);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = airports.filter(
      (airport) =>
        airport.airportName.toLowerCase().includes(query) ||
        airport.airportCode.toLowerCase().includes(query) ||
        airport.city.toLowerCase().includes(query) ||
        airport.country.toLowerCase().includes(query)
    );
    setFilteredAirports(filtered);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this airport?"))
      return;
    try {
      await fetch(`http://localhost:8080/api/airports/${id}`, {
        method: "DELETE",
      });
      alert("Airport deleted successfully.");
      fetchAirports();
    } catch (err) {
      console.error("Error deleting airport:", err);
    }
  };

  const handleEdit = (airport) => {
    setSelectedAirport(airport);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedAirport(null);
    fetchAirports();
  };

  return (
    <div className="airport-page">
      <h2>Airports Management</h2>

      {/* Search Bar and Add Button */}
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by Name, Code, City, Country"
          value={searchQuery}
          onChange={handleSearch}
        />
        <button
          onClick={() => {
            setSelectedAirport(null);
            setShowAddModal(true);
          }}
        >
          Add Airport
        </button>
      </div>

      {/* Airport Table */}
      <table className="airport-table">
        <thead>
          <tr>
            <th>Airport Name</th>
            <th>Airport Code</th>
            <th>City</th>
            <th>Country</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAirports.map((airport) => (
            <tr key={airport.id}>
              <td>{airport.airportName}</td>
              <td>{airport.airportCode}</td>
              <td>{airport.city}</td>
              <td>{airport.country}</td>
              <td>
                <button
                  className="edit-button"
                  onClick={() => handleEdit(airport)}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(airport.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <AddAirportPage
              onClose={handleCloseModal}
              airportData={selectedAirport}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Airport;
