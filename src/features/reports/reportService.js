import axios from "axios";

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

// Get truck turnaround time report
const getTurnaroundReport = async (startDate, endDate) => {
  try {
    ("📊 API Call: Get Turnaround Report");

    // Format dates as ISO strings if they aren't already
    const start =
      startDate instanceof Date ? startDate.toISOString() : startDate;
    const end = endDate instanceof Date ? endDate.toISOString() : endDate;

    `GET ${API_URL}/reports/turnaround?start=${start}&end=${end}`;

    const response = await axios.get(`${API_URL}/reports/turnaround`, {
      headers: getHeaders(),
      params: {
        start,
        end,
      },
    });

    "Response Status:", response.status;
    "Response Data:", response.data;
    return response.data;
  } catch (error) {
    ("❌ API Error: Get Turnaround Report");
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", error.response?.data);
    console.error("Error Message:", error.message);
    console.error("Full Error:", error);
    throw error;
  }
};

// Calculate summary statistics from turnaround report data
const calculateReportStats = (reportData) => {
  if (!reportData || !Array.isArray(reportData) || reportData.length === 0) {
    return {
      totalTrucks: 0,
      avgProcessingTime: "0m",
      completedTrucks: 0,
      waitingTime: "0m",
      checkpoints: [],
    };
  }

  // Calculate total trucks and completed trucks
  const totalTrucks = reportData.length;
  const completedTrucks = reportData.filter(
    (truck) => truck.end_time !== null && truck.turnaround_time !== null
  ).length;

  // Calculate average processing time
  const completedTrucksData = reportData.filter(
    (truck) => truck.turnaround_time !== null
  );
  let avgMinutes = 0;
  if (completedTrucksData.length > 0) {
    const totalMinutes = completedTrucksData.reduce(
      (sum, truck) => sum + truck.turnaround_time,
      0
    );
    avgMinutes = Math.round(totalMinutes / completedTrucksData.length);
  }

  // Format average processing time
  const avgProcessingTime = formatTime(avgMinutes);

  // Calculate average waiting time (if available in the data)
  // This is an estimate based on trucks that haven't completed yet
  const currentTime = new Date();
  const waitingTrucks = reportData.filter((truck) => truck.end_time === null);
  let avgWaitingMinutes = 0;
  if (waitingTrucks.length > 0) {
    const waitingTimes = waitingTrucks.map((truck) => {
      const startTime = new Date(truck.start_time);
      const diffMs = currentTime - startTime;
      return Math.floor(diffMs / 60000); // convert ms to minutes
    });
    const totalWaitingMinutes = waitingTimes.reduce(
      (sum, time) => sum + time,
      0
    );
    avgWaitingMinutes = Math.round(totalWaitingMinutes / waitingTrucks.length);
  }

  // Format waiting time
  const waitingTime = formatTime(avgWaitingMinutes);

  // Group by checkpoint (if checkpoint data is available)
  const checkpointMap = {};
  reportData.forEach((truck) => {
    const checkpoint = truck.checkpoint || "Unknown";
    if (!checkpointMap[checkpoint]) {
      checkpointMap[checkpoint] = {
        name: checkpoint,
        count: 0,
        totalTime: 0,
        completedCount: 0,
      };
    }

    checkpointMap[checkpoint].count++;

    if (truck.turnaround_time !== null) {
      checkpointMap[checkpoint].totalTime += truck.turnaround_time;
      checkpointMap[checkpoint].completedCount++;
    }
  });

  // Calculate average time per checkpoint
  const checkpoints = Object.values(checkpointMap).map((cp) => {
    const avgTime =
      cp.completedCount > 0
        ? formatTime(Math.round(cp.totalTime / cp.completedCount))
        : "N/A";

    return {
      name: cp.name,
      count: cp.count,
      avgTime,
    };
  });

  return {
    totalTrucks,
    avgProcessingTime,
    completedTrucks,
    waitingTime,
    checkpoints,
  };
};

// Helper function to format minutes into hours and minutes
const formatTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

const reportService = {
  getTurnaroundReport,
  calculateReportStats,
};

export default reportService;
