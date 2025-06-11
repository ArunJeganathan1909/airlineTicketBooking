import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import "../styles/components/Navbar.css";

const NavbarAdmin = () => {
  const { user } = useUser();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link
          to="/admin"
          className={`navbar-title ${
            location.pathname === "/admin" ? "active-link" : ""
          }`}
        >
          Flight Booking
        </Link>
      </div>
      <div className="navbar-right">
        <Link
          to="/admin/flights"
          className={`navbar-link ${
            location.pathname === "/admin/flights" ? "active-link" : ""
          }`}
        >
          Flight
        </Link>
        <Link
          to="/admin/fly-details"
          className={`navbar-link ${
            location.pathname === "/admin/fly-details" ? "active-link" : ""
          }`}
        >
          Fly Details
        </Link>
        <Link
          to="/admin/airports"
          className={`navbar-link ${
            location.pathname === "/admin/airports" ? "active-link" : ""
          }`}
        >
          Airports
        </Link>
        <Link
          to="/admin/booking-list"
          className={`navbar-link ${
            location.pathname === "/admin/booking-list" ? "active-link" : ""
          }`}
        >
          Booking
        </Link>
        {user && (
          <Link to="/admin/profile" className="navbar-user">
            {user.username}
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavbarAdmin;
