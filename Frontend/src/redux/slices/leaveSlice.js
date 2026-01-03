import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  requests: [],
  loading: false,
  error: null,
};

const leaveSlice = createSlice({
  name: "leave",
  initialState,
  reducers: {
    fetchLeaveRequestsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchLeaveRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requests = action.payload;
      state.error = null;
    },
    fetchLeaveRequestsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    submitLeaveRequestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitLeaveRequestSuccess: (state, action) => {
      state.loading = false;
      state.requests.push(action.payload);
      state.error = null;
    },
    submitLeaveRequestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateLeaveStatusStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateLeaveStatusSuccess: (state, action) => {
      state.loading = false;
      const index = state.requests.findIndex(
        (request) => request.id === action.payload.id
      );
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      state.error = null;
    },
    updateLeaveStatusFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLeaveRequestsStart,
  fetchLeaveRequestsSuccess,
  fetchLeaveRequestsFailure,
  submitLeaveRequestStart,
  submitLeaveRequestSuccess,
  submitLeaveRequestFailure,
  updateLeaveStatusStart,
  updateLeaveStatusSuccess,
  updateLeaveStatusFailure,
} = leaveSlice.actions;

export default leaveSlice.reducer;
