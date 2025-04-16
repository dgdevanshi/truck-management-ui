import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper function to get auth header
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Ngrok-Skip-Browser-Warning": "true",
  };
};

// Get all workflows
const getWorkflows = async () => {
  try {
    ("🔄 API Call: Get All Workflows");
    `GET ${API_URL}/workflows/`;

    const response = await axios.get(`${API_URL}/workflows/`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get All Workflows");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Get workflow by ID
const getWorkflowById = async (workflowId) => {
  try {
    ("🔄 API Call: Get Workflow By ID");
    `GET ${API_URL}/workflows/${workflowId}`;

    const response = await axios.get(`${API_URL}/workflows/${workflowId}`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get Workflow By ID");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Get all checkpoints
const getCheckpoints = async () => {
  try {
    ("🚩 API Call: Get All Checkpoints");
    `GET ${API_URL}/checkpoints/`;

    const response = await axios.get(`${API_URL}/workflows/checkpoints`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get All Checkpoints");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Create workflow
const createWorkflow = async (workflowData) => {
  try {
    ("🔄 API Call: Create Workflow");
    `POST ${API_URL}/workflows/`, workflowData;

    const response = await axios.post(`${API_URL}/workflows/`, workflowData, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Create Workflow");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Create checkpoint
const createCheckpoint = async (checkpointData) => {
  try {
    ("🚩 API Call: Create Checkpoint");
    `POST ${API_URL}/workflows/checkpoints`, checkpointData;

    const response = await axios.post(
      `${API_URL}/workflows/checkpoints`,
      checkpointData,
      {
        headers: getHeaders(),
      }
    );

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Create Checkpoint");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Update workflow
const updateWorkflow = async (workflowId, workflowData) => {
  try {
    ("✏️ API Call: Update Workflow");
    `PATCH ${API_URL}/workflows/${workflowId}`, workflowData;

    const response = await axios.patch(
      `${API_URL}/workflows/${workflowId}`,
      workflowData,
      {
        headers: getHeaders(),
      }
    );

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Update Workflow");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Update checkpoint
const updateCheckpoint = async (checkpointId, checkpointData) => {
  try {
    ("✏️ API Call: Update Checkpoint");
    `PATCH ${API_URL}/workflows/checkpoints/${checkpointId}`, checkpointData;

    const response = await axios.patch(
      `${API_URL}/workflows/checkpoints/${checkpointId}`,
      checkpointData,
      {
        headers: getHeaders(),
      }
    );

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Update Checkpoint");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

const workflowService = {
  getWorkflows,
  getWorkflowById,
  getCheckpoints,
  createWorkflow,
  createCheckpoint,
  updateWorkflow,
  updateCheckpoint,
};

export default workflowService;
