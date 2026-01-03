import api from "./api";

export const attendanceService = {
  getAttendanceRecords: async (userId, dateRange) => {
    const response = await api.get("/attendance", {
      params: {
        userId,
        ...dateRange,
      },
    });
    return response.data;
  },

  markAttendance: async (attendanceData) => {
    const response = await api.post("/attendance/mark", attendanceData);
    return response.data;
  },

  getMonthlyReport: async (userId, month, year) => {
    const response = await api.get("/attendance/monthly-report", {
      params: {
        userId,
        month,
        year,
      },
    });
    return response.data;
  },

  getAttendanceSummary: async (userId) => {
    const response = await api.get(`/attendance/summary/${userId}`);
    return response.data;
  },
};

export default attendanceService;
