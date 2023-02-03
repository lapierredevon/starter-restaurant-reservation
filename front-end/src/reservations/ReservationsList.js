import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservationStatus } from "../utils/api";

export default function ReservationsList({ reservation }) {
  const [error, setError] = useState(null);
  const history = useHistory();

  async function handleCancel(event) {
    event.preventDefault();
    setError(null);
    const abortController = new AbortController();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        const newStatus = "cancelled";
        await cancelReservationStatus(
          reservation.reservation_id,
          newStatus,
          abortController.signal
        );
        history.go(0);
      } catch (error) {
        if (error.name !== "AbortError") setError(error);
      }
    }
  }

  return (
    <div>
      <hr />

      <ErrorAlert error={error} />

      <div key={reservation.reservation_id}>
        <h6 data-reservation-id-status={`${reservation.reservation_id}`}>
          {reservation.status}
        </h6>

        <h5>
          {reservation.last_name}, {reservation.first_name}
        </h5>

        <h6>{reservation.mobile_number}</h6>

        <h6>
          {reservation.reservation_date} at {reservation.reservation_time} for{" "}
          {reservation.people}
        </h6>

        {reservation.status === "booked" ? (
          <button className="btn btn-dark">
            <Link
              to={`/reservations/${reservation.reservation_id}/seat`}
              style={{ color: "white" }}
            >
              Seat
            </Link>
          </button>
        ) : null}

        {reservation.status === "booked" ? (
          <button className="btn btn-outline-dark">
            <Link
              to={`/reservations/${reservation.reservation_id}/edit`}
              style={{ color: "black" }}
            >
              Edit
            </Link>
          </button>
        ) : null}

        <button
          className="btn btn-danger"
          data-reservation-id-cancel={reservation.reservation_id}
          onClick={handleCancel}
        >
          Cancel
        </button>

        <hr />
      </div>
    </div>
  );
}
