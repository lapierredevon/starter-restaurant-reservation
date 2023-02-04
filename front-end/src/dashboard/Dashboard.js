import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";
import { Link } from "react-router-dom";
import TableList from "../tables/TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const queryDate = useQuery().get("date");

  if (queryDate) {
    date = queryDate;
  }

  useEffect(() => {
    const abortController = new AbortController();
    const loadReservations = async () => {
      try {
        const recallReservations = await listReservations(
          { date },
          abortController.signal
        );
        const rsvps = recallReservations.filter((rsvp) => {
          if (rsvp.status !== "cancelled" || rsvp.status !== "finished") {
            return rsvp;
          }
        });
        setReservations(rsvps);
      } catch (error) {
        setReservationsError(error.message);
      }
    };

    const loadTables = async () => {
      try {
        const recallTables = await listTables(abortController.signal);
        setTables(recallTables);
      } catch (error) {
        setTables(error.message);
      }
    };

    loadReservations();
    loadTables();
    return () => abortController.abort();
  }, [date]);

  const listRsvp = reservations.map((reservation) => {
    return (
      <ReservationsList
        key={reservation.reservation_id}
        reservation={reservation}
      />
    );
  });

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="btn-group grid gap-3" role="group">
        <div>
          <Link
            to={`/dashboard?date=${previous(date)}`}
            className="btn btn-dark"
          >
            Previous Day
          </Link>
        </div>
        <br />
        <div>
          <Link to={`dashboard?date=${today()}`} className="btn btn-dark">
            Today
          </Link>
        </div>
        <br />
        <div>
          <Link to={`dashboard?date=${next(date)}`} className="btn btn-dark">
            Next Date
          </Link>
        </div>
      </div>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <div>{listRsvp}</div>
      <hr />
      <h4>Tables:</h4>
      <hr />
      <div>
        {tables.map((table, id) => {
          return (
            <div key={table.table_id}>
              <TableList setTablesError={setTablesError} table={table} />
              {/* <h6>
                Table: {table.table_name} - Capacity: {table.capacity}
              </h6>
              {table.reservation_id && (
                <div>
                  <p
                    data-table-id-status={`${table.table_id}`}
                    value={table.table_id}
                  >
                    {table.reservation_id ? "occupied" : "free"}
                  </p>
                  <button
                    className="btn btn-outline-dark"
                    name={table.table_id}
                    data-table-id-finish={table.table_id}
                    onClick={clearTable}
                  >
                    Finish
                  </button>
                </div>
              )} */}
              {/* {!table.reservation_id && (
                <div>
                  <p data-table-id-status={`${table.table_id}`}>Free</p>
                </div>
              )} 
              <hr /> */}
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Dashboard;
