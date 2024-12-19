import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { DataRow } from "../types/types";
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

const options: ChartOptions<"line"> = {
  responsive: true,
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  plugins: {
    legend: {
      display: false, // Hide legend since we only have one dataset
    },
    tooltip: {
      enabled: true,
      position: "nearest",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleSpacing: 8,
      titleMarginBottom: 8,
      callbacks: {
        title: function (tooltipItems) {
          return `Year: ${tooltipItems[0].label}`;
        },
        label: function (context) {
          // Pre-format the number to avoid doing it on each hover
          const value = context.parsed.y;
          if (value >= 1000000) {
            return `Total Users: ${(value / 1000000).toFixed(1)}M`;
          } else if (value >= 1000) {
            return `Total Users: ${(value / 1000).toFixed(1)}K`;
          }
          return `Total Users: ${value}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        maxTicksLimit: 6,
        callback: function (value) {
          // Pre-format the numbers for better performance
          const numValue = value as number;
          if (numValue >= 1000000) {
            return `${(numValue / 1000000).toFixed(1)}M`;
          } else if (numValue >= 1000) {
            return `${(numValue / 1000).toFixed(1)}K`;
          }
          return numValue;
        },
      },
    },
  },
  elements: {
    point: {
      radius: 0,
      hoverRadius: 6,
    },
    line: {
      tension: 0.4,
    },
  },
};

const LineChart = () => {
  const { data } = useData();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total Users",
            data: [],
            borderColor: "#4bc0c0",
          },
        ],
      };
    }

    // Pre-calculate yearly data
    const yearlyData = data.reduce((acc, item: DataRow) => {
      const dateStr = item["Account Created At"];
      const date = new Date(dateStr);

      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    const years = Object.keys(yearlyData)
      .map(Number)
      .sort((a, b) => a - b);

    const cumulativeCounts = years.reduce((acc, year) => {
      const previousCount = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(previousCount + yearlyData[year]);
      return acc;
    }, [] as number[]);

    return {
      labels: years,
      datasets: [
        {
          label: "Total Users",
          data: cumulativeCounts,
          fill: {
            target: "origin",
            above: "rgba(75, 192, 192, 0.1)",
          },
          borderColor: "#4bc0c0",
          borderWidth: 2,
          backgroundColor: "#4bc0c0",
          tension: 0.4,
        },
      ],
    };
  }, [data]);

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Users Growth Over Time
      </h2>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
