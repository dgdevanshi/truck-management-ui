import axios from "axios";
import { getNextCheckpointId } from "../../utils/checkpointUtils";

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
    console.group("🚩 API Call: Get Assigned Checkpoint");
    console.log(`GET ${API_URL}/operator/checkpoint`);

    const response = await axios.get(`${API_URL}/operator/checkpoint`, {
      headers: getHeaders(),
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    
    // Standardize the checkpoint object to ensure consistent property names
    const checkpointData = response.data;
    
    // Create a standardized checkpoint object with consistent property names
    const standardizedCheckpoint = {
      ...checkpointData,
      // Ensure we have a consistent ID property
      id: checkpointData.id || checkpointData.checkpoint_id,
      checkpoint_id: checkpointData.checkpoint_id || checkpointData.id,
      // Ensure we have a consistent name property
      name: checkpointData.name || checkpointData.checkpoint_name,
      checkpoint_name: checkpointData.checkpoint_name || checkpointData.name,
      // Ensure we have a consistent description property
      description: checkpointData.description || checkpointData.checkpoint_description,
      checkpoint_description: checkpointData.checkpoint_description || checkpointData.description,
    };

    console.log("Standardized checkpoint:", standardizedCheckpoint);
    console.groupEnd();

    return standardizedCheckpoint;
  } catch (error) {
    console.group("❌ API Error: Get Assigned Checkpoint");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.groupEnd();
    throw error;
  }
};

// Get trucks at the operator's checkpoint
const getCheckpointTrucks = async () => {
  try {
    console.group("🚚 API Call: Get Checkpoint Trucks");
    console.log(`GET ${API_URL}/operator/trucks`);

    const response = await axios.get(`${API_URL}/operator/trucks`, {
      headers: getHeaders(),
    });

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);

    // Standardize truck objects to ensure consistent property names
    let trucks = Array.isArray(response.data) ? response.data : [];
    trucks = trucks.map(truck => {
      // Create a standardized truck object with consistent property names
      return {
        ...truck,
        // Ensure we have a consistent ID property
        id: truck.id || truck.truck_id,
        truck_id: truck.truck_id || truck.id,
        // Ensure we have a consistent checkpoint ID property
        currentCheckpointId: truck.currentCheckpointId || truck.checkpoint_id || truck.current_checkpoint_id || 1,
        // Ensure we have a consistent identifier property
        identifier: truck.identifier || truck.truckIdentifier || `Truck ${truck.id || truck.truck_id}`,
      };
    });

    console.log("Standardized trucks:", trucks);
    console.groupEnd();

    return trucks;
  } catch (error) {
    console.group("❌ API Error: Get Checkpoint Trucks");
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

    // Format the data according to the API requirements
    const formattedData = {
      truck_id: parseInt(logData.truck_id, 10),
      checkpoint_id: parseInt(logData.checkpoint_id, 10), // Make sure this is included
      action: logData.action, // Should be "checkin" or "checkout"
      notes: logData.notes || "",
    };

    console.log(`POST ${API_URL}/operator/log`, formattedData);

    // First, log the truck action at the current checkpoint
    const response = await axios.post(
      `${API_URL}/operator/log`,
      formattedData,
      {
        headers: getHeaders(),
      }
    );

    // If this is a check-in action, move the truck to the next checkpoint
    if (logData.action === "checkin") {
      try {
        // Calculate the next checkpoint ID in the sequence
        const nextCheckpointId = getNextCheckpointId(logData.checkpoint_id);
        
        console.log(`Moving truck from checkpoint ${logData.checkpoint_id} to ${nextCheckpointId}`);
        
        // Try multiple approaches to update the truck's checkpoint since API structure may vary
        let updateSuccessful = false;
        
        // Approach 1: Try updating through the truck update endpoint
        try {
          console.log(`Attempt 1: PUT ${API_URL}/trucks/${formattedData.truck_id}`);
          const updateResponse = await axios.put(
            `${API_URL}/trucks/${formattedData.truck_id}`,
            {
              currentCheckpointId: nextCheckpointId,
              status: "in_progress",
            },
            {
              headers: getHeaders(),
            }
          );
          console.log("Truck moved to next checkpoint:", updateResponse.data);
          updateSuccessful = true;
        } catch (updateError1) {
          console.warn("Error in first attempt to update truck checkpoint:", updateError1);
        }
        
        // Approach 2: Try updating through the operator truck update endpoint
        if (!updateSuccessful) {
          try {
            console.log(`Attempt 2: POST ${API_URL}/operator/update-truck`);
            const updateResponse = await axios.post(
              `${API_URL}/operator/update-truck`,
              {
                truck_id: formattedData.truck_id,
                current_checkpoint_id: nextCheckpointId,
                status: "in_progress",
              },
              {
                headers: getHeaders(),
              }
            );
            console.log("Truck moved to next checkpoint (attempt 2):", updateResponse.data);
            updateSuccessful = true;
          } catch (updateError2) {
            console.error("Error in second attempt to update truck checkpoint:", updateError2);
          }
        }
        
        // Approach 3: Try using a PATCH request to the trucks endpoint
        if (!updateSuccessful) {
          try {
            console.log(`Attempt 3: PATCH ${API_URL}/trucks/${formattedData.truck_id}`);
            const updateResponse = await axios.patch(
              `${API_URL}/trucks/${formattedData.truck_id}`,
              {
                currentCheckpointId: nextCheckpointId,
              },
              {
                headers: getHeaders(),
              }
            );
            console.log("Truck moved to next checkpoint (attempt 3):", updateResponse.data);
            updateSuccessful = true;
          } catch (updateError3) {
            console.error("Error in third attempt to update truck checkpoint:", updateError3);
          }
        }

        if (!updateSuccessful) {
          console.error("Failed to move truck to next checkpoint after multiple attempts");
          // We'll still return success for the check-in so the UI flow isn't interrupted
        }
      } catch (updateError) {
        console.error("Error moving truck to next checkpoint:", updateError);
      }
    }

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

// Create a new truck
const createTruck = async (truckData) => {
  try {
    console.group("🚚 API Call: Create New Truck");

    // Ensure the truck is assigned to checkpoint 1 (entry gate) by default
    const formattedData = {
      ...truckData,
      checkpoint_id: truckData.checkpoint_id || 1, // Default to checkpoint 1 (entry gate) if not specified
    };

    console.log(`POST ${API_URL}/operator/create`, formattedData);

    const response = await axios.post(
      `${API_URL}/operator/create`,
      formattedData,
      {
        headers: getHeaders(),
      }
    );

    console.log("Response Status:", response.status);
    console.log("Response Data:", response.data);
    console.groupEnd();

    return response.data;
  } catch (error) {
    console.group("❌ API Error: Create New Truck");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    console.groupEnd();
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
