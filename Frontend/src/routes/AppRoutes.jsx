import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import Profile from "../pages/profile/Profile";
import Attendance from "../pages/attendance/Attendance";
import LeaveManagement from "../pages/leave/LeaveManagement";
import Payroll from "../pages/payroll/Payroll";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/employee-dashboard"
        element={
          <PrivateRoute>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <PrivateRoute>
            <Attendance />
          </PrivateRoute>
        }
      />
      <Route
        path="/leave"
        element={
          <PrivateRoute>
            <LeaveManagement />
          </PrivateRoute>
        }
      />
      <Route
        path="/payroll"
        element={
          <PrivateRoute>
            <Payroll />
          </PrivateRoute>
        }
      />

      {/* Default route */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
