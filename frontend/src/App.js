import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import { UserProvider } from "./context/UserContext";
import RegisterPage from "./components/RegisterPage";
import FlightBookingForm from "./components/FlightBookingForm";
import AddFlightPage from "./components/AddFlightPage";
import AddFlyDetailsPage from "./components/AddFlyDetailsPage";
import AddAirportPage from "./components/AddAirportPage";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/booking" element={<FlightBookingForm />} />
          <Route path="/add-flight" element={<AddFlightPage />} />
          <Route path="/add-fly-details/:flightCode" element={<AddFlyDetailsPage />} />
          <Route path="/add-airport" element={<AddAirportPage />} />
        </Routes>
      </UserProvider>
    </Router>
  );
};

export default App;
