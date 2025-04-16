"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTruckStatus } from "../../features/trucks/truckSlice";
import {
  getAllCheckpoints,
  groupTrucksByCheckpoint,
} from "../../utils/checkpointUtils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { trucks, isLoading } = useSelector((state) => state.trucks);
  const [checkpointStats, setCheckpointStats] = useState([]);
  const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);

  useEffect(() => {
    dispatch(getTruckStatus());

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      dispatch(getTruckStatus());
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // Process truck data when it changes
  useEffect(() => {
    if (Array.isArray(trucks)) {
      const groupedTrucks = groupTrucksByCheckpoint(trucks);
      setCheckpointStats(groupedTrucks);
    }
  }, [trucks]);

  // Ensure trucks is always an array before filtering
  const trucksArray = Array.isArray(trucks) ? trucks : [];

  // Count trucks by status (for backward compatibility)
  const truckCounts = {
    total: trucksArray.length,
    in_progress: trucksArray.filter((truck) => truck.status === "in_progress")
      .length,
    completed: trucksArray.filter((truck) => truck.status === "completed")
      .length,
    waiting: trucksArray.filter((truck) => truck.status === "waiting").length,
  };

  // Get trucks for the selected checkpoint
  const selectedCheckpointTrucks = selectedCheckpoint
    ? checkpointStats.find((cp) => cp.id === selectedCheckpoint)?.trucks || []
    : trucksArray.slice(0, 5); // Show first 5 trucks if no checkpoint is selected

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Checkpoint Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {checkpointStats.map((checkpoint) => (
          <div
            key={checkpoint.id}
            className={`rounded-lg p-4 md:p-6 shadow-sm cursor-pointer transition-all ${
              selectedCheckpoint === checkpoint.id
                ? "bg-teal-50 border-2 border-teal-500"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() =>
              setSelectedCheckpoint(
                checkpoint.id === selectedCheckpoint ? null : checkpoint.id
              )
            }
          >
            <div className="flex items-center">
              <div
                className={`mr-4 rounded-full p-3 ${
                  checkpoint.count > 0
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <i className="ri-truck-line text-xl"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {checkpoint.name}
                </p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {isLoading ? "..." : checkpoint.count}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Truck Flow Visualization */}
      {/* <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Truck Flow</h2>
        <div className="overflow-x-auto">
          <div className="flex min-w-max items-center justify-between p-2">
            {getAllCheckpoints().map((checkpoint, index) => {
              const count =
                checkpointStats.find((cp) => cp.id === checkpoint.id)?.count ||
                0;
              return (
                <div
                  key={checkpoint.id}
                  className="flex flex-col items-center mx-2"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      count > 0
                        ? "bg-teal-100 text-teal-800"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <span className="text-lg font-bold">{count}</span>
                  </div>
                  <p className="mt-2 text-xs text-center">{checkpoint.name}</p>
                  {index < getAllCheckpoints().length - 1 && (
                    <div className="absolute transform translate-x-12">
                      <i className="ri-arrow-right-line text-gray-400"></i>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

      {/* Truck List */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          {selectedCheckpoint
            ? `Trucks at ${
                checkpointStats.find((cp) => cp.id === selectedCheckpoint)?.name
              }`
            : "Recent Activity"}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          </div>
        ) : selectedCheckpointTrucks.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="border-b text-left text-sm font-medium text-gray-500">
                    <th className="pb-3 pr-6">Truck ID</th>
                    <th className="pb-3 pr-6">Checkpoint</th>
                    <th className="pb-3 pr-6">Status</th>
                    <th className="pb-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCheckpointTrucks.map((truck) => (
                    <tr
                      key={truck.truck_id || truck.id}
                      className="border-b text-sm"
                    >
                      <td className="py-3 pr-6 font-medium">
                        {truck.identifier}
                      </td>
                      <td className="py-3 pr-6">
                        {truck.checkpoint ||
                          (truck.checkpoint_id &&
                            `Checkpoint ${truck.checkpoint_id}`) ||
                          "Unknown"}
                      </td>
                      <td className="py-3 pr-6">
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
                      <td className="py-3">{truck.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500">
            {selectedCheckpoint
              ? "No trucks at this checkpoint"
              : "No trucks in the system"}
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
