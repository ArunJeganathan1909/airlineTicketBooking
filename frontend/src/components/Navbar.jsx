import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { FaUserCircle } from "react-icons/fa";
import Modal from "./Modal";
import "../styles/components/Navbar.css";
import RegisterPage from "./RegisterPage";
import LoginPage from "./LoginPage";

const Navbar = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'register'

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

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="navbar-title">
            Flight Booking
          </Link>
        </div>
        <div className="navbar-right">
          <Link to="/about" className="navbar-link">
            About
          </Link>
          <Link to="/contact" className="navbar-link">
            Contact Us
          </Link>
          {user ? (
            <span className="navbar-user">{user.username}</span>
          ) : (
            <FaUserCircle
              className="navbar-user-icon"
              size={24}
              onClick={handleIconClick}
            />
          )}
        </div>
      </nav>

      {/* Modal */}
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
