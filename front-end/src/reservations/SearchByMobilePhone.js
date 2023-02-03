import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
// import { listReservations } from "../utils/api";
import ReservationsList from "../reservations/ReservationsList";
import { useHistory } from "react-router";
import { searchReservationByPhone } from "../utils/api";

export default function SearchByMobilePhone() {
  const initialFormData = {
    mobile_number: "",
  };

  const history = useHistory();

  const [formData, setFormData] = useState(initialFormData);
  const [displaySearchResults, setDisplaySearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const returnedSearchReservations = await searchReservationByPhone(
      formData.mobile_number,
      abortController.signal
    );
    setDisplaySearchResults(returnedSearchReservations);
    try {
    } catch (error) {
      setSearchError(error.message);
    }
  };

  const handleCancel = () => {
    history.push("/dashboard");
  };

  return (
    <div>
      <div>
        <h1>Search By Phone</h1>
      </div>
      <ErrorAlert error={searchError} />
      <div>
        <form onClick={handleSubmit}>
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            name="mobile_number"
            id="mobile_number"
            type="text"
            placeholder="Enter a customer's phone number"
            onChange={handleChange}
            value={formData.mobile_number}
            required
          />
          <div>
            <button type="submit">Find</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          {displaySearchResults.length === 0 ? (
            <div>
              <h3>No reservations found</h3>
            </div>
          ) : (
            <div>
              {displaySearchResults.map((rsvp) => (
                <div key={rsvp.reservation_id}>
                  <ReservationsList reservation={rsvp} />
                </div>
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
