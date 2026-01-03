import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [],
  loading: false,
  error: null,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    fetchPayrollStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPayrollSuccess: (state, action) => {
      state.loading = false;
      state.records = action.payload;
      state.error = null;
    },
    fetchPayrollFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPayrollStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPayrollSuccess: (state, action) => {
      state.loading = false;
      state.records.push(action.payload);
      state.error = null;
    },
    createPayrollFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchPayrollStart,
  fetchPayrollSuccess,
  fetchPayrollFailure,
  createPayrollStart,
  createPayrollSuccess,
  createPayrollFailure,
} = payrollSlice.actions;

export default payrollSlice.reducer;

