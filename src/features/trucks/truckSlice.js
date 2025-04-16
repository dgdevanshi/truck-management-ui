import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import truckService from "./truckService";

// Get truck status
export const getTruckStatus = createAsyncThunk(
  "trucks/getStatus",
  async (_, thunkAPI) => {
    try {
      return await truckService.getTruckStatus();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch truck status";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Log truck action (check-in/check-out)
export const logTruckAction = createAsyncThunk(
  "trucks/logAction",
  async (logData, thunkAPI) => {
    try {
      return await truckService.logTruckAction(logData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to log truck action";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  trucks: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const truckSlice = createSlice({
  name: "trucks",
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
      .addCase(getTruckStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTruckStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Ensure trucks is always an array
        state.trucks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getTruckStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logTruckAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logTruckAction.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        // We'll need to refresh the truck list after a successful action
      })
      .addCase(logTruckAction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = truckSlice.actions;
export default truckSlice.reducer;
