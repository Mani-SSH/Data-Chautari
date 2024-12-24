import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import { useData } from "../hooks/useData";

interface BarChartProps {
  selectedCountry: string | null;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC<BarChartProps> = ({ selectedCountry }) => {
  const { data } = useData();
  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-red-500">No data available for the chart.</p>;
  }

  // Filter data by selected country
  const filteredData = selectedCountry
    ? data.filter((d) => d.Country === selectedCountry)
    : data;

  // Calculate hireable and non-hireable counts
  const hireableCount = filteredData.reduce(
    (acc: Record<string, number>, curr) => {
      const hireableKey = curr.Hireable ? "Hireable" : "Non-Hireable";
      acc[hireableKey] = (acc[hireableKey] || 0) + 1;
      return acc;
    },
    { Hireable: 0, "Non-Hireable": 0 }
  );

  // Prepare chart data
  const chartData: ChartData<"bar"> = {
    labels: Object.keys(hireableCount), // ['Hireable', 'Non-Hireable']
    datasets: [
      {
        label: `Hireable Status ${
          selectedCountry ? `in ${selectedCountry}` : "(All Countries)"
        }`,
        data: Object.values(hireableCount), // [countHireable, countNonHireable]
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: `Hireable Distribution ${
          selectedCountry ? `- ${selectedCountry}` : "(Global)"
        }`,
      },
    },
  };

  // Render bar chart
  return (
    <div className="w-full h-full mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
