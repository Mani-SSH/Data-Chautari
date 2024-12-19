import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useEffect, useMemo } from "react";
import { useData } from "../hooks/useData";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DonutChartProps {
  selectedCountry: string | null;
}

const generateColors = (
  count: number
): { backgroundColor: string[]; borderColor: string[] } => {
  const colors = [];
  const borderColors = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
    borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
  }
  return { backgroundColor: colors, borderColor: borderColors };
};

const DonutChart: React.FC<DonutChartProps> = ({ selectedCountry }) => {
  const { data, isLoading, error } = useData();

  if (isLoading) return <p className="text-blue-500">Loading chart data...</p>;
  if (error)
    return <p className="text-red-500">Error loading data: {error.message}</p>;

  const filteredData = selectedCountry
    ? data?.filter((d) => d.Country === selectedCountry)
    : data;

  const languageCount: Record<string, number> = useMemo(() => {
    const count: Record<string, number> = {};
    filteredData?.forEach((row) => {
      const language = row["Most Used Language"];
      if (language) {
        count[language] = (count[language] || 0) + 1;
      }
    });

    const threshold = 50;
    let othersCount = 0;

    for (const [language, value] of Object.entries(count)) {
      if (value < threshold) {
        othersCount += value;
        delete count[language];
      }
    }

    if (othersCount > 0) {
      count["Others"] = othersCount;
    }

    return count;
  }, [filteredData]);

  const chartColors = generateColors(Object.keys(languageCount).length);

  const chartData = {
    labels: Object.keys(languageCount),
    datasets: [
      {
        data: Object.values(languageCount),
        backgroundColor: chartColors.backgroundColor,
        borderColor: chartColors.borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      datalabels: {
        color: "#fff", // White text
        font: {
          size: 14,
          weight: "bold" as const, // Explicitly use a valid literal type
        },
        formatter: (value: number, context: any) => {
          // Show labels only if the segment is large enough
          const total = context.chart.data.datasets[0].data.reduce(
            (sum: number, val: number) => sum + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return value > total * 0.05
            ? `${context.chart.data.labels[context.dataIndex]} (${percentage}%)`
            : ""; // Hide small labels
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-[80vw] h-[80vh] mx-auto">
      <h2 className="text-center text-xl">
        {selectedCountry
          ? `Most Used Languages in ${selectedCountry}`
          : "Most Used Languages (Global)"}
      </h2>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

export default DonutChart;
