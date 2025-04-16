import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import userReducer from "../features/users/userSlice";
import workflowReducer from "../features/workflows/workflowSlice";
import truckReducer from "../features/trucks/truckSlice";
import reportReducer from "../features/reports/reportSlice";
import operatorReducer from "../features/operator/operatorSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    workflows: workflowReducer,
    trucks: truckReducer,
    reports: reportReducer,
    operator: operatorReducer,
  },
});
