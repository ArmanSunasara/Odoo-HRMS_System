import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import api from "../../services/api";
import { leaveService } from "../../services/leaveService";
import { attendanceService } from "../../services/attendanceService";
import { formatDate } from "../../utils/helpers";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    pendingLeaveRequests: 0,
    todayAttendance: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [attendanceOverview, setAttendanceOverview] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all users/employees
      const usersResponse = await api.get("/users");
      const usersData = Array.isArray(usersResponse.data)
        ? usersResponse.data
        : usersResponse.data?.users || [];
      
      setEmployees(usersData);
      setStats((prev) => ({
        ...prev,
        totalEmployees: usersData.length,
        activeEmployees: usersData.filter((u) => !u.isVerified === false).length,
      }));

      // Fetch pending leave requests
      const leaveResponse = await leaveService.getLeaveRequests();
      const leaveData = Array.isArray(leaveResponse)
        ? leaveResponse
        : leaveResponse.data || [];
      
      const pending = leaveData.filter((leave) => leave.status === "PENDING");
      setPendingLeaves(pending.slice(0, 5)); // Get latest 5
      setStats((prev) => ({
        ...prev,
        pendingLeaveRequests: pending.length,
      }));

      // Fetch today's attendance
      const today = new Date().toISOString().split("T")[0];
      const attendanceResponse = await attendanceService.getAttendanceRecords({
        date: today,
      });
      const attendanceData = Array.isArray(attendanceResponse)
        ? attendanceResponse
        : attendanceResponse.data || [];
      
      setAttendanceOverview(attendanceData.slice(0, 10)); // Get latest 10
      setStats((prev) => ({
        ...prev,
        todayAttendance: attendanceData.filter(
          (a) => a.clockIn || a.status === "PRESENT"
        ).length,
      }));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId) => {
    try {
      await leaveService.approveLeave(leaveId);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error approving leave:", error);
      alert("Failed to approve leave request");
    }
  };

  const handleRejectLeave = async (leaveId) => {
    try {
      await leaveService.rejectLeave(leaveId);
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error("Error rejecting leave:", error);
      alert("Failed to reject leave request");
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
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">Manage your workforce</p>
          </div>

          {/* Statistics Cards */}
          <div className="dashboard-cards">
            <Card className="stat-card">
              <div className="stat-content">
                <h3>Total Employees</h3>
                <h2>{stats.totalEmployees}</h2>
              </div>
            </Card>

            <Card className="stat-card stat-card-success">
              <div className="stat-content">
                <h3>Active Employees</h3>
                <h2>{stats.activeEmployees}</h2>
              </div>
            </Card>

            <Card className="stat-card stat-card-warning">
              <div className="stat-content">
                <h3>Pending Leave Requests</h3>
                <h2>{stats.pendingLeaveRequests}</h2>
              </div>
            </Card>

            <Card className="stat-card stat-card-info">
              <div className="stat-content">
                <h3>Today's Attendance</h3>
                <h2>{stats.todayAttendance}</h2>
              </div>
            </Card>
          </div>

          {/* Employee List */}
          <Card title="Employee List" className="dashboard-section-card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Position</th>
                    <th>Department</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 10).map((employee) => (
                    <tr key={employee._id || employee.id}>
                      <td>{employee.employeeId}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.jobDetails?.position || "-"}</td>
                      <td>{employee.jobDetails?.department || "-"}</td>
                      <td>
                        <span className={`badge badge-${employee.role === "ADMIN" ? "danger" : "primary"}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/profile?userId=${employee._id || employee.id}`}
                          className="btn-link"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {employees.length > 10 && (
              <div className="card-footer">
                <Link to="/users" className="btn-link">
                  View All Employees →
                </Link>
              </div>
            )}
          </Card>

          {/* Pending Leave Approvals */}
          {pendingLeaves.length > 0 && (
            <Card title="Pending Leave Approvals" className="dashboard-section-card">
              <div className="leave-approval-list">
                {pendingLeaves.map((leave) => (
                  <div key={leave._id || leave.id} className="leave-approval-item">
                    <div className="leave-approval-info">
                      <h4>
                        {leave.userId?.name || leave.user?.name || "Employee"}
                      </h4>
                      <p>
                        <strong>Type:</strong> {leave.leaveType || "Leave"}
                      </p>
                      <p>
                        <strong>Dates:</strong>{" "}
                        {formatDate(leave.startDate, "dd/MM/yyyy")} -{" "}
                        {formatDate(leave.endDate, "dd/MM/yyyy")}
                      </p>
                      {leave.reason && (
                        <p>
                          <strong>Reason:</strong> {leave.reason}
                        </p>
                      )}
                    </div>
                    <div className="leave-approval-actions">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleApproveLeave(leave._id || leave.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRejectLeave(leave._id || leave.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Attendance Overview */}
          {attendanceOverview.length > 0 && (
            <Card title="Today's Attendance Overview" className="dashboard-section-card">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceOverview.map((record, index) => (
                      <tr key={index}>
                        <td>
                          {record.userId?.name ||
                            record.user?.name ||
                            "Employee"}
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

          {/* Quick Actions */}
          <Card title="Quick Actions" className="dashboard-section-card">
            <div className="quick-actions">
              <Link to="/profile" className="action-btn">
                <span className="action-icon">👤</span>
                Manage Profile
              </Link>
              <Link to="/attendance" className="action-btn">
                <span className="action-icon">⏰</span>
                View Attendance
              </Link>
              <Link to="/leave" className="action-btn">
                <span className="action-icon">📅</span>
                Manage Leaves
              </Link>
              <Link to="/payroll" className="action-btn">
                <span className="action-icon">💰</span>
                Manage Payroll
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
