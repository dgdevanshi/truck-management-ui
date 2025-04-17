import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper function to get headers including auth and ngrok skip
const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Ngrok-Skip-Browser-Warning": "true",
  };
};

// Get assigned checkpoint for the logged-in operator
const getAssignedCheckpoint = async () => {
  try {
    ("🚩 API Call: Get Assigned Checkpoint");
    `GET ${API_URL}/operator/checkpoint`;

    const response = await axios.get(`${API_URL}/operator/checkpoint`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get Assigned Checkpoint");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Get trucks at the operator's checkpoint
const getCheckpointTrucks = async () => {
  try {
    ("🚚 API Call: Get Checkpoint Trucks");
    `GET ${API_URL}/operator/trucks`;

    const response = await axios.get(`${API_URL}/operator/trucks`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    // Get the operator's assigned checkpoint
    const checkpointResponse = await getAssignedCheckpoint();
    const operatorCheckpointId = checkpointResponse.checkpoint_id;

    // Filter trucks to only show those at the operator's checkpoint
    let trucks = Array.isArray(response.data) ? response.data : [];
    trucks = trucks.filter(
      (truck) => truck.checkpoint_id === operatorCheckpointId
    );

    // IMPORTANT: We no longer modify the checkpoint_id here
    // Let the UI handle the display logic of current/next checkpoints

    `Filtered trucks for checkpoint ${operatorCheckpointId}:`, trucks;
    return trucks;
  } catch (error) {
    ("❌ API Error: Get Checkpoint Trucks");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);

    throw error;
  }
};

// Log truck action (check-in/check-out)
const logTruckAction = async (logData) => {
  try {
    ("📝 API Call: Log Truck Action");

    // Format the data according to the API requirements
    const formattedData = {
      truck_id: logData.truck_id,
      checkpoint_id: logData.checkpoint_id,
      action: logData.action, // Should be "checkin" or "checkout"
      notes: logData.notes || "",
    };

    `POST ${API_URL}/operator/log`, formattedData;
    "Raw request data:", JSON.stringify(formattedData);

    const response = await axios.post(
      `${API_URL}/operator/log`,
      formattedData,
      {
        headers: getHeaders(),
      }
    );

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Log Truck Action");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Create a new truck
const createTruck = async (truckData) => {
  try {
    ("🚚 API Call: Create New Truck");

    // Format the data according to the API requirements
    const formattedData = {
      truckIdentifier: truckData.truckIdentifier,
      status: truckData.status,
      notes: truckData.notes || "",
      checkpoint_id: truckData.checkpoint_id || 1, // Default to checkpoint 1 (entry gate) if not specified
    };

    `POST ${API_URL}/operator/create`, formattedData;

    const response = await axios.post(
      `${API_URL}/operator/create`,
      formattedData,
      {
        headers: getHeaders(),
      }
    );

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Create New Truck");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Make sure all functions are properly exported
const operatorService = {
  getAssignedCheckpoint,
  getCheckpointTrucks,
  logTruckAction,
  createTruck,
};

export default operatorService;
