import React from "react";
import {
  Chart,
  ScatterController,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

// Register required Chart.js components
Chart.register(ScatterController, LinearScale, Title, PointElement, Tooltip, Legend, CategoryScale);

type Props = {
  data: { SepalLengthCm: number; SepalWidthCm: number; PetalLengthCm: number; PetalWidthCm: number; Species: string }[];
};

const ScatterPlot: React.FC<Props> = ({ data }) => {
  // Prepare the scatter plot data
  const scatterData = {
    datasets: [
      {
        label: "Sepal Length vs Sepal Width",
        data: data.map((d) => ({ x: d.SepalLengthCm, y: d.SepalWidthCm })), // Map data for Chart.js
        backgroundColor: "rgba(70, 130, 180, 0.7)", // Steel blue color with some transparency
        pointRadius: 5,
      },
    ],
  };

  // Define configuration options for the chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top" as const, // Specify type explicitly
      },
      title: {
        display: true,
        text: "Scatter Plot: Sepal Length vs Sepal Width",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const { x, y } = context.raw;
            return `Sepal Length: ${x}, Sepal Width: ${y}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "linear" as const, // Explicitly set the type
        title: {
          display: true,
          text: "Sepal Length (cm)",
        },
      },
      y: {
        type: "linear" as const, // Explicitly set the type
        title: {
          display: true,
          text: "Sepal Width (cm)",
        },
      },
    },
  };

  return (
    <div>
      <h2>Scatter Plot: Sepal Length vs Sepal Width</h2>
      <Scatter data={scatterData} options={options} />
    </div>
  );
};

export default ScatterPlot;