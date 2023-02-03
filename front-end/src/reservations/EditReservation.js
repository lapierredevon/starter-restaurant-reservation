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

  // const reservationValidation = (formData) => {
  //   const date = new Date(`${formData.reservation_date} PDT`);
  //   const reservation = date.getTime();
  //   const now = Date.now();

  //   let err = [];

  //   if (date.getUTCDay() === 2) {
  //     err.push("Restaurant is closed on Tuesday.");
  //   }

  //   if (reservation < now) {
  //     err.push("Select a future date for reservation.");
  //   }

  //   if (err.length) {
  //     setErrorArray([...err]);
  //   }
  // };

  // const validateTime = (time) => {
  //   const open = 10 * 60 + 30;
  //   const close = 21 * 60 + 30;
  //   const lastCall = 21 * 60;
  //   const hours = Number(time.substring(0, 2));
  //   const minutes = Number(time.substring(3));
  //   const rsvpTime = hours * 60 + minutes;

  //   const errs = [];

  //   if (rsvpTime < open || rsvpTime > lastCall) {
  //     errs.push("Reservation between 10:30am and 9:30pm");
  //   }

  //   if (errs.length) {
  //     setErrorArray([...errorArray, ...errs]);
  //   }
  // };

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
        setErrorArray(error.message);
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
