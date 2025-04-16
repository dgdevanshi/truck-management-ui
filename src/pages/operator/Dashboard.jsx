"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getAssignedCheckpoint,
  getCheckpointTrucks,
  logTruckAction,
  createTruck,
  reset,
} from "../../features/operator/operatorSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import ResponsiveTable from "../../components/ResponsiveTable";
import {
  getNextCheckpointId,
  getCheckpointName,
} from "../../utils/checkpointUtils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    checkpoint,
    trucks,
    isLoading,
    isActionLoading,
    isSuccess,
    isError,
    message,
  } = useSelector((state) => state.operator);
  const { user } = useSelector((state) => state.auth);

  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [showCheckOutForm, setShowCheckOutForm] = useState(false);
  const [showCreateTruckForm, setShowCreateTruckForm] = useState(false);
  const [formData, setFormData] = useState({
    truckId: "",
    notes: "",
  });
  const [createTruckData, setCreateTruckData] = useState({
    truckIdentifier: "",
    status: "in_progress",
    notes: "",
    checkpoint_id: 1, // Default to checkpoint 1 (entry gate)
  });
  const [hasNoCheckpoint, setHasNoCheckpoint] = useState(false);

  useEffect(() => {
    // Function to load trucks data
    const loadTrucks = async () => {
      if (!hasNoCheckpoint) {
        try {
          await dispatch(getCheckpointTrucks()).unwrap();
        } catch (error) {
          console.error("Error fetching checkpoint trucks:", error);
        }
      }
    };

    // Get assigned checkpoint and trucks
    dispatch(getAssignedCheckpoint())
      .unwrap()
      .then((checkpointData) => {
        console.log("Successfully got assigned checkpoint:", checkpointData);

        // Check if the checkpoint has a valid ID using either property name
        const checkpointId =
          checkpointData?.checkpoint_id || checkpointData?.id;

        if (!checkpointId) {
          console.warn(
            "Checkpoint data received but no valid checkpoint ID found:",
            checkpointData
          );
          setHasNoCheckpoint(true);
        } else {
          setHasNoCheckpoint(false);
          // Load trucks immediately after getting checkpoint
          loadTrucks();
        }
      })
      .catch((error) => {
        console.error("Error in getAssignedCheckpoint:", error);
        if (
          error === "No checkpoint assigned" ||
          (typeof error === "string" &&
            error.includes("No checkpoint assigned"))
        ) {
          setHasNoCheckpoint(true);
        } else {
          toast.error("Error: " + error);
        }
      });

    // Set up polling for real-time updates only if we have a checkpoint
    const interval = setInterval(() => {
      loadTrucks();
    }, 15000); // Poll every 15 seconds

    return () => {
      clearInterval(interval);
      dispatch(reset());
    };
  }, [dispatch, hasNoCheckpoint]);

  // Show success/error messages as toasts
  useEffect(() => {
    if (isSuccess) {
      toast.success("Action completed successfully!");
      dispatch(reset());
    }

    if (isError) {
      if (
        message === "No checkpoint assigned" ||
        (typeof message === "string" &&
          message.includes("No checkpoint assigned"))
      ) {
        setHasNoCheckpoint(true);
      } else {
        toast.error(message || "An error occurred");
      }
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateTruckChange = (e) => {
    const { name, value } = e.target;
    setCreateTruckData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update the handleCheckIn function to handle the case when a truck doesn't have a checkpoint assigned
  const handleCheckIn = (e) => {
    e.preventDefault();

    // Check if checkpoint exists and has a valid ID
    if (!checkpoint) {
      toast.error("No checkpoint assigned to operator. Cannot check in truck.");
      return;
    }

    // Access checkpoint_id correctly from the checkpoint object
    const checkpointId = checkpoint.checkpoint_id || checkpoint.id;

    if (!checkpointId) {
      toast.error("No checkpoint ID found. Cannot check in truck.");
      return;
    }

    // Make sure truckId is not empty
    if (!formData.truckId) {
      toast.error("Please enter a truck ID");
      return;
    }

    // Format the data according to the API requirements
    const actionData = {
      truck_id: parseInt(formData.truckId, 10) || formData.truckId, // Support both numeric and string IDs
      checkpoint_id: parseInt(checkpointId, 10), // Ensure numeric ID and use the correct property
      action: "checkin", // Backend expects "checkin" not "check_in"
      notes: formData.notes || "",
    };

    console.log("Check-in data:", actionData);

    dispatch(logTruckAction(actionData))
      .unwrap()
      .then(() => {
        setFormData({ truckId: "", notes: "" });
        setShowCheckInForm(false);
        toast.success(
          `Truck checked in successfully at ${getCheckpointName(checkpointId)}`
        );
      })
      .catch((error) => {
        toast.error(`Failed to check in truck: ${error}`);
      });
  };

  // Update the handleCheckOut function to explicitly include checkpoint_id
  const handleCheckOut = (e) => {
    e.preventDefault();

    // Check if checkpoint exists and has a valid ID
    if (!checkpoint) {
      toast.error("No checkpoint assigned. Cannot check out truck.");
      return;
    }

    // Access checkpoint_id correctly from the checkpoint object
    const checkpointId = checkpoint.checkpoint_id || checkpoint.id;

    if (!checkpointId) {
      toast.error("No checkpoint ID found. Cannot check out truck.");
      return;
    }

    // Make sure truckId is not empty
    if (!formData.truckId) {
      toast.error("Please select a truck");
      return;
    }

    const actionData = {
      truck_id: parseInt(formData.truckId, 10) || formData.truckId, // Support both numeric and string IDs
      checkpoint_id: parseInt(checkpointId, 10), // Ensure numeric ID and use the correct property
      action: "checkout", // Backend expects "checkout" not "check_out"
      notes: formData.notes || "",
    };

    console.log("Check-out data:", actionData);

    dispatch(logTruckAction(actionData))
      .unwrap()
      .then(() => {
        setFormData({ truckId: "", notes: "" });
        setShowCheckOutForm(false);
        toast.success(
          `Truck checked out successfully from ${getCheckpointName(
            checkpointId
          )}`
        );
      })
      .catch((error) => {
        toast.error(`Failed to check out truck: ${error}`);
      });
  };

  const handleCreateTruck = (e) => {
    e.preventDefault();

    // Format data for the API
    const truckData = {
      ...createTruckData,
      // Always start new trucks at checkpoint 1 (entry gate)
      checkpoint_id: 1,
    };

    console.log("Creating truck with data:", truckData);

    dispatch(createTruck(truckData))
      .unwrap()
      .then(() => {
        setCreateTruckData({
          truckIdentifier: "",
          status: "in_progress",
          notes: "",
          checkpoint_id: 1, // Maintain the default checkpoint when resetting
        });
        setShowCreateTruckForm(false);
        toast.success(`New truck created at ${getCheckpointName(1)}`);

        // Refresh truck list
        dispatch(getCheckpointTrucks());
      })
      .catch((error) => {
        toast.error(`Failed to create truck: ${error}`);
      });
  };

  // Ensure trucks is always an array
  const trucksArray = Array.isArray(trucks) ? trucks : [];

  // Format date for display
  const formatTime = (dateString) => {
    if (!dateString) return "N/A";

    try {
      return new Date(dateString).toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  // Update the tableHeaders to show the current checkpoint information
  const tableHeaders = [
    { key: "identifier", label: "Truck ID" },
    {
      key: "status",
      label: "Status",
      render: (truck) => (
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
            truck.status === "completed"
              ? "bg-green-100 text-green-800"
              : truck.status === "in_progress"
              ? "bg-teal-100 text-teal-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {truck.status?.replace("_", " ") || "waiting"}
        </span>
      ),
    },
    {
      key: "current_checkpoint",
      label: "Current Checkpoint",
      render: (truck) => {
        // Handle different property names from the API
        const checkpointId =
          truck.checkpoint_id ||
          truck.currentCheckpointId ||
          truck.current_checkpoint_id;
        return (
          getCheckpointName(checkpointId) ||
          truck.current_checkpoint_name ||
          truck.checkpoint ||
          "-"
        );
      },
    },
    {
      key: "next_checkpoint",
      label: "Next Checkpoint",
      render: (truck) => {
        // Handle different property names from the API
        const currentCheckpointId =
          truck.checkpoint_id ||
          truck.currentCheckpointId ||
          truck.current_checkpoint_id;
        const nextCheckpointId = getNextCheckpointId(currentCheckpointId);
        return (
          getCheckpointName(nextCheckpointId) ||
          truck.next_checkpoint_name ||
          "-"
        );
      },
    },
    {
      key: "notes",
      label: "Notes",
      render: (truck) => truck.notes || "-",
    },
  ];

  // If operator has no checkpoint assigned
  if (hasNoCheckpoint && !isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Operator Dashboard
        </h1>

        <div className="rounded-lg bg-white p-8 shadow-sm text-center">
          <div className="mb-4 text-teal-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">No Checkpoint Assigned</h2>
          <p className="text-gray-600 mb-6">
            You don't have any checkpoint assigned yet. Please contact your
            administrator to get assigned to a checkpoint.
          </p>
          <p className="text-sm text-gray-500">
            Once you're assigned to a checkpoint, you'll be able to manage
            trucks at that location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Operator Dashboard
      </h1>

      {/* Checkpoint Info */}
      <div className="mb-6 rounded-lg bg-white p-4 md:p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 break-words">
          {isLoading ? (
            <span className="inline-block h-6 w-32 animate-pulse rounded bg-gray-200"></span>
          ) : (
            <>
              Checkpoint:{" "}
              {checkpoint?.name ||
                checkpoint?.checkpoint_name ||
                getCheckpointName(checkpoint?.checkpoint_id) ||
                "Loading..."}
              {(checkpoint?.description ||
                checkpoint?.checkpoint_description) && (
                <span className="ml-2 text-sm text-gray-500">
                  (
                  {checkpoint?.description ||
                    checkpoint?.checkpoint_description}
                  )
                </span>
              )}
            </>
          )}
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap gap-4">
          <button
            onClick={() => setShowCreateTruckForm(true)}
            disabled={isActionLoading}
            className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300 w-full sm:w-auto"
          >
            <i className="ri-truck-line mr-2"></i>
            Create New Truck
          </button>
          <button
            onClick={() => setShowCheckInForm(true)}
            disabled={isActionLoading}
            className="flex items-center justify-center rounded-md bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:bg-teal-300 w-full sm:w-auto"
          >
            <i className="ri-login-box-line mr-2"></i>
            Check-In Truck
          </button>
          <button
            onClick={() => setShowCheckOutForm(true)}
            disabled={isActionLoading || trucksArray.length === 0}
            className="flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300 w-full sm:w-auto"
          >
            <i className="ri-logout-box-line mr-2"></i>
            Check-Out Truck
          </button>
        </div>
      </div>

      {/* Current Trucks */}
      <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Current Trucks
        </h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <ResponsiveTable
            headers={tableHeaders}
            data={trucksArray}
            renderRow={(truck, index, viewType) => {
              if (viewType === "table") {
                return (
                  <tr
                    key={truck.truck_id || truck.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {truck.identifier}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          truck.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : truck.status === "in_progress"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {truck.status?.replace("_", " ") || "waiting"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        // Handle different property names from the API
                        const checkpointId =
                          truck.checkpoint_id ||
                          truck.currentCheckpointId ||
                          truck.current_checkpoint_id;
                        return (
                          getCheckpointName(checkpointId) ||
                          truck.current_checkpoint_name ||
                          truck.checkpoint ||
                          "-"
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        // Handle different property names from the API
                        const currentCheckpointId =
                          truck.checkpoint_id ||
                          truck.currentCheckpointId ||
                          truck.current_checkpoint_id;
                        const nextCheckpointId =
                          getNextCheckpointId(currentCheckpointId);
                        return (
                          getCheckpointName(nextCheckpointId) ||
                          truck.next_checkpoint_name ||
                          "-"
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {truck.notes || "-"}
                    </td>
                  </tr>
                );
              }
            }}
            emptyMessage="No trucks at this checkpoint"
          />
        )}
      </div>

      {/* Create Truck Form Modal */}
      {showCreateTruckForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Create New Truck
            </h2>
            <form onSubmit={handleCreateTruck}>
              <div className="mb-4">
                <label
                  htmlFor="truckIdentifier"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Truck ID
                </label>
                <input
                  type="text"
                  id="truckIdentifier"
                  name="truckIdentifier"
                  value={createTruckData.truckIdentifier}
                  onChange={handleCreateTruckChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter truck ID (e.g., HR55AB1234)"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={createTruckData.status}
                  onChange={handleCreateTruckChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="waiting">Waiting</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="createNotes"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="createNotes"
                  name="notes"
                  value={createTruckData.notes}
                  onChange={handleCreateTruckChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Add any notes about this truck"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateTruckForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300 w-full sm:w-auto"
                >
                  {isActionLoading ? "Creating..." : "Create Truck"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-In Form Modal */}
      {showCheckInForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Check-In Truck
            </h2>
            <form onSubmit={handleCheckIn}>
              <div className="mb-4">
                <label
                  htmlFor="truckId"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Truck ID
                </label>
                <input
                  type="text"
                  id="truckId"
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Enter truck ID (e.g., PB08CP3901)"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Add any notes about this truck"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckInForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-teal-300 w-full sm:w-auto"
                >
                  {isActionLoading ? "Processing..." : "Check-In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-Out Form Modal */}
      {showCheckOutForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-4 md:p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Check-Out Truck
            </h2>
            <form onSubmit={handleCheckOut}>
              <div className="mb-4">
                <label
                  htmlFor="truckId"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Select Truck
                </label>
                <select
                  id="truckId"
                  name="truckId"
                  value={formData.truckId}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  required
                >
                  <option value="">Select a truck</option>
                  {trucksArray.map((truck) => (
                    <option
                      key={truck.truck_id || truck.id}
                      value={truck.truck_id || truck.id}
                    >
                      {truck.identifier}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="notes"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  placeholder="Add any notes about this truck"
                  rows="3"
                ></textarea>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCheckOutForm(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full sm:w-auto mb-2 sm:mb-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isActionLoading}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300 w-full sm:w-auto"
                >
                  {isActionLoading ? "Processing..." : "Check-Out"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
