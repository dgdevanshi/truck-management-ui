"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTruckStatus } from "../../features/trucks/truckSlice";

const TruckMonitoring = () => {
  const dispatch = useDispatch();
  const { trucks, isLoading } = useSelector((state) => state.trucks);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getTruckStatus());
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      dispatch(getTruckStatus());
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch]);

  // Ensure trucks is always an array
  const trucksArray = Array.isArray(trucks) ? trucks : [];

  // Filter trucks based on status and search term
  const filteredTrucks = trucksArray.filter((truck) => {
    const matchesFilter = filter === "all" || truck.status === filter;
    const matchesSearch = truck.identifier
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Mock data for UI demonstration if no real data is available
  const mockTrucks = [
    // {
    //   truck_id: 101,
    //   identifier: "HR55AB1234",
    //   checkpoint: "Dock 2",
    //   status: "in_progress",
    //   notes: "Waiting for inspection",
    // },
    // {
    //   truck_id: 102,
    //   identifier: "DL01CD5678",
    //   checkpoint: "Inspection Bay",
    //   status: "waiting",
    //   notes: null,
    // },
    // {
    //   truck_id: 103,
    //   identifier: "MH02EF9012",
    //   checkpoint: "Loading Area",
    //   status: "completed",
    //   notes: "Loaded and ready for dispatch",
    // },
  ];

  // Use mock data if no real data is available
  const displayTrucks = trucksArray.length > 0 ? filteredTrucks : mockTrucks;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Truck Monitoring
      </h1>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === "all"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("waiting")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === "waiting"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Waiting
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === "in_progress"
                ? "bg-teal-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`rounded-md px-4 py-2 text-sm font-medium ${
              filter === "completed"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by truck ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 sm:w-64"
          />
          <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
        </div>
      </div>

      {/* Truck List */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">
          Truck Status
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
          </div>
        ) : displayTrucks.length > 0 ? (
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
                  {displayTrucks.map((truck) => (
                    <tr key={truck.truck_id} className="border-b text-sm">
                      <td className="py-3 pr-6 font-medium">
                        {truck.identifier}
                      </td>
                      <td className="py-3 pr-6">{truck.checkpoint}</td>
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
                          {truck.status.replace("_", " ")}
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
          <p className="py-4 text-center text-gray-500">No trucks found</p>
        )}
      </div>

      {/* Checkpoint Status Overview */}
      {/* <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Dock Area
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Dock 1</span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Available
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Dock 2</span>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Occupied
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Dock 3</span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Available
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Inspection Area
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Inspection Bay 1</span>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Occupied
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Inspection Bay 2</span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Available
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            Loading Area
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Loading Bay 1</span>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Occupied
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Loading Bay 2</span>
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                Occupied
              </span>
            </div>
            <div className="flex items-center justify-between rounded-md bg-gray-50 p-3">
              <span className="font-medium">Loading Bay 3</span>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                Available
              </span>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TruckMonitoring;
