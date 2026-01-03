import React from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import EmployeeCard from "../../components/cards/EmployeeCard";

function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);

  // Mock data for demonstration
  const companyStats = {
    totalEmployees: 125,
    activeEmployees: 118,
    pendingRequests: 8,
    todayAttendance: 115,
  };

  const recentEmployees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      position: "Software Engineer",
      department: "IT",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      position: "HR Manager",
      department: "Human Resources",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      position: "Marketing Specialist",
      department: "Marketing",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <h1>Admin Dashboard</h1>

          <div className="dashboard-cards">
            <div className="card stat-card">
              <h3>Total Employees</h3>
              <h2>{companyStats.totalEmployees}</h2>
            </div>
            <div className="card stat-card">
              <h3>Active Employees</h3>
              <h2>{companyStats.activeEmployees}</h2>
            </div>
            <div className="card stat-card">
              <h3>Pending Requests</h3>
              <h2>{companyStats.pendingRequests}</h2>
            </div>
            <div className="card stat-card">
              <h3>Today's Attendance</h3>
              <h2>{companyStats.todayAttendance}</h2>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Employees</h2>
            <div className="employee-list">
              {recentEmployees.map((employee) => (
                <EmployeeCard key={employee.id} employee={employee} />
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">Add Employee</button>
              <button className="action-btn">Generate Report</button>
              <button className="action-btn">Manage Payroll</button>
              <button className="action-btn">Review Leave Requests</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
