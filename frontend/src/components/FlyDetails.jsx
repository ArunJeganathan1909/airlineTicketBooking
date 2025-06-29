import React, { useEffect, useState } from "react";
import AddFlyDetailsPage from "./AddFlyDetailsPage";
import "../styles/components/FlyDetails.css";

const FlyDetails = () => {
  const [flyDetails, setFlyDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

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
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this fly detail?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/fly-details/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Fly detail deleted successfully.");
        fetchFlyDetails();
      } else {
        alert("Unauthorized or failed to delete.");
      }
    } catch (err) {
      console.error("Error deleting fly detail:", err);
    }
  };

  const handleEdit = (detail) => {
    setSelectedDetail(detail);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDetail(null);
    fetchFlyDetails();
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>
              &times;
            </button>
            <AddFlyDetailsPage
              detailData={selectedDetail}
              onClose={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FlyDetails;
