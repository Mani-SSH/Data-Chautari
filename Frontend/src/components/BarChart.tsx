import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect } from "react";
import { useData } from "../hooks/useData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const { data, isLoading, error } = useData();

  // Loading and error states
  if (isLoading) return <p className="text-blue-500">Loading chart data...</p>;
  if (error)
    return <p className="text-red-500">Error loading data: {error.message}</p>;

  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-red-500">No data available for the chart.</p>;
  }

  // Filter and process data
  const hireableCount = data.reduce(
    (acc: Record<string, number>, curr) => {
      const hireableKey = curr["Hireable"] ? "Hireable" : "Non-Hireable"; // Convert boolean to meaningful strings
      acc[hireableKey] = (acc[hireableKey] || 0) + 1;
      return acc;
    },
    { Hireable: 0, "Non-Hireable": 0 } // Initialize counts
  );

  // Chart.js data and options
  const chartData = {
    labels: Object.keys(hireableCount),
    datasets: [
      {
        label: "Hireable Status",
        data: Object.values(hireableCount),
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"], // Two colors for the bars
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"], // Border colors
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Hireable vs Non-Hireable Users" },
    },
  };

  // Render chart
  return (
    <div className="w-[85vw] h-[85vh] mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
