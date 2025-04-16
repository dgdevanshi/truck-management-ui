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
    console.group("🚚 API Call: Get Truck Status");
    console.log(`GET ${API_URL}/trucks/status`);

    const response = await axios.get(`${API_URL}/trucks/status`, {
      headers: getHeaders(),
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.group("❌ API Error: Get Truck Status");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.groupEnd();
    throw error;
  }
};

// Log truck action (check-in/check-out)
const logTruckAction = async (logData) => {
  try {
    console.group("📝 API Call: Log Truck Action");
    console.log(`POST ${API_URL}/operator/log`, logData);

    const response = await axios.post(`${API_URL}/operator/log`, logData, {
      headers: getHeaders(),
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.group("❌ API Error: Log Truck Action");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.groupEnd();
    throw error;
  }
};

const truckService = {
  getTruckStatus,
  logTruckAction,
};

export default truckService;
