import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../../components/common/Sidebar";
import Navbar from "../../components/common/Navbar";
import EmployeeCard from "../../components/cards/EmployeeCard";

function EmployeeDashboard() {
  const { user } = useSelector((state) => state.auth);

  // Mock data for demonstration
  const employeeData = {
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    position: user?.position || "Software Engineer",
    department: user?.department || "IT",
    avatar: user?.avatar || null,
  };

  const attendanceStats = {
    totalDays: 22,
    present: 20,
    absent: 2,
    leave: 0,
  };

  const recentAttendance = [
    {
      date: "2023-06-01",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "Present",
      hoursWorked: "9",
    },
    {
      date: "2023-06-02",
      checkIn: "09:15 AM",
      checkOut: "05:45 PM",
      status: "Present",
      hoursWorked: "8.5",
    },
    {
      date: "2023-06-03",
      checkIn: "09:00 AM",
      checkOut: "06:00 PM",
      status: "Present",
      hoursWorked: "9",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-content">
        <Navbar />
        <div className="dashboard-main">
          <h1>Employee Dashboard</h1>

          <div className="dashboard-cards">
            <div className="card">
              <h3>My Profile</h3>
              <EmployeeCard employee={employeeData} />
            </div>

            <div className="card">
              <h3>Attendance Summary</h3>
              <div className="attendance-stats">
                <div className="stat">
                  <h4>{attendanceStats.totalDays}</h4>
                  <p>Total Days</p>
                </div>
                <div className="stat">
                  <h4>{attendanceStats.present}</h4>
                  <p>Present</p>
                </div>
                <div className="stat">
                  <h4>{attendanceStats.absent}</h4>
                  <p>Absent</p>
                </div>
                <div className="stat">
                  <h4>{attendanceStats.leave}</h4>
                  <p>On Leave</p>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>Recent Attendance</h2>
            <div className="attendance-list">
              {recentAttendance.map((record, index) => (
                <div key={index} className="attendance-item">
                  <span>{record.date}</span>
                  <span>
                    {record.checkIn} - {record.checkOut}
                  </span>
                  <span className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
