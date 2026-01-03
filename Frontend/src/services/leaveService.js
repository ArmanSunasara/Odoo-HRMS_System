import api from "./api";

export const leaveService = {
  // Get all leave requests
  getLeaveRequests: async (params = {}) => {
    const response = await api.get("/leave", { params });
    return response.data;
  },

  // Get leave by ID
  getLeaveById: async (id) => {
    const response = await api.get(`/leave/${id}`);
    return response.data;
  },

  // Submit leave request
  submitLeaveRequest: async (leaveData) => {
    const response = await api.post("/leave/apply", leaveData);
    return response.data;
  },

  // Update leave request
  updateLeaveRequest: async (id, leaveData) => {
    const response = await api.put(`/leave/${id}`, leaveData);
    return response.data;
  },

  // Approve leave (Admin only)
  approveLeave: async (id) => {
    const response = await api.put(`/leave/${id}/status`, { status: "Approved" });
    return response.data;
  },

  // Reject leave (Admin only)
  rejectLeave: async (id) => {
    const response = await api.put(`/leave/${id}/status`, { status: "Rejected" });
    return response.data;
  },
};

export default leaveService;
