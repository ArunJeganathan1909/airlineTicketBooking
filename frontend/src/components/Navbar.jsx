import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaUserCircle } from "react-icons/fa";
import Modal from "./Modal";
import "../styles/components/Navbar.css";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

const Navbar = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const location = useLocation();
  const navigate = useNavigate(); // 🆕 Hook for navigation

  const handleIconClick = () => {
    setAuthMode("login");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const switchToRegister = () => {
    setAuthMode("register");
  };

  const switchToLogin = () => {
    setAuthMode("login");
  };

  const handleUsernameClick = () => {
    navigate("/profile");
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link
            to="/"
            className={`navbar-title ${
              location.pathname === "/" ? "active-link" : ""
            }`}
          >
            Flight Booking
          </Link>
        </div>
        <div className="navbar-right">
          <Link
            to="/about"
            className={`navbar-link ${
              location.pathname === "/about" ? "active-link" : ""
            }`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`navbar-link ${
              location.pathname === "/contact" ? "active-link" : ""
            }`}
          >
            Contact Us
          </Link>
          {user ? (
            <span className="navbar-user" onClick={handleUsernameClick}>
              {user.username}
            </span>
          ) : (
            <FaUserCircle
              className="navbar-user-icon"
              size={24}
              onClick={handleIconClick}
            />
          )}
        </div>
      </nav>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {authMode === "login" ? (
          <LoginPage
            switchToRegister={switchToRegister}
            closeModal={handleCloseModal}
          />
        ) : (
          <RegisterPage
            switchToLogin={switchToLogin}
            closeModal={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
};

export default Navbar;
