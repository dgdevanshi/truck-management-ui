// src/utils/apiLogger.js

// Function to log API requests
export const logApiRequest = (method, url, data) => {
  console.group(`🌐 API Request: ${method} ${url}`);
  console.log("Request Data:", data);
  console.groupEnd();
};

// Function to log API responses
export const logApiResponse = (method, url, status, data) => {
  console.group(`✅ API Response: ${method} ${url}`);
  console.log("Status:", status);
  console.log("Response Data:", data);
  console.groupEnd();
};

// Function to log API errors
export const logApiError = (method, url, error) => {
  console.group(`❌ API Error: ${method} ${url}`);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("Response Status:", error.response.status);
    console.error("Response Data:", error.response.data);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("No response received:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error setting up the request:", error.message);
  }
  console.error("Full Error:", error);
  console.groupEnd();
};
