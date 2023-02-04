import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservation, updateReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const history = useHistory();
  const { reservation_id } = useParams();
  let initialFormData = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errorArray, setErrorArray] = useState([]);

  useEffect(() => {
    const abortController = new AbortController();
    const loadReservation = async () => {
      try {
        let recallReservation = await readReservation(
          reservation_id,
          abortController.signal
        );
        recallReservation.reservation_date =
          recallReservation.reservation_date.split("T")[0];

        initialFormData = {
          first_name: recallReservation.first_name,
          last_name: recallReservation.last_name,
          mobile_number: recallReservation.mobile_number,
          reservation_date: recallReservation.reservation_date,
          reservation_time: recallReservation.reservation_time,
          people: recallReservation.people,
        };
        setFormData(initialFormData);
      } catch (error) {
        setErrorArray([error.message]);
      }
    };

    loadReservation();
    return () => abortController.abort();
  }, [reservation_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    formData.people = Number(formData.people);
    // reservationValidation(formData);
    // validateTime(formData.reservation_time);
    const putReservation = async () => {
      try {
        await updateReservation(
          formData,
          reservation_id,
          abortController.signal
        );
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setErrorArray([error.message]);
      }
    };

    putReservation();
  };

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  // handleSubmit handleChange handleCancel formData
  return (
    <div>
      <h1>Edit Reservation</h1>
      {errorArray.length !== 0 && (
        <div>
          <ErrorAlert error={errorArray} />
        </div>
      )}
      <div>
        <ReservationForm
          handleChange={handleChange}
          reservation={formData}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
