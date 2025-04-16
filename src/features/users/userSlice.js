import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "./userService";

// Get all operators
export const getOperators = createAsyncThunk(
  "users/getOperators",
  async (_, thunkAPI) => {
    try {
      return await userService.getOperators();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch operators";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, userData }, thunkAPI) => {
    try {
      return await userService.updateUser(userId, userData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  operators: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const userSlice = createSlice({
  name: "users",
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
      .addCase(getOperators.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOperators.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Ensure operators is always an array
        state.operators = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getOperators.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Ensure we're working with arrays
        const operatorsArray = Array.isArray(state.operators)
          ? state.operators
          : [];
        state.operators = operatorsArray.map((operator) =>
          operator.id === action.payload.id ? action.payload : operator
        );
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
