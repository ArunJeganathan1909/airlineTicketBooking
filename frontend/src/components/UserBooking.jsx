import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import "../styles/components/UserBooking.css";

const UserBooking = () => {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user) return;

      try {
        const res = await fetch(
          `http://localhost:8080/api/bookings/user/${user.username}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookings(data);
        } else {
          console.error("Failed to fetch user bookings");
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching user bookings", err);
      }
    };

    fetchUserBookings();
  }, [user]);

  return (
    <div className="user-bookings">
      <h2>Your Bookings</h2>
      {user ? (
        bookings.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Flight Code</th>
                <th>Outbound Time</th>
                <th>Passengers</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.flightCode}</td>
                  <td>{new Date(booking.outboundTime).toLocaleString()}</td>
                  <td>{booking.passengers.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No bookings found.</p>
        )
      ) : (
        <p>Please log in to view your bookings.</p>
      )}
    </div>
  );
};

export default UserBooking;
