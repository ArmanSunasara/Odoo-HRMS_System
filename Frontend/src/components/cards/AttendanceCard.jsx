import React from "react";
import { formatDate } from "../../utils/helpers";

function AttendanceCard({ attendance }) {
  const { date, checkIn, checkOut, status, hoursWorked } = attendance;

  return (
    <div className="attendance-card">
      <div className="attendance-date">
        <h3>{formatDate(date)}</h3>
        <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </div>
      <div className="attendance-details">
        <div className="time-info">
          <p>
            <strong>Check In:</strong> {checkIn || "N/A"}
          </p>
          <p>
            <strong>Check Out:</strong> {checkOut || "N/A"}
          </p>
          <p>
            <strong>Hours:</strong> {hoursWorked || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AttendanceCard;
