import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { attendanceService } from "../../services/attendanceService";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import AttendanceCard from "../../components/cards/AttendanceCard";
import { formatDate } from "../../utils/helpers";

function Attendance() {
  const { user } = useSelector((state) => state.auth);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Fetch attendance records
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // In a real app, this would fetch from the API
        // const records = await attendanceService.getAttendanceRecords(user.id, dateRange);
        // For now, using mock data
        const mockRecords = [
          {
            id: 1,
            date: "2023-06-01",
            checkIn: "09:00 AM",
            checkOut: "06:00 PM",
            status: "Present",
            hoursWorked: "9",
          },
          {
            id: 2,
            date: "2023-06-02",
            checkIn: "09:15 AM",
            checkOut: "05:45 PM",
            status: "Present",
            hoursWorked: "8.5",
          },
          {
            id: 3,
            date: "2023-06-03",
            checkIn: "09:00 AM",
            checkOut: "06:00 PM",
            status: "Present",
            hoursWorked: "9",
          },
          {
            id: 4,
            date: "2023-06-04",
            checkIn: "",
            checkOut: "",
            status: "Absent",
            hoursWorked: "0",
          },
          {
            id: 5,
            date: "2023-06-05",
            checkIn: "09:00 AM",
            checkOut: "04:00 PM",
            status: "Half Day",
            hoursWorked: "7",
          },
        ];
        setAttendanceRecords(mockRecords);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user, dateRange]);

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value,
    });
  };

  const handleMarkAttendance = async () => {
    // In a real app, this would call the API to mark attendance
    alert("Attendance marked successfully!");
  };

  return (
    <div className="attendance-layout">
      <Sidebar />
      <div className="attendance-content">
        <Navbar />
        <div className="attendance-main">
          <h1>Attendance</h1>

          <div className="attendance-controls">
            <div className="date-filters">
              <div className="form-group">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date:</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateRangeChange}
                />
              </div>
              <button className="filter-btn">Filter</button>
            </div>

            <div className="attendance-clock">
              <div className="current-time">
                <h3>Current Time: {formatDate(currentTime, "hh:mm:ss a")}</h3>
                <p>Date: {formatDate(currentTime, "dd/MM/yyyy")}</p>
              </div>
              <button
                className="mark-attendance-btn"
                onClick={handleMarkAttendance}
              >
                Mark Attendance
              </button>
            </div>
          </div>

          <div className="attendance-summary">
            <div className="summary-card">
              <h3>Monthly Summary</h3>
              <p>Present: 20 days</p>
              <p>Absent: 2 days</p>
              <p>On Leave: 1 day</p>
              <p>Working Hours: 160 hours</p>
            </div>
          </div>

          <div className="attendance-records">
            <h2>Attendance Records</h2>
            {loading ? (
              <p>Loading attendance records...</p>
            ) : attendanceRecords.length > 0 ? (
              <div className="attendance-list">
                {attendanceRecords.map((record) => (
                  <AttendanceCard key={record.id} attendance={record} />
                ))}
              </div>
            ) : (
              <p>No attendance records found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
