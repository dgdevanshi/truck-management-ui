import axios from "axios";
import { decodeJWT } from "../../utils/jwtDecode";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper function to get headers
const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "Ngrok-Skip-Browser-Warning": "true",
  };
};

// Login user
const login = async (userData) => {
  try {
    ("🔑 API Call: Login");
    `POST ${API_URL}/login`,
      {
        email: userData.email,
        password: "[HIDDEN]",
      };

    // Simple direct axios call
    const response = await axios.post(
      `${API_URL}/login`,
      {
        email: userData.email,
        password: userData.password,
      },
      {
        headers: getHeaders(),
      }
    );

    "Response Status:", response.status;
    "Response Data:", response.data;
    if (response.data && response.data.access_token) {
      // Store the JWT token
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // Decode the JWT token to get user information
      const decodedToken = decodeJWT(token);
      "Decoded token:", decodedToken;

      if (decodedToken) {
        // Use the information from the token
        const user = {
          id: decodedToken.user_id || 1,
          email: decodedToken.sub || userData.email,
          role: decodedToken.role || "operator", // Use the role from the token
          name: decodedToken.name || userData.email.split("@")[0],
        };

        "User object created from token:", user;
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      } else {
        // Fallback if token decoding fails
        const user = {
          id: 1,
          name: userData.email.split("@")[0],
          email: userData.email,
          role: "operator", // Default to operator if we can't determine
        };
        localStorage.setItem("user", JSON.stringify(user));
        return user;
      }
    }

    return null;
  } catch (error) {
    ("❌ API Error: Login");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Register user
const register = async (userData) => {
  try {
    ("📝 API Call: Register");
    `POST ${API_URL}/register`,
      {
        ...userData,
        password: "[HIDDEN]",
      };

    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: getHeaders(),
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Register");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Logout user
const logout = () => {
  ("Logging out user");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const authService = {
  login,
  register,
  logout,
};

export default authService;
