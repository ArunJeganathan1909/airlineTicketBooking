import React, { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/components/FlightBookingForm.css";
import { useNavigate } from "react-router-dom";

const FlightBookingForm = () => {
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [tripType, setTripType] = useState("round");
  const [showTravellers, setShowTravellers] = useState(false);
  const [roundTripStart, setRoundTripStart] = useState(null);
  const [roundTripEnd, setRoundTripEnd] = useState(null);
  const [oneWayDate, setOneWayDate] = useState(null);

  const [airports, setAirports] = useState([]);
  const [departureSearch, setDepartureSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [filteredDepartures, setFilteredDepartures] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [showDepartureDropdown, setShowDepartureDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  const departureRef = useRef(null);
  const destinationRef = useRef(null);
  const travellerRef = useRef(null);
  const navigate = useNavigate();

  const totalTravelers = adultCount + childCount + infantCount;

  useEffect(() => {
    fetch("http://localhost:8080/api/airports")
      .then((res) => res.json())
      .then((data) => setAirports(data))
      .catch((err) => console.error("Failed to load airports", err));
  }, []);

  useEffect(() => {
    const search = departureSearch.toLowerCase();
    setFilteredDepartures(
      airports.filter(
        (airport) =>
          airport.airportName.toLowerCase().includes(search) ||
          airport.airportCode.toLowerCase().includes(search) ||
          airport.city.toLowerCase().includes(search) ||
          airport.country.toLowerCase().includes(search)
      )
    );
  }, [departureSearch, airports]);

  useEffect(() => {
    const search = destinationSearch.toLowerCase();
    setFilteredDestinations(
      airports.filter(
        (airport) =>
          airport.airportName.toLowerCase().includes(search) ||
          airport.airportCode.toLowerCase().includes(search) ||
          airport.city.toLowerCase().includes(search) ||
          airport.country.toLowerCase().includes(search)
      )
    );
  }, [destinationSearch, airports]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        departureRef.current &&
        !departureRef.current.contains(event.target)
      ) {
        setShowDepartureDropdown(false);
      }
      if (
        destinationRef.current &&
        !destinationRef.current.contains(event.target)
      ) {
        setShowDestinationDropdown(false);
      }
      if (
        travellerRef.current &&
        !travellerRef.current.contains(event.target)
      ) {
        setShowTravellers(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const departureCode = departureSearch.split(",")[1]?.trim();
    const arrivalCode = destinationSearch.split(",")[1]?.trim();

    const leavingDate =
      tripType === "round"
        ? roundTripStart?.toISOString().split("T")[0]
        : oneWayDate?.toISOString().split("T")[0];

    const returningDate =
      tripType === "round" ? roundTripEnd?.toISOString().split("T")[0] : null;

    const totalTravelers = adultCount + childCount + infantCount;

    if (departureCode && arrivalCode && leavingDate) {
      let query = `/filtered-flights?departure=${departureCode}&arrival=${arrivalCode}&date=${leavingDate}`;
      if (returningDate) {
        query += `&returnDate=${returningDate}`;
      }
      navigate(query, { state: { totalTravelers } });
    } else {
      alert("Please select valid departure, destination and date");
    }
  };

  const handleDepartureSelect = (airport) => {
    setDepartureSearch(`${airport.airportName}, ${airport.airportCode}`);
    setShowDepartureDropdown(false);
  };

  const handleDestinationSelect = (airport) => {
    setDestinationSearch(`${airport.airportName}, ${airport.airportCode}`);
    setShowDestinationDropdown(false);
  };

  return (
    <div className="booking-container">
      <div className="form-wrapper">
        <div className="trip-type-tabs">
          <button
            className={tripType === "round" ? "active" : ""}
            onClick={() => setTripType("round")}
          >
            Round Trip
          </button>
          <button
            className={tripType === "oneway" ? "active" : ""}
            onClick={() => setTripType("oneway")}
          >
            OneWay Trip
          </button>
        </div>

        <form id="bookingForm" className="form">
          <div className="form-row">
            {/* Departure */}
            <div className="input-group" ref={departureRef}>
              <label htmlFor="departure">Departure</label>
              <input
                id="departure"
                value={departureSearch}
                onFocus={() => setShowDepartureDropdown(true)}
                onChange={(e) => setDepartureSearch(e.target.value)}
                placeholder="City or Airport"
              />
              {showDepartureDropdown && filteredDepartures.length > 0 && (
                <ul className="airport-dropdown">
                  {filteredDepartures.map((airport) => (
                    <li
                      key={airport.id}
                      onClick={() => handleDepartureSelect(airport)}
                    >
                      {airport.airportName}, {airport.airportCode} (
                      {airport.city}, {airport.country})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Destination */}
            <div className="input-group" ref={destinationRef}>
              <label htmlFor="destination">Destination</label>
              <input
                id="destination"
                value={destinationSearch}
                onFocus={() => setShowDestinationDropdown(true)}
                onChange={(e) => setDestinationSearch(e.target.value)}
                placeholder="City or Airport"
              />
              {showDestinationDropdown && filteredDestinations.length > 0 && (
                <ul className="airport-dropdown">
                  {filteredDestinations.map((airport) => (
                    <li
                      key={airport.id}
                      onClick={() => handleDestinationSelect(airport)}
                    >
                      {airport.airportName}, {airport.airportCode} (
                      {airport.city}, {airport.country})
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Date Picker Section */}
            {tripType === "round" ? (
              <div className="input-group-row">
                <div className="input-group">
                  <label>Leaving on</label>
                  <DatePicker
                    selected={roundTripStart}
                    onChange={(date) => setRoundTripStart(date)}
                    placeholderText="Leaving on"
                    className="date-input"
                  />
                </div>
                <div className="input-group">
                  <label>Returning on</label>
                  <DatePicker
                    selected={roundTripEnd}
                    onChange={(date) => setRoundTripEnd(date)}
                    placeholderText="Returning on"
                    className="date-input"
                  />
                </div>
              </div>
            ) : (
              <div className="input-group">
                <label>One Way</label>
                <DatePicker
                  selected={oneWayDate}
                  onChange={(date) => setOneWayDate(date)}
                  placeholderText="One Way Date"
                  className="date-input"
                />
              </div>
            )}

            {/* Travellers */}
            <div className="traveller-dropdown" ref={travellerRef}>
              <label
                onClick={() => setShowTravellers(!showTravellers)}
                style={{ cursor: "pointer" }}
              >
                Travellers
              </label>
              <input
                type="text"
                readOnly
                value={`${adultCount} Adult${
                  adultCount > 1 ? "s" : ""
                }, ${childCount} Child${
                  childCount !== 1 ? "ren" : ""
                }, ${infantCount} Infant${infantCount > 1 ? "s" : ""}`}
                className="traveller-summary-input"
                onClick={() => setShowTravellers(!showTravellers)}
              />
              {showTravellers && (
                <div className="traveller-selector">
                  <div className="traveller-group">
                    <div className="traveller-label">
                      <span>Adults</span> <small>(12+)</small>
                    </div>
                    <div className="counter">
                      <button
                        type="button"
                        onClick={() =>
                          setAdultCount(Math.max(1, adultCount - 1))
                        }
                      >
                        −
                      </button>
                      <span>{adultCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultCount(adultCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="traveller-group">
                    <div className="traveller-label">
                      <span>Children</span> <small>(4+)</small>
                    </div>
                    <div className="counter">
                      <button
                        type="button"
                        onClick={() =>
                          setChildCount(Math.max(0, childCount - 1))
                        }
                      >
                        −
                      </button>
                      <span>{childCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildCount(childCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="traveller-group">
                    <div className="traveller-label">
                      <span>Infants</span> <small>(0–12mo)</small>
                    </div>
                    <div className="counter">
                      <button
                        type="button"
                        onClick={() =>
                          setInfantCount(Math.max(0, infantCount - 1))
                        }
                      >
                        −
                      </button>
                      <span>{infantCount}</span>
                      <button
                        type="button"
                        onClick={() => setInfantCount(infantCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="search-button">
              <button type="submit" onClick={handleSearchSubmit}>
                <FiSearch className="search-icon" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FlightBookingForm;
