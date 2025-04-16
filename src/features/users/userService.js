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
    ("👥 API Call: Get Operators");
    `GET ${API_URL}/users/operators`;

    const response = await axios.get(`${API_URL}/users/operators`, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get Operators");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    ("✏️ API Call: Update User");
    `PATCH ${API_URL}/users/${userId}`, userData;

    const response = await axios.patch(`${API_URL}/users/${userId}`, userData, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Update User");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

const userService = {
  getOperators,
  updateUser,
};

export default userService;
