import React, { useEffect, useState } from "react";
import AddAirportPage from "./AddAirportPage";
import "../styles/components/Airport.css";

const Airport = () => {
  const [airports, setAirports] = useState([]);
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
<<<<<<< HEAD
  const [selectedAirport, setSelectedAirport] = useState(null);
=======
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1

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
<<<<<<< HEAD
    if (!window.confirm("Are you sure you want to delete this airport?"))
      return;
=======
    if (!window.confirm("Are you sure you want to delete this airport?")) return;
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
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
<<<<<<< HEAD
    setSelectedAirport(airport);
    setShowAddModal(true);
=======
    alert("Edit functionality to be implemented!");
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
<<<<<<< HEAD
    setSelectedAirport(null);
    fetchAirports();
=======
    fetchAirports(); // Refresh the list after adding
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
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
<<<<<<< HEAD
        <button
          onClick={() => {
            setSelectedAirport(null);
            setShowAddModal(true);
          }}
        >
          Add Airport
        </button>
=======
        <button onClick={() => setShowAddModal(true)}>Add Airport</button>
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
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
<<<<<<< HEAD
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
=======
                <button className="edit-button" onClick={() => handleEdit(airport)}>Edit</button>
                <button className="delete-button" onClick={() => handleDelete(airport.id)}>Delete</button>
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
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
<<<<<<< HEAD
            <AddAirportPage
              onClose={handleCloseModal}
              airportData={selectedAirport}
            />
=======
            <AddAirportPage onClose={handleCloseModal} />
>>>>>>> 85025cb4231066eb797020bf3956e7b46509f3e1
          </div>
        </div>
      )}
    </div>
  );
};

export default Airport;
