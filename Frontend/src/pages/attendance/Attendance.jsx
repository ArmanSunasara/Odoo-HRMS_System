import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { attendanceService } from "../../services/attendanceService";
import {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  markAttendanceStart,
  markAttendanceSuccess,
  markAttendanceFailure,
} from "../../redux/slices/attendanceSlice";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { formatDate } from "../../utils/helpers";

function Attendance() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { records, loading, error } = useSelector((state) => state.attendance);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [canClockIn, setCanClockIn] = useState(true);
  const [canClockOut, setCanClockOut] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch attendance records
  useEffect(() => {
    fetchAttendanceRecords();
    checkTodayAttendance();
  }, [dateFilter]);

  const fetchAttendanceRecords = async () => {
    try {
      dispatch(fetchAttendanceStart());
      const params = {};
      if (dateFilter.startDate) params.startDate = dateFilter.startDate;
      if (dateFilter.endDate) params.endDate = dateFilter.endDate;

      const response = await attendanceService.getAttendanceRecords(params);
      const attendanceData = Array.isArray(response)
        ? response
        : response.data || [];

      dispatch(fetchAttendanceSuccess(attendanceData));
    } catch (error) {
      dispatch(
        fetchAttendanceFailure(
          error.response?.data?.message || "Failed to fetch attendance records"
        )
      );
    }
  };

  const checkTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await attendanceService.getAttendanceRecords({
        date: today,
      });
      const todayRecords = Array.isArray(response)
        ? response
        : response.data || [];

      if (todayRecords.length > 0) {
        const todayRecord = todayRecords[0];
        setTodayAttendance(todayRecord);
        setCanClockIn(false);
        setCanClockOut(!!todayRecord.clockIn && !todayRecord.clockOut);
      } else {
        setTodayAttendance(null);
        setCanClockIn(true);
        setCanClockOut(false);
      }
    } catch (error) {
      console.error("Error checking today's attendance:", error);
    }
  };

  const handleClockIn = async () => {
    try {
      dispatch(markAttendanceStart());
      const response = await attendanceService.clockIn();
      dispatch(markAttendanceSuccess(response));
      setTodayAttendance(response);
      setCanClockIn(false);
      setCanClockOut(true);
      fetchAttendanceRecords();
    } catch (error) {
      dispatch(
        markAttendanceFailure(
          error.response?.data?.message || "Failed to clock in"
        )
      );
      alert(error.response?.data?.message || "Failed to clock in");
    }
  };

  const handleClockOut = async () => {
    try {
      dispatch(markAttendanceStart());
      const response = await attendanceService.clockOut();
      dispatch(markAttendanceSuccess(response));
      setTodayAttendance(response);
      setCanClockOut(false);
      fetchAttendanceRecords();
    } catch (error) {
      dispatch(
        markAttendanceFailure(
          error.response?.data?.message || "Failed to clock out"
        )
      );
      alert(error.response?.data?.message || "Failed to clock out");
    }
  };

  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter({
      ...dateFilter,
      [name]: value,
    });
  };

  const calculateHours = (clockIn, clockOut) => {
    if (!clockIn || !clockOut) return "-";
    const start = new Date(clockIn);
    const end = new Date(clockOut);
    const diffMs = end - start;
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(2);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <div className="page-header">
            <h1>Attendance Management</h1>
            <p>Track and manage your attendance records</p>
          </div>

          {/* Clock In/Out Section - Only for Employees */}
          {!isAdmin && (
            <Card title="Today's Attendance" className="attendance-clock-card">
              <div className="clock-section">
                <div className="current-time-display">
                  <div className="time-large">
                    {currentTime.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </div>
                  <div className="date-display">
                    {formatDate(currentTime, "EEEE, MMMM dd, yyyy")}
                  </div>
                </div>

                <div className="attendance-status">
                  {todayAttendance ? (
                    <div className="status-info">
                      <p>
                        <strong>Clock In:</strong>{" "}
                        {todayAttendance.clockIn
                          ? new Date(todayAttendance.clockIn).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "Not clocked in"}
                      </p>
                      {todayAttendance.clockOut && (
                        <p>
                          <strong>Clock Out:</strong>{" "}
                          {new Date(todayAttendance.clockOut).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="no-attendance">No attendance marked for today</p>
                  )}
                </div>

                <div className="clock-actions">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleClockIn}
                    disabled={!canClockIn || loading}
                    loading={loading && canClockIn}
                  >
                    Clock In
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleClockOut}
                    disabled={!canClockOut || loading}
                    loading={loading && canClockOut}
                  >
                    Clock Out
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Date Filter */}
          <Card title="Filter Records" className="filter-card">
            <div className="filter-controls">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateFilter.startDate}
                  onChange={handleDateFilterChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateFilter.endDate}
                  onChange={handleDateFilterChange}
                  className="form-input"
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchAttendanceRecords}
                disabled={loading}
              >
                Apply Filter
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter({ startDate: "", endDate: "" });
                  fetchAttendanceRecords();
                }}
              >
                Clear
              </Button>
            </div>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {/* Attendance Records */}
          <Card title={isAdmin ? "All Attendance Records" : "Your Attendance Records"}>
            {loading ? (
              <Loader message="Loading attendance records..." />
            ) : records.length > 0 ? (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      {isAdmin && <th>Employee</th>}
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Hours Worked</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, index) => (
                      <tr key={record._id || record.id || index}>
                        {isAdmin && (
                          <td>
                            {record.userId?.name ||
                              record.user?.name ||
                              "Employee"}
                          </td>
                        )}
                        <td>
                          {formatDate(
                            record.date || record.createdAt,
                            "dd/MM/yyyy"
                          )}
                        </td>
                        <td>
                          {record.clockIn
                            ? new Date(record.clockIn).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </td>
                        <td>
                          {record.clockOut
                            ? new Date(record.clockOut).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </td>
                        <td>
                          {calculateHours(record.clockIn, record.clockOut)}
                          {record.clockIn && !record.clockOut ? " (ongoing)" : ""}
                        </td>
                        <td>
                          <span
                            className={`badge badge-${
                              record.status === "PRESENT" || record.clockIn
                                ? "success"
                                : record.status === "ABSENT"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {record.status ||
                              (record.clockIn
                                ? record.clockOut
                                  ? "PRESENT"
                                  : "IN PROGRESS"
                                : "PENDING")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No attendance records found.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
