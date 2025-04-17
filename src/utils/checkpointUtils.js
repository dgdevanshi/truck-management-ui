/**
 * Utility functions for working with checkpoints in the truck flow system
 */

// Define the checkpoint mapping with IDs and names
const CHECKPOINTS = {
  1: "Entry Gate",
  2: "Front Office",
  3: "Weigh Bridge",
  4: "QC",
  5: "Material Handling",
  6: "Weigh Bridge",
  7: "Front Office",
  8: "Exit Gate",
};

// Get checkpoint name by ID
export const getCheckpointName = (checkpointId) => {
  if (!checkpointId) return "Unknown";
  return CHECKPOINTS[checkpointId] || `Checkpoint ${checkpointId}`;
};

// Get next checkpoint ID in the workflow
export const getNextCheckpointId = (currentCheckpointId) => {
  const id = Number.parseInt(currentCheckpointId, 10);

  // If we're at the last checkpoint (8), there is no next checkpoint
  if (id === 8) return null;

  // Otherwise, return the next checkpoint in sequence
  return id + 1;
};

// Get previous checkpoint ID in the workflow
export const getPreviousCheckpointId = (currentCheckpointId) => {
  const id = Number.parseInt(currentCheckpointId, 10);

  // If we're at the first checkpoint (1), there is no previous checkpoint
  if (id === 1) return null;

  // Otherwise, return the previous checkpoint in sequence
  return id - 1;
};

// Get all checkpoints as an array of objects
export const getAllCheckpoints = () => {
  return Object.entries(CHECKPOINTS).map(([id, name]) => ({
    id: Number.parseInt(id, 10),
    name,
  }));
};

// Group trucks by checkpoint
export const groupTrucksByCheckpoint = (trucks) => {
  const checkpointCounts = {};

  // Initialize all checkpoints
  Object.keys(CHECKPOINTS).forEach((id) => {
    checkpointCounts[id] = {
      id: Number.parseInt(id, 10),
      name: CHECKPOINTS[id],
      count: 0,
      trucks: [],
    };
  });

  // Count trucks at each checkpoint by matching checkpoint name
  if (Array.isArray(trucks)) {
    trucks.forEach((truck) => {
      const checkpointName = truck.checkpoint?.trim().toLowerCase();

      // Find the matching ID from CHECKPOINTS
      const matchingEntry = Object.entries(CHECKPOINTS).find(
        ([, name]) => name.trim().toLowerCase() === checkpointName
      );

      const checkpointId = matchingEntry ? parseInt(matchingEntry[0], 10) : 1; // Default to Entry Gate (ID 1)
      const checkpointKey = checkpointId.toString();

      if (checkpointCounts[checkpointKey]) {
        checkpointCounts[checkpointKey].count++;
        checkpointCounts[checkpointKey].trucks.push(truck);
      }
    });
  }

  return Object.values(checkpointCounts);
};

