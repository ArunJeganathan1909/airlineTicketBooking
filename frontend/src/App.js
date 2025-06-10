import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import { UserProvider } from "./context/UserContext";
import RegisterPage from "./components/RegisterPage";
import FlightBookingForm from "./components/FlightBookingForm";
import AddFlightPage from "./components/AddFlightPage";
import AddFlyDetailsPage from "./components/AddFlyDetailsPage";
import AddAirportPage from "./components/AddAirportPage";
import FilteredFlyDetailsPage from "./components/FilteredFlyDetailsPage";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import Flights from "./components/Flights";
import AdminWelcome from "./components/AdminWelcome";
import FlyDetails from "./components/FlyDetails";
import Airport from "./components/Airport";
import BookingForm from "./components/BookingForm";
import BookingList from "./components/BookingList";
import ProfilePage from "./components/ProfilePage";
import UserProfile from "./components/UserProfile";
import UserBooking from "./components/UserBooking";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <UserProvider>
        <div className="app-container">
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/admin" element={<AdminPage />}>
                <Route index element={<AdminWelcome />} />
                <Route path="flights" element={<Flights />} />
                <Route path="fly-details" element={<FlyDetails />} />
                <Route path="airports" element={<Airport />} />
                <Route path="booking-list" element={<BookingList />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/booking" element={<FlightBookingForm />} />
              <Route path="/add-flight" element={<AddFlightPage />} />
              <Route
                path="/add-fly-details/:flightCode"
                element={<AddFlyDetailsPage />}
              />
              <Route path="/add-airport" element={<AddAirportPage />} />
              <Route
                path="/filtered-flights"
                element={<FilteredFlyDetailsPage />}
              />
              <Route path="/flight-booking" element={<BookingForm />} />
              <Route path="/profile" element={<ProfilePage />}>
                <Route index element={<UserProfile />} />
                <Route path="booking" element={<UserBooking />} />
              </Route>
            </Routes>
          </div>
          <Footer /> 
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
