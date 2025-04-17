import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import operatorService from "./operatorService";

// Get assigned checkpoint
export const getAssignedCheckpoint = createAsyncThunk(
  "operator/getCheckpoint",
  async (_, thunkAPI) => {
    try {
      return await operatorService.getAssignedCheckpoint();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch assigned checkpoint";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get trucks at checkpoint - make sure this function is properly defined
export const getCheckpointTrucks = createAsyncThunk(
  "operator/getTrucks",
  async (_, thunkAPI) => {
    try {
      ("Calling getCheckpointTrucks from operatorService");
      const result = await operatorService.getCheckpointTrucks();
      "getCheckpointTrucks result:", result;
      return result;
    } catch (error) {
      console.error("Error in getCheckpointTrucks thunk:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch checkpoint trucks";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Log truck action (check-in/check-out)
export const logTruckAction = createAsyncThunk(
  "operator/logAction",
  async (logData, thunkAPI) => {
    try {
      // Get the current state to access the checkpoint ID if not provided
      const state = thunkAPI.getState();

      if (logData.action === "check_in") {
        // Ensure checkpoint_id is included in the request
        if (!logData.checkpoint_id && state.operator.checkpoint) {
          logData.checkpoint_id = state.operator.checkpoint.id;
        }

        // Validate that we have a checkpoint_id
        if (!logData.checkpoint_id) {
          return thunkAPI.rejectWithValue("No checkpoint ID provided");
        }
      }

      // Validate that we have a truck_id
      if (!logData.truck_id) {
        return thunkAPI.rejectWithValue("No truck ID provided");
      }

      // Make sure the action is using the correct format for the backend API
      // Backend expects "checkin" or "checkout", not "check_in" or "check_out"
      if (logData.action === "check_in") {
        logData.action = "checkin";
      } else if (logData.action === "check_out") {
        logData.action = "checkout";
      }

      // Validate that we have a valid action
      if (logData.action !== "checkin" && logData.action !== "checkout") {
        return thunkAPI.rejectWithValue("Invalid action - must be checkin or checkout");
      }

      "Sending truck action with data:", logData;

      const result = await operatorService.logTruckAction(logData);

      // After successful action, refresh the truck list
      thunkAPI.dispatch(getCheckpointTrucks());
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        error.message ||
        "Failed to log truck action";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new truck
export const createTruck = createAsyncThunk(
  "operator/createTruck",
  async (truckData, thunkAPI) => {
    try {
      // Ensure checkpoint_id is set to 1 (entry gate) if not provided
      if (!truckData.checkpoint_id) {
        truckData.checkpoint_id = 1;
      }

      "Creating truck with data:", truckData;

      const result = await operatorService.createTruck(truckData);
      // After successful creation, refresh the truck list
      thunkAPI.dispatch(getCheckpointTrucks());
      return result;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create new truck";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  checkpoint: null,
  trucks: [],
  isLoading: false,
  isActionLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const operatorSlice = createSlice({
  name: "operator",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isActionLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAssignedCheckpoint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAssignedCheckpoint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.checkpoint = action.payload;
      })
      .addCase(getAssignedCheckpoint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCheckpointTrucks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCheckpointTrucks.fulfilled, (state, action) => {
        state.isLoading = false;
        // Ensure trucks is always an array
        state.trucks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCheckpointTrucks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(logTruckAction.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(logTruckAction.fulfilled, (state) => {
        state.isActionLoading = false;
        state.isSuccess = true;
      })
      .addCase(logTruckAction.rejected, (state, action) => {
        state.isActionLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTruck.pending, (state) => {
        state.isActionLoading = true;
      })
      .addCase(createTruck.fulfilled, (state) => {
        state.isActionLoading = false;
        state.isSuccess = true;
      })
      .addCase(createTruck.rejected, (state, action) => {
        state.isActionLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = operatorSlice.actions;
export default operatorSlice.reducer;
