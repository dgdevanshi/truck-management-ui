import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "./reportService";

// Get turnaround report
export const getTurnaroundReport = createAsyncThunk(
  "reports/getTurnaround",
  async ({ startDate, endDate }, thunkAPI) => {
    try {
      return await reportService.getTurnaroundReport(startDate, endDate);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch report";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  reportData: [],
  reportStats: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTurnaroundReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTurnaroundReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.reportData = action.payload;
        state.reportStats = reportService.calculateReportStats(action.payload);
      })
      .addCase(getTurnaroundReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = reportSlice.actions;
export default reportSlice.reducer;
