import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  records: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    fetchAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.records = action.payload;
      state.error = null;
    },
    fetchAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    markAttendanceStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    markAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.records.push(action.payload);
      state.error = null;
    },
    markAttendanceFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAttendanceStart,
  fetchAttendanceSuccess,
  fetchAttendanceFailure,
  markAttendanceStart,
  markAttendanceSuccess,
  markAttendanceFailure,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
