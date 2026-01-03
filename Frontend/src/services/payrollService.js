import api from "./api";

export const payrollService = {
  getPayrollHistory: async (userId) => {
    const response = await api.get("/payroll/history", {
      params: {
        userId,
      },
    });
    return response.data;
  },

  getPayrollDetails: async (payrollId) => {
    const response = await api.get(`/payroll/details/${payrollId}`);
    return response.data;
  },

  generatePayroll: async (payrollData) => {
    const response = await api.post("/payroll/generate", payrollData);
    return response.data;
  },

  getSalarySlip: async (payrollId) => {
    const response = await api.get(`/payroll/slip/${payrollId}`, {
      responseType: "blob",
    });
    return response.data;
  },

  getPayrollSummary: async (userId) => {
    const response = await api.get(`/payroll/summary/${userId}`);
    return response.data;
  },
};

export default payrollService;
