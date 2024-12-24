import React, { useEffect } from "react";
import BarChart from "./BarChart";
import ChoroplethMap from "./ChoroplethMap";
import DonutChart from "./DonutChart";
import LineChart from "./LineChart";
import HistogramChart from "./HistogramChart";
import WordCloud from "./WordCloud"; // Ensure WordCloud is imported
import { useState } from "react";
import { useData } from "../hooks/useData";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-red-500 text-lg">
          Error loading data: {error.message}
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-gray-500 text-lg">No data available</div>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen">
      {/* Header and Toolbar */}
      <div className="mb-10 bg-gray-800 p-6 rounded-lg fixed top-0 left-0 right-0 z-10 shadow-lg w-full">
        <header className="mb-4 max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-white mb-2 flex items-center gap-3">
            <img src="/logo.svg" alt="Logo" className="h-10" />
            GitHub Users Dashboard
          </h1>
          <p className="text-gray-400">
            Visualize GitHub user data over time, by country, and by various
            categories.
          </p>
        </header>

        {/* Selected Filters Section */}
        <div className="flex gap-4 max-w-7xl mx-auto mb-4">
          {selectedYear && (
            <div className="flex items-center gap-2">
              <span className="text-white">Year: {selectedYear}</span>
              <button
                onClick={() => setSelectedYear(null)}
                className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Year
              </button>
            </div>
          )}
          {selectedCountry && (
            <div className="flex items-center gap-2">
              <span className="text-white">Country: {selectedCountry}</span>
              <button
                onClick={() => setSelectedCountry(null)}
                className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Country
              </button>
            </div>
          )}
          {selectedLanguage && (
            <div className="flex items-center gap-2">
              <span className="text-white">Language: {selectedLanguage}</span>
              <button
                onClick={() => setSelectedLanguage(null)}
                className="px-5 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset Language
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add padding to avoid content being hidden behind fixed elements */}
      <div className="pt-40 max-w-full mx-auto">
        {/* Choropleth Map */}
        <div className="bg-white rounded-lg p-8 shadow-xl mb-10 w-full">
          <h2 className="text-xl font-semibold mb-6">Users by Country</h2>
          <ChoroplethMap
            onCountrySelect={setSelectedCountry}
            selectedYear={selectedYear}
            selectedCountry={selectedCountry}
          />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-full">
          {/* Line Chart */}
          <div className="bg-white rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6">
              Cumulative Users Over Time
            </h2>
            <LineChart
              onYearSelect={setSelectedYear}
              selectedYear={selectedYear}
            />
          </div>
          {/* Bar Chart */}
          <div className="bg-white rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6">
              Yearly Growth by Country
            </h2>
            <div className="w-full h-full">
              <BarChart selectedCountry={selectedCountry} />
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6">
              User Distribution by Category
            </h2>
            <div className="w-full h-full overflow-hidden">
              <DonutChart
                selectedCountry={selectedCountry}
                onLanguageSelect={setSelectedLanguage}
              />
            </div>
          </div>

          {/* Histogram Chart */}
          <div className="bg-white rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6">Histogram Chart</h2>
            <HistogramChart selectedLanguage={selectedLanguage} />
          </div>
        </div>

        {/* Word Cloud */}
        <div className="bg-black rounded-lg p-8 shadow-xl mt-10 w-full">
          <h2 className="text-xl font-semibold mb-6">Word Cloud</h2>
          <div className="w-full h-[900px]">
            {" "}
            {/* Increase height */}
            <WordCloud country={selectedCountry} selectedYear={selectedYear} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
