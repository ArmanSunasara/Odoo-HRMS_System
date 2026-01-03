import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Employee routes */}
      <Route
        path="/employee/dashboard"
        element={
          <PrivateRoute requiredRole="EMPLOYEE">
            <EmployeeDashboard />
          </PrivateRoute>
        }
      />

      {/* Protected Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute requiredRole="ADMIN">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Protected common routes */}
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

      {/* Default route - redirect based on auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
