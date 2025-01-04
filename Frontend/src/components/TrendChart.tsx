import {
    CategoryScale,
    Chart as ChartJS,
    ChartOptions,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useData } from "../hooks/useData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  selectedLanguage: string | null;
}

const TrendChart: React.FC<TrendChartProps> = ({ selectedLanguage }) => {
  const { data } = useData();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "No Data Available",
            data: [],
          },
        ],
      };
    }

    let languageToShow = selectedLanguage;

    // If no language is selected, determine the most used language
    if (!selectedLanguage) {
      const languageCounts = data.reduce((acc: Record<string, number>, curr) => {
        const language = curr["Most Used Language"];
        if (language) {
          acc[language] = (acc[language] || 0) + 1;
        }
        return acc;
      }, {});

      languageToShow = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null; // Get the most used language
    }

    // Filter data for the determined or selected language
    const languageData = data.filter(
      (item) => item["Most Used Language"] === languageToShow
    );

    const yearlyCounts = languageData.reduce((acc: Record<number, number>, curr) => {
      const year = new Date(curr["Account Created At"]).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    const sortedYears = Object.keys(yearlyCounts)
      .map(Number)
      .sort((a, b) => a - b);

    const counts = sortedYears.map((year) => yearlyCounts[year]);

    return {
      labels: sortedYears,
      datasets: [
        {
          label: `Trend for ${languageToShow}`,
          data: counts,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }, [data, selectedLanguage]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: selectedLanguage
          ? `Year-wise Trend for ${selectedLanguage}`
          : "Year-wise Trend for Most Used Language",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#e5e7eb" },
      },
      y: {
        grid: { color: "rgba(1, 1, 1, 1)" },
        ticks: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;
