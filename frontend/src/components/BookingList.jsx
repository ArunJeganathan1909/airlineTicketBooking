import React, { useState, useEffect } from "react";
import "../styles/components/BookingList.css";

const BookingList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/bookings");
      const data = await res.json();
      setAllBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredBookings(allBookings);
    } else {
      const filtered = allBookings.filter((booking) =>
        booking.flightCode.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredBookings(filtered);
    }
  };

  return (
    <div className="booking-list-page">
      {/* 1️⃣ Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Flight Code"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* 2️⃣ Table */}
      <div className="booking-table">
        <table>
          <thead>
            <tr>
              <th>Flight Code</th>
              <th>Outbound Time</th>
              <th>Passengers</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="3">No bookings found.</td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.flightCode}</td>
                  <td>{new Date(booking.outboundTime).toLocaleString()}</td>
                  <td>{booking.passengers.length}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
