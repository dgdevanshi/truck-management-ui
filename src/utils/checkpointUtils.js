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
  8: "Entry Gate",
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

  // Initialize all checkpoints with 0 trucks
  Object.keys(CHECKPOINTS).forEach((id) => {
    checkpointCounts[id] = {
      id: Number.parseInt(id, 10),
      name: CHECKPOINTS[id],
      count: 0,
      trucks: [],
    };
  });

  // Count trucks at each checkpoint
  if (Array.isArray(trucks)) {
    trucks.forEach((truck) => {
      // Get the checkpoint ID from the truck data
      const checkpointId =
        truck.checkpoint_id ||
        truck.currentCheckpointId ||
        truck.current_checkpoint_id ||
        1; // Default to entry gate if not specified

      // Convert to string for object key
      const checkpointKey = checkpointId.toString();

      // If this checkpoint exists in our mapping, increment its count
      if (checkpointCounts[checkpointKey]) {
        checkpointCounts[checkpointKey].count++;
        checkpointCounts[checkpointKey].trucks.push(truck);
      }
    });
  }

  // Convert to array for easier rendering
  return Object.values(checkpointCounts);
};
