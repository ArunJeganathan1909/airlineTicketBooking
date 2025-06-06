import React from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/components/Navbar.css"; // You can reuse the same CSS

const NavbarAdmin = () => {
  const { user } = useUser();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/admin" className="navbar-title">
          Flight Booking
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/admin/flights" className="navbar-link">
          Flight
        </Link>
        <Link to="/admin/fly-details" className="navbar-link">
          Fly Details
        </Link>
        <Link to="/admin/airports" className="navbar-link">
          Airports
        </Link>
        {user && (
          <span className="navbar-user">{user.username}</span>
        )}
      </div>
    </nav>
  );
};

export default NavbarAdmin;
