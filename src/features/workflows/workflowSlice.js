import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import workflowService from "./workflowService";

// Get all workflows
export const getWorkflows = createAsyncThunk(
  "workflows/getAll",
  async (_, thunkAPI) => {
    try {
      return await workflowService.getWorkflows();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch workflows";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get workflow by ID
export const getWorkflowById = createAsyncThunk(
  "workflows/getById",
  async (workflowId, thunkAPI) => {
    try {
      return await workflowService.getWorkflowById(workflowId);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch workflow";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all checkpoints
export const getCheckpoints = createAsyncThunk(
  "workflows/getCheckpoints",
  async (_, thunkAPI) => {
    try {
      return await workflowService.getCheckpoints();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch checkpoints";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create workflow
export const createWorkflow = createAsyncThunk(
  "workflows/create",
  async (workflowData, thunkAPI) => {
    try {
      return await workflowService.createWorkflow(workflowData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create workflow";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create checkpoint
export const createCheckpoint = createAsyncThunk(
  "workflows/createCheckpoint",
  async (checkpointData, thunkAPI) => {
    try {
      return await workflowService.createCheckpoint(checkpointData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create checkpoint";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update workflow
export const updateWorkflow = createAsyncThunk(
  "workflows/updateWorkflow",
  async ({ workflowId, workflowData }, thunkAPI) => {
    try {
      return await workflowService.updateWorkflow(workflowId, workflowData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update workflow";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update checkpoint
export const updateCheckpoint = createAsyncThunk(
  "workflows/updateCheckpoint",
  async ({ checkpointId, checkpointData }, thunkAPI) => {
    try {
      return await workflowService.updateCheckpoint(
        checkpointId,
        checkpointData
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update checkpoint";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const initialState = {
  workflows: [],
  currentWorkflow: null,
  checkpoints: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const workflowSlice = createSlice({
  name: "workflows",
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
      .addCase(getWorkflows.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkflows.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workflows = action.payload;
      })
      .addCase(getWorkflows.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getWorkflowById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getWorkflowById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentWorkflow = action.payload;
      })
      .addCase(getWorkflowById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getCheckpoints.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCheckpoints.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkpoints = action.payload;
      })
      .addCase(getCheckpoints.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createWorkflow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workflows.push(action.payload);
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createCheckpoint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCheckpoint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkpoints.push(action.payload);
      })
      .addCase(createCheckpoint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateWorkflow.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateWorkflow.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.workflows = state.workflows.map((workflow) =>
          workflow.id === action.payload.id ? action.payload : workflow
        );
      })
      .addCase(updateWorkflow.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCheckpoint.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateCheckpoint.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.checkpoints = state.checkpoints.map((checkpoint) =>
          checkpoint.id === action.payload.id ? action.payload : checkpoint
        );
      })
      .addCase(updateCheckpoint.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = workflowSlice.actions;
export default workflowSlice.reducer;
