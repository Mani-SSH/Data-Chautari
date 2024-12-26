import React, { useEffect } from "react";
import BarChart from "./BarChart";
import ChoroplethMap from "./ChoroplethMap";
import DonutChart from "./DonutChart";
import LineChart from "./LineChart";
import HistogramChart from "./HistogramChart";
import WordCloud from "./WordCloud"; // Ensure WordCloud is imported
import Flashcard from "./Flashcard";
import SelectedFilters from "./SelectedFilters";
import { useState } from "react";
import { useData } from "../hooks/useData";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0); // Add this line

  const handleYearSelect = (year: number | null, totalUsers: number) => {
    setSelectedYear(year);
    setTotalUsers(totalUsers); // Add this line
  };

  const handleResetYear = () => {
    setSelectedYear(null);
    setTotalUsers(data ? data.length : 0); // Reset total users to the overall count
  };

  const handleResetCountry = () => {
    setSelectedCountry(null);
    setTotalUsers(data ? data.length : 0); // Reset total users to the overall count
  };

  const handleResetLanguage = () => {
    setSelectedLanguage(null);
    setTotalUsers(data ? data.length : 0); // Reset total users to the overall count
  };

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
          <p className="text-gray-300">
            Visualize GitHub user data over time, by country, and by various
            categories.
          </p>
        </header>

        {/* Selected Filters Section */}
        <SelectedFilters
          selectedYear={selectedYear}
          selectedCountry={selectedCountry}
          selectedLanguage={selectedLanguage}
          onResetYear={handleResetYear} // Modify this line
          onResetCountry={handleResetCountry} // Modify this line
          onResetLanguage={handleResetLanguage} // Modify this line
        />
      </div>

      {/* Add padding to avoid content being hidden behind fixed elements */}
      <div className="pt-40 max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Flashcard */}
          <div className="col-span-1">
            <Flashcard
              title="User Details"
              field="totalUsersField"
              bgColor="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75"
              totalUsers={totalUsers} // Add this line
              selectedCountry={selectedCountry} // Add this line
              selectedYear={selectedYear} // Add this line
              selectedLanguage={selectedLanguage} // Add this line
            />
          </div>

          {/* Choropleth Map */}
          <div className="col-span-2 bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Users by Country
            </h2>
            <ChoroplethMap
              onCountrySelect={setSelectedCountry}
              selectedYear={selectedYear}
              selectedCountry={selectedCountry}
              onTotalUsersChange={setTotalUsers} // Add this line
            />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 w-full">
          {/* Line Chart */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Cumulative Users Over Time
            </h2>
            <LineChart
              onYearSelect={handleYearSelect} // Modify this line
              selectedYear={selectedYear}
            />
          </div>
          {/* Bar Chart */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Yearly Growth by Country
            </h2>
            <div className="w-full h-full">
              <BarChart selectedCountry={selectedCountry} />
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
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
          <div className="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Histogram Chart
            </h2>
            <HistogramChart selectedLanguage={selectedLanguage} />
          </div>
        </div>

        {/* Word Cloud */}
        <div className="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl mt-10 w-full">
          <h2 className="text-xl font-semibold mb-6 text-gray-300">
            Word Cloud
          </h2>
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
