import axios from "axios";

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Function to test API connectivity
export const testApiConnection = async () => {
  try {
    console.group("🔌 Testing API Connection");
    console.log(`Testing connection to: ${API_URL}`);

    // Try to access a simple endpoint that doesn't require auth
    const response = await axios.get(`${API_URL}/`);

    console.log("API connection successful:", response.data);
    console.groupEnd();

    return {
      success: true,
      message: "Connected to API successfully",
      data: response.data,
    };
  } catch (error) {
    console.group("🔌 Testing API Connection");
    console.error("API connection failed:", error.message);

    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
    } else if (error.request) {
      console.log("No response received. Request:", error.request);
    } else {
      console.log("Error setting up request:", error.message);
    }

    console.groupEnd();

    return {
      success: false,
      message: `Failed to connect to API: ${error.message}`,
      error,
    };
  }
};

// Function to check API endpoints
export const checkApiEndpoints = async () => {
  const endpoints = [
    { method: "GET", url: "/" },
    { method: "OPTIONS", url: "/login" },
  ];

  const results = {};

  console.group("🔍 Checking API Endpoints");

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.method} ${API_URL}${endpoint.url}`);

      const response = await axios({
        method: endpoint.method,
        url: `${API_URL}${endpoint.url}`,
      });

      results[endpoint.url] = {
        success: true,
        status: response.status,
        data: response.data,
      };

      console.log(
        `✅ Success: ${endpoint.method} ${endpoint.url} - Status: ${response.status}`
      );
    } catch (error) {
      results[endpoint.url] = {
        success: false,
        status: error.response?.status,
        error: error.message,
      };

      console.log(
        `❌ Failed: ${endpoint.method} ${endpoint.url} - ${error.message}`
      );
    }
  }

  console.log("API endpoints check results:", results);
  console.groupEnd();

  return results;
};

// Function to test authentication with current token
export const testAuthentication = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No authentication token found");
    return {
      success: false,
      message: "No authentication token found",
    };
  }

  try {
    console.group("🔐 Testing Authentication");
    console.log("Testing authentication with current token");

    // Try to access a protected endpoint
    const response = await axios.get(`${API_URL}/trucks/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Authentication successful:", response.status);
    console.groupEnd();

    return {
      success: true,
      message: "Authentication successful",
      data: response.data,
    };
  } catch (error) {
    console.error("Authentication test failed:", error.message);

    if (error.response) {
      console.log("Response status:", error.response.status);
      console.log("Response data:", error.response.data);
    }

    console.groupEnd();

    return {
      success: false,
      message: `Authentication failed: ${error.message}`,
      error,
    };
  }
};
