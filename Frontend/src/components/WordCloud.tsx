import React, { useEffect, useRef } from "react";
import { Chart as ChartJS, ChartOptions } from "chart.js";
import { WordCloudController, WordElement } from "chartjs-chart-wordcloud";
import { useData } from "../hooks/useData";
import "chartjs-chart-wordcloud";

// Register the WordCloud plugin
ChartJS.register(WordCloudController, WordElement);

interface WordCloudProps {
  country: string | null; // Make it optional to maintain backward compatibility
  selectedYear: number | null; // Add selectedYear prop
}

const WordCloud: React.FC<WordCloudProps> = ({ country, selectedYear }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const { data } = useData();

  useEffect(() => {
    try {
      if (!data || !chartRef.current) return;

      // Process the data to get topic frequencies
      const topicFrequency = new Map<string, number>();

      // Filter data based on country and selectedYear if provided
      const filteredData = data.filter((entry) => {
        const matchesCountry = country ? entry.Country === country : true;
        const matchesYear = selectedYear
          ? new Date(entry["Account Created At"]).getFullYear() === selectedYear
          : true;
        return matchesCountry && matchesYear;
      });

      filteredData.forEach((entry) => {
        let topics = [];
        if (typeof entry["Unique Topics"] === "string") {
          try {
            const sanitizedTopics = (entry["Unique Topics"] as string).replace(
              /'/g,
              '"'
            );
            topics = JSON.parse(sanitizedTopics);
          } catch (e) {
            console.error("Error parsing topics:", e);
          }
        }

        topics.forEach((topic: string) => {
          if (topic && topic.trim().toLowerCase() !== "unknown") {
            const cleanTopic: string = topic.trim();
            topicFrequency.set(
              cleanTopic,
              (topicFrequency.get(cleanTopic) || 0) + 1
            );
          }
        });
      });

      // Add check for empty data
      if (topicFrequency.size === 0) {
        console.log(`No data available${country ? ` for ${country}` : ""}`);
        return;
      }

      const words = Array.from(topicFrequency.entries()).map(
        ([text, value]) => ({
          text,
          value,
        })
      );

      const topWords = words.sort((a, b) => b.value - a.value).slice(0, 100);

      const minValue = Math.min(...topWords.map((w) => w.value));
      const maxValue = Math.max(...topWords.map((w) => w.value));

      const ctx = chartRef.current.getContext("2d");
      if (!ctx) return;

      const existingChart = ChartJS.getChart(ctx);
      if (existingChart) existingChart.destroy();

      // Simplified data structure
      const chartData = {
        labels: topWords.map((w) => w.text),
        datasets: [
          {
            data: topWords.map((w) => w.value),
            texts: topWords.map((w) => w.text), // Store texts separately
          },
        ],
      };

      const options: ChartOptions<"wordCloud"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context: any) => {
                const value = context.raw;
                const text = chartData.labels[context.dataIndex];
                return `${text}: Frequency ${value}`;
              },
            },
          },
        },
        layout: {
          padding: 1,
        },
        elements: {
          word: {
            padding: 3,
            minRotation: 0,
            maxRotation: 90,
            size: (ctx) => {
              const value = ctx.raw as number;
              // Normalize the size based on the range of values
              const normalizedSize =
                ((value - minValue) / (maxValue - minValue)) * 50 + 25;
              return normalizedSize;
            },
            color: (ctx) => {
              const value = ctx.raw as number;
              const normalizedSize =
                ((value - minValue) / (maxValue - minValue)) * 100;

              if (normalizedSize > 80) return "#8B0000"; // Dark Red
              if (normalizedSize > 60) return "#B22222"; // Firebrick
              if (normalizedSize > 50) return "#FF4500"; // Orange Red
              if (normalizedSize > 40) return "#FF8C00"; // Dark Orange
              if (normalizedSize > 30) return "#32CD32"; // Lime Green
              if (normalizedSize > 20) return "#00FA9A"; // Medium Spring Green
              if (normalizedSize > 10) return "#1E90FF"; // Dodger Blue
              return "#87CEFA"; // Light Sky Blue
            },
            font: {
              family: "Arial, sans-serif",
              style: "bold",
            },
          },
        },
      };

      new ChartJS(ctx, {
        type: "wordCloud",
        data: chartData,
        options: options as any,
      });
    } catch (error) {
      console.error("Error rendering WordCloud:", error);
    }
  }, [data, country, selectedYear]);

  return (
    <div className="w-full h-full">
      <div className="text-white text-lg mb-4">
        {country && <span>Country: {country}</span>}
        {selectedYear && <span> Year: {selectedYear}</span>}
      </div>
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
};

export default WordCloud;
