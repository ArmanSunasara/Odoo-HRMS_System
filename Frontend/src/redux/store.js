import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import attendanceReducer from "./slices/attendanceSlice";
import leaveReducer from "./slices/leaveSlice";
import payrollReducer from "./slices/payrollSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    attendance: attendanceReducer,
    leave: leaveReducer,
    payroll: payrollReducer,
  },
});

export default store;
