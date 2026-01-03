import api from "./api";

export const payrollService = {
  // Get all payroll records
  getPayrollRecords: async (params = {}) => {
    const response = await api.get("/payroll", { params });
    return response.data;
  },

  // Get payroll by ID
  getPayrollById: async (id) => {
    const response = await api.get(`/payroll/${id}`);
    return response.data;
  },

  // Create payroll (Admin only)
  createPayroll: async (payrollData) => {
    const response = await api.post("/payroll", payrollData);
    return response.data;
  },

  // Update payroll (Admin only)
  updatePayroll: async (id, payrollData) => {
    const response = await api.put(`/payroll/${id}`, payrollData);
    return response.data;
  },
};

export default payrollService;
