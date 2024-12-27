import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";
import { useData } from "../hooks/useData";

ChartJS.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

interface HistogramData {
  range: string;
  count: number;
}

interface HistogramChartProps {
  selectedLanguage: string | null;
}

const HistogramChart: React.FC<HistogramChartProps> = ({
  selectedLanguage,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const { data, isLoading, error } = useData();

  useEffect(() => {
    if (isLoading || error || !data || !chartRef.current) return;

    const bins = [
      { range: "1-3", min: 1, max: 3, count: 0 },
      { range: "4-6", min: 4, max: 6, count: 0 },
      { range: "7-9", min: 7, max: 9, count: 0 },
      { range: "10-12", min: 10, max: 12, count: 0 },
      { range: "13-15", min: 13, max: 15, count: 0 },
      { range: "16-18", min: 16, max: 18, count: 0 },
      { range: "19-21", min: 19, max: 21, count: 0 },
      { range: "22-24", min: 22, max: 24, count: 0 },
      { range: "25-27", min: 25, max: 27, count: 0 },
      { range: "28-30", min: 28, max: 30, count: 0 },
    ];

    const filteredData = selectedLanguage
      ? data.filter(
          (user: any) => user["Most Used Language"] === selectedLanguage
        )
      : data;

    filteredData.forEach((user: any) => {
      const repoCount = user["Repositories Count"];
      const bin = bins.find((b) => repoCount >= b.min && repoCount <= b.max);
      if (bin) {
        bin.count += 1;
      }
    });

    const transformedData: HistogramData[] = bins.map((bin) => ({
      range: bin.range,
      count: bin.count,
    }));

    const chartData: ChartData<"bar"> = {
      labels: transformedData.map((d) => d.range),
      datasets: [
        {
          label: "Repositories Count",
          data: transformedData.map((d) => d.count),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };

    const chartOptions: ChartOptions<"bar"> = {
      responsive: true,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: "#e5e7eb", // Off-white color for legend labels
          },
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              return `Count: ${value}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Repositories Count Range",
            color: "#e5e7eb", // Off-white color for x-axis title
          },
          ticks: {
            color: "#e5e7eb", // Off-white color for x-axis labels
          },
        },
        y: {
          title: {
            display: true,
            text: "Followers Count",
            color: "#e5e7eb", // Off-white color for y-axis title
          },
          ticks: {
            color: "#e5e7eb", // Off-white color for y-axis labels
          },
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new ChartJS(chartRef.current, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [data, isLoading, error, selectedLanguage]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default HistogramChart;
