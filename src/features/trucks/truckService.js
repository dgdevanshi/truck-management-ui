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

// Get truck status
const getTruckStatus = async () => {
  try {
    ("🚚 API Call: Get Truck Status");
    `GET ${API_URL}/trucks/status`;

    const response = await axios.get(`${API_URL}/trucks/status`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get Truck Status");
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
    `POST ${API_URL}/operator/log`, logData;

    const response = await axios.post(`${API_URL}/operator/log`, logData, {
      headers: getHeaders(),
    });

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

const truckService = {
  getTruckStatus,
  logTruckAction,
};

export default truckService;
