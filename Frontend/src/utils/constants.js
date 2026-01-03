// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USERS: {
    PROFILE: "/users/profile",
    UPDATE_PROFILE: "/users/profile",
  },
  ATTENDANCE: {
    MARK: "/attendance/mark",
    GET_RECORDS: "/attendance",
    MONTHLY_REPORT: "/attendance/monthly-report",
    SUMMARY: "/attendance/summary",
  },
  LEAVE: {
    REQUEST: "/leave/request",
    REQUESTS: "/leave/requests",
    BALANCE: "/leave/balance",
    TYPES: "/leave/types",
  },
  PAYROLL: {
    HISTORY: "/payroll/history",
    DETAILS: "/payroll/details",
    GENERATE: "/payroll/generate",
    SLIP: "/payroll/slip",
    SUMMARY: "/payroll/summary",
  },
};

// Leave Status Constants
export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

// User Roles
export const USER_ROLES = {
  EMPLOYEE: "employee",
  MANAGER: "manager",
  ADMIN: "admin",
};

// Date Formats
export const DATE_FORMATS = {
  DEFAULT: "YYYY-MM-DD",
  DISPLAY: "DD/MM/YYYY",
  TIME: "HH:mm",
};

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  THEME: "theme",
};
