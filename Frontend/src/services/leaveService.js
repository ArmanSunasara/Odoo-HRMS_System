import api from "./api";

export const leaveService = {
  getLeaveRequests: async (userId) => {
    const response = await api.get("/leave/requests", {
      params: {
        userId,
      },
    });
    return response.data;
  },

  submitLeaveRequest: async (leaveData) => {
    const response = await api.post("/leave/request", leaveData);
    return response.data;
  },

  updateLeaveStatus: async (requestId, status, managerNote = "") => {
    const response = await api.put(`/leave/request/${requestId}/status`, {
      status,
      managerNote,
    });
    return response.data;
  },

  getLeaveBalance: async (userId) => {
    const response = await api.get(`/leave/balance/${userId}`);
    return response.data;
  },

  getLeaveTypes: async () => {
    const response = await api.get("/leave/types");
    return response.data;
  },
};

export default leaveService;
