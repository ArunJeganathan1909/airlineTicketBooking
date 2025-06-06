import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/pages/HomePage.css"; 
import FlightBookingForm from "../components/FlightBookingForm";

const HomePage = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main className="main-content">
        <FlightBookingForm />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
