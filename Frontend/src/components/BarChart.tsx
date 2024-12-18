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

  // useEffect(() => {
  //   console.log("Inside BarChart, fetched data:", data);
  // }, [data]);

  // Loading and error states
  if (isLoading) return <p className="text-blue-500">Loading chart data...</p>;
  if (error)
    return <p className="text-red-500">Error loading data: {error.message}</p>;

  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-red-500">No data available for the chart.</p>;
  }

  // Filter and process data
  const filteredData = data.filter((row) => row["Most Used Language"]?.trim());
  if (filteredData.length === 0) {
    return <p className="text-red-500">No valid language data available.</p>;
  }

  const languageCount = filteredData.reduce(
    (acc: Record<string, number>, curr) => {
      const language = curr["Most Used Language"];
      acc[language] = (acc[language] || 0) + 1;
      return acc;
    },
    {}
  );

  // Chart.js data and options
  const chartData = {
    labels: Object.keys(languageCount),
    datasets: [
      {
        label: "Count of Languages",
        data: Object.values(languageCount),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Most Used Languages" },
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
