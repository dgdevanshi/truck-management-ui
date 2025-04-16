"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTurnaroundReport, reset } from "../../features/reports/reportSlice";

const Reports = () => {
  const dispatch = useDispatch();
  const { reportData, reportStats, isLoading, isError, message } = useSelector(
    (state) => state.reports
  );

  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0], // Today's date in YYYY-MM-DD format
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    // Generate report based on selected report type when component mounts
    generateReport();

    return () => {
      dispatch(reset());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateReport = () => {
    let startDate, endDate;

    // Calculate date range based on report type
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (reportType) {
      case "daily":
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "weekly":
        startDate = new Date(today);
        startDate.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // End of week (Saturday)
        endDate.setHours(23, 59, 59, 999);
        break;
      case "monthly":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Start of month
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); // End of month
        endDate.setHours(23, 59, 59, 999);
        break;
      case "custom":
        startDate = new Date(`${dateRange.startDate}T00:00:00`);
        endDate = new Date(`${dateRange.endDate}T23:59:59`);
        break;
      default:
        startDate = new Date(today);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
    }

    // Format dates for display
    const formattedStartDate = startDate.toISOString();
    const formattedEndDate = endDate.toISOString();

    // Dispatch action to get report data
    dispatch(
      getTurnaroundReport({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      })
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get report title based on report type
  const getReportTitle = () => {
    switch (reportType) {
      case "daily":
        return `Daily Report (${formatDate(dateRange.startDate)})`;
      case "weekly":
        const weekStart = new Date(dateRange.startDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `Weekly Report (${formatDate(weekStart)} - ${formatDate(
          weekEnd
        )})`;
      case "monthly":
        const monthStart = new Date(dateRange.startDate);
        monthStart.setDate(1);
        const monthEnd = new Date(
          monthStart.getFullYear(),
          monthStart.getMonth() + 1,
          0
        );
        return `Monthly Report (${formatDate(monthStart)} - ${formatDate(
          monthEnd
        )})`;
      case "custom":
        return `Custom Report (${formatDate(
          dateRange.startDate
        )} - ${formatDate(dateRange.endDate)})`;
      default:
        return "Truck Turnaround Report";
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Reports</h1>

      {isError && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {message}
        </div>
      )}

      {/* Report Controls */}
      <div className="mb-6 rounded-lg bg-white p-4 md:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label
              htmlFor="reportType"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="daily">Daily Report</option>
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {reportType === "custom" && (
            <>
              <div>
                <label
                  htmlFor="startDate"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </>
          )}

          <button
            onClick={generateReport}
            disabled={isLoading}
            className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-teal-300"
          >
            {isLoading ? "Generating..." : "Generate Report"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        </div>
      ) : (
        <>
          {/* Report Header */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {getReportTitle()}
            </h2>
            <p className="text-sm text-gray-500">
              {reportStats?.totalTrucks || 0} trucks processed during this
              period
            </p>
          </div>

          {/* Report Summary */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                Total Trucks Processed
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {reportStats?.totalTrucks || 0}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                Average Processing Time
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {reportStats?.avgProcessingTime || "0m"}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                Completed Trucks
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {reportStats?.completedTrucks || 0}
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-sm font-medium text-gray-500">
                Average Waiting Time
              </h3>
              <p className="text-3xl font-bold text-gray-800">
                {reportStats?.waitingTime || "0m"}
              </p>
            </div>
          </div>

          {/* Checkpoint Performance */}
          {reportStats?.checkpoints && reportStats.checkpoints.length > 0 && (
            <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Checkpoint Performance
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b text-left text-sm font-medium text-gray-500">
                      <th className="pb-3 pr-6">Checkpoint</th>
                      <th className="pb-3 pr-6">Trucks Processed</th>
                      <th className="pb-3">Average Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportStats.checkpoints.map((checkpoint, index) => (
                      <tr key={index} className="border-b text-sm">
                        <td className="py-3 pr-6 font-medium">
                          {checkpoint.name}
                        </td>
                        <td className="py-3 pr-6">{checkpoint.count}</td>
                        <td className="py-3">{checkpoint.avgTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Truck Details Table */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">
              Truck Details
            </h2>
            {reportData && reportData.length > 0 ? (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr className="border-b text-left text-sm font-medium text-gray-500">
                        <th className="pb-3 pr-6">Truck ID</th>
                        <th className="pb-3 pr-6">Start Time</th>
                        <th className="pb-3 pr-6">End Time</th>
                        <th className="pb-3 pr-6">Turnaround Time</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((truck, index) => (
                        <tr key={index} className="border-b text-sm">
                          <td className="py-3 pr-6 font-medium">
                            {truck.identifier || truck.truck_id}
                          </td>
                          <td className="py-3 pr-6">
                            {truck.start_time
                              ? new Date(truck.start_time).toLocaleString()
                              : "N/A"}
                          </td>
                          <td className="py-3 pr-6">
                            {truck.end_time
                              ? new Date(truck.end_time).toLocaleString()
                              : "In Progress"}
                          </td>
                          <td className="py-3 pr-6">
                            {truck.turnaround_time !== null
                              ? `${truck.turnaround_time} min`
                              : "In Progress"}
                          </td>
                          <td className="py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                truck.end_time
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {truck.end_time ? "Completed" : "In Progress"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">
                No truck data available for this period
              </p>
            )}
          </div>

          {/* Export Options */}
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <i className="ri-file-excel-line mr-2"></i>
              Export to Excel
            </button>
            <button className="flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <i className="ri-file-pdf-line mr-2"></i>
              Export to PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;
