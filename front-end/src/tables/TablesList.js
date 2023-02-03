import React from "react";
import { finishTable } from "../utils/api";
import { useHistory } from "react-router";

export default function TableList({ table, setTablesError }) {
  const history = useHistory();
  async function clearTable(event) {
    event.preventDefault();
    const abortController = new AbortController();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await finishTable(table.table_id, abortController.signal);
        history.go(0);
      } catch (error) {
        setTablesError(error.message);
      }
    }
  }

  return (
    <div key={table.table_id}>
      <h6>
        Table: {table.table_name} - Capacity: {table.capacity}
      </h6>
      <p data-table-id-status={`${table.table_id}`} value={table.table_id}>
        {table.reservation_id ? "occupied" : "free"}
      </p>
      {table.reservation_id && (
        <div>
          <button
            className="btn btn-outline-dark"
            name={table.table_id}
            data-table-id-finish={table.table_id}
            onClick={clearTable}
          >
            Finish
          </button>
        </div>
      )}
    </div>
  );
}
