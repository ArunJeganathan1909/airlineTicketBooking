import React from "react";
import "../styles/components/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Airline Booking</h4>
          <p>© 2025 Airline Booking System. All rights reserved.</p>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@airline.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>

        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#" aria-label="Facebook" className="social-link">
              📘
            </a>
            <a href="#" aria-label="Twitter" className="social-link">
              🐦
            </a>
            <a href="#" aria-label="Instagram" className="social-link">
              📸
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
