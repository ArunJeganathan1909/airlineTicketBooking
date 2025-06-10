import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Navbar from "./Navbar";
import "../styles/components/ProfilePage.css";

const ProfilePage = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <nav className="navbar">
          <div className="nav-left">
            <Link to="/profile" className="nav-link">
              Profile
            </Link>
            <Link to="/profile/booking" className="nav-link">
              Booking
            </Link>
          </div>
          <div className="nav-right">
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </div>
        </nav>

        <main className="profile-content">
          <Outlet /> {/* Nested route will render here */}
        </main>
      </div>
    </>
  );
};

export default ProfilePage;
