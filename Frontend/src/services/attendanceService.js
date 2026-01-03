import api from "./api";

export const attendanceService = {
  // Clock in
  clockIn: async () => {
    const response = await api.post("/attendance/checkin");
    return response.data;
  },

  // Clock out
  clockOut: async () => {
    const response = await api.post("/attendance/checkout");
    return response.data;
  },

  // Get attendance records
  getAttendanceRecords: async (params = {}) => {
    const response = await api.get("/attendance", { params });
    return response.data;
  },

  // Get attendance by ID
  getAttendanceById: async (id) => {
    const response = await api.get(`/attendance/${id}`);
    return response.data;
  },

  // Get dashboard summary
  getAttendanceSummary: async () => {
    const response = await api.get("/attendance");
    return response.data;
  },
};

export default attendanceService;
