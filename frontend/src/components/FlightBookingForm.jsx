import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/components/FlightBookingForm.css";

const FlightBookingForm = () => {
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [tripType, setTripType] = useState("round");
  const [showTravellers, setShowTravellers] = useState(false);
  const [roundTripStart, setRoundTripStart] = useState(null);
  const [roundTripEnd, setRoundTripEnd] = useState(null);
  const [oneWayDate, setOneWayDate] = useState(null);

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
            <div className="input-group">
              <label htmlFor="departure">Departure</label>
              <input id="departure" placeholder="City or Airport" />
            </div>

            <div className="input-group">
              <label htmlFor="destination">Destination</label>
              <input id="destination" placeholder="City or Airport" />
            </div>

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

            <div className="traveller-dropdown">
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
                onClick={() => setShowTravellers(!showTravellers)} // also toggle dropdown when clicking input
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

            <div className="search-button">
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Failed to load the data via API: Please Contact Brightsun technical team and pass the code of XyCztV:fareforyou.com"
                  );
                }}
              >
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
