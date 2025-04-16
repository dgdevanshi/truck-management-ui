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

// Get all operators
const getOperators = async () => {
  try {
    console.group("👥 API Call: Get Operators");
    console.log(`GET ${API_URL}/users/operators`);

    const response = await axios.get(`${API_URL}/users/operators`, {
      headers: getHeaders(),
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.group("❌ API Error: Get Operators");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.groupEnd();
    throw error;
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    console.group("✏️ API Call: Update User");
    console.log(`PATCH ${API_URL}/users/${userId}`, userData);

    const response = await axios.patch(`${API_URL}/users/${userId}`, userData, {
      headers: getHeaders(),
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.group("❌ API Error: Update User");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.groupEnd();
    throw error;
  }
};

const userService = {
  getOperators,
  updateUser,
};

export default userService;
