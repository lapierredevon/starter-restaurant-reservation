import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { postReservations } from "../utils/api";
import { today } from "../utils/date-time";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: today(),
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [reservationError, setReservationError] = useState([]);

  const history = useHistory();

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  // Initialize a variable with reservation object
  // restore reservations data to its initial state
  // change the value of  rsvp.people to a number
  // Send a post request with the new reservation using postReservation
  async function handleSubmit(event) {
    const abortController = new AbortController();
    event.preventDefault();

    const reservation = new Date(`${formData.reservation_date} PDT`).setHours(
      formData.reservation_time.substring(0, 2),
      formData.reservation_time.substring(3)
    );
    console.log("reservation CD", reservation);
    console.log("Date Now FD", Date.now());

    const date = new Date(
      `${formData.reservation_date} ${formData.reservation_time}`
    );
    console.log("date New Date CD", date.getTime());
    console.log("date Date Now FD", new Date().getTime());

    try {
      let rsvp = formData;
      setFormData(initialFormState);
      rsvp.people = Number(rsvp.people);
      await postReservations(rsvp, abortController.signal);

      history.push(`/dashboard?date=${rsvp.reservation_date}`);
    } catch (error) {
      setReservationError([...reservationError, error.message]);
    }

    return () => {
      abortController.abort();
    };
  }

  return (
    <section>
      <div>
        <h2>Reservation</h2>
        <ErrorAlert error={reservationError} />
        <ReservationForm
          reservation={formData}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      </div>
    </section>
  );
}

export default NewReservation;
