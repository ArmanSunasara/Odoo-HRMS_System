import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import { attendanceService } from "../../services/attendanceService";
import { leaveService } from "../../services/leaveService";
import { formatDate } from "../../utils/helpers";

function EmployeeDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalDays: 0,
    present: 0,
    absent: 0,
    onLeave: 0,
  });
  const [leaveSummary, setLeaveSummary] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentLeaves, setRecentLeaves] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch attendance records
      const attendanceResponse = await attendanceService.getAttendanceRecords();
      const attendanceData = Array.isArray(attendanceResponse)
        ? attendanceResponse
        : attendanceResponse.data || [];

      // Calculate attendance summary
      const present = attendanceData.filter(
        (record) => record.status === "PRESENT" || record.clockIn
      ).length;
      const absent = attendanceData.filter(
        (record) => record.status === "ABSENT"
      ).length;
      const onLeave = attendanceData.filter(
        (record) => record.status === "ON_LEAVE"
      ).length;

      setAttendanceSummary({
        totalDays: attendanceData.length,
        present,
        absent,
        onLeave,
      });

      // Get recent attendance (last 5 records)
      const recent = attendanceData
        .sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
        .slice(0, 5);
      setRecentAttendance(recent);

      // Fetch leave requests
      const leaveResponse = await leaveService.getLeaveRequests();
      const leaveData = Array.isArray(leaveResponse)
        ? leaveResponse
        : leaveResponse.data || [];

      // Calculate leave summary
      const pending = leaveData.filter((leave) => leave.status === "PENDING").length;
      const approved = leaveData.filter((leave) => leave.status === "APPROVED").length;
      const rejected = leaveData.filter((leave) => leave.status === "REJECTED").length;

      setLeaveSummary({ pending, approved, rejected });

      // Get recent leave requests (last 3)
      const recentLeavesData = leaveData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
      setRecentLeaves(recentLeavesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <div className="dashboard-content">
          <Navbar />
          <div className="dashboard-main">
            <Loader message="Loading dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <div className="dashboard-header">
            <h1>Welcome back, {user?.name || "Employee"}!</h1>
            <p className="dashboard-subtitle">Here's your overview</p>
          </div>

          {/* Quick Action Cards */}
          <div className="dashboard-cards">
            <Card
              title="Profile"
              className="dashboard-card clickable"
              onClick={() => (window.location.href = "/profile")}
            >
              <div className="card-content">
                <div className="card-icon">👤</div>
                <p>View and update your profile</p>
              </div>
            </Card>

            <Card
              title="Attendance"
              className="dashboard-card clickable"
              onClick={() => (window.location.href = "/attendance")}
            >
              <div className="card-content">
                <div className="card-icon">⏰</div>
                <p>Clock in/out and view records</p>
              </div>
            </Card>

            <Card
              title="Leave Requests"
              className="dashboard-card clickable"
              onClick={() => (window.location.href = "/leave")}
            >
              <div className="card-content">
                <div className="card-icon">📅</div>
                <p>Apply for leave and check status</p>
              </div>
            </Card>

            <Card
              title="Logout"
              className="dashboard-card clickable"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
              }}
            >
              <div className="card-content">
                <div className="card-icon">🚪</div>
                <p>Sign out of your account</p>
              </div>
            </Card>
          </div>

          {/* Attendance Summary */}
          <Card title="Attendance Summary" className="dashboard-section-card">
            <div className="stats-grid">
              <div className="stat-item">
                <h3>{attendanceSummary.totalDays}</h3>
                <p>Total Days</p>
              </div>
              <div className="stat-item stat-success">
                <h3>{attendanceSummary.present}</h3>
                <p>Present</p>
              </div>
              <div className="stat-item stat-warning">
                <h3>{attendanceSummary.absent}</h3>
                <p>Absent</p>
              </div>
              <div className="stat-item stat-info">
                <h3>{attendanceSummary.onLeave}</h3>
                <p>On Leave</p>
              </div>
            </div>
          </Card>

          {/* Leave Status Summary */}
          <Card title="Leave Status Summary" className="dashboard-section-card">
            <div className="stats-grid">
              <div className="stat-item stat-warning">
                <h3>{leaveSummary.pending}</h3>
                <p>Pending</p>
              </div>
              <div className="stat-item stat-success">
                <h3>{leaveSummary.approved}</h3>
                <p>Approved</p>
              </div>
              <div className="stat-item stat-danger">
                <h3>{leaveSummary.rejected}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </Card>

          {/* Recent Attendance */}
          {recentAttendance.length > 0 && (
            <Card title="Recent Attendance" className="dashboard-section-card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentAttendance.map((record, index) => (
                      <tr key={index}>
                        <td>
                          {formatDate(record.date || record.createdAt, "dd/MM/yyyy")}
                        </td>
                        <td>
                          {record.clockIn
                            ? new Date(record.clockIn).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                        <td>
                          {record.clockOut
                            ? new Date(record.clockOut).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
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
                            {record.status || (record.clockIn ? "PRESENT" : "PENDING")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Recent Leave Requests */}
          {recentLeaves.length > 0 && (
            <Card title="Recent Leave Requests" className="dashboard-section-card">
              <div className="leave-list">
                {recentLeaves.map((leave, index) => (
                  <div key={index} className="leave-item">
                    <div className="leave-info">
                      <h4>{leave.leaveType || "Leave"}</h4>
                      <p>
                        {formatDate(leave.startDate, "dd/MM/yyyy")} -{" "}
                        {formatDate(leave.endDate, "dd/MM/yyyy")}
                      </p>
                    </div>
                    <span
                      className={`badge badge-${
                        leave.status === "APPROVED"
                          ? "success"
                          : leave.status === "REJECTED"
                          ? "danger"
                          : "warning"
                      }`}
                    >
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
