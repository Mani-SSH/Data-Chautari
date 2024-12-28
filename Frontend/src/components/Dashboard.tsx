import React, { useState } from "react";
import CountUp from "react-countup";
import Typewriter from "typewriter-effect";
import { useData } from "../hooks/useData";
import ArcProgressCard from "./ArcProgressCard";
import BarChart from "./BarChart";
import ChoroplethMap from "./ChoroplethMap";
import DonutChart from "./DonutChart";
import Flashcard from "./Flashcard";
import HistogramChart from "./HistogramChart";
import LineChart from "./LineChart";
import SelectedFilters from "./SelectedFilters";
import WordCloud from "./WordCloud";



const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const handleYearSelect = (year: number | null, totalUsers: number) => {
    setSelectedYear(year);
    setTotalUsers(totalUsers);
  };

  const handleResetYear = () => {
    setSelectedYear(null);
    setTotalUsers(data ? data.length : 0);
  };

  const handleResetCountry = () => {
    setSelectedCountry(null);
    setTotalUsers(data ? data.length : 0);
  };

  const handleResetLanguage = () => {
    setSelectedLanguage(null);
    setTotalUsers(data ? data.length : 0);
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
    <div className="p-6 bg-gradient-to-br from-gray-800 to-gray-900 min-h-screen font-poppins">
      {/* Header and Toolbar */}
      <div className="mb-10 bg-gray-800 p-6 rounded-lg fixed top-0 left-0 right-0 z-10 shadow-lg w-full">
        <header className="mb-4 max-w-7xl mx-auto">
          <h1 className="font-sans text-5xl font-extrabold text-white mb-2 flex items-center gap-3 font-open-sans">
            {/* <img src="/logo.svg" alt="Logo" className="h-10" /> */}
            GitHub Users Dashboard
          </h1>
          <p className="text-gray-300 font-light">
            Visualize GitHub user data over time, by country, and by various
            categories.
          </p>
        </header>

        {/* Selected Filters Section */}
        <SelectedFilters
          selectedYear={selectedYear}
          selectedCountry={selectedCountry}
          selectedLanguage={selectedLanguage}
          onResetYear={handleResetYear}
          onResetCountry={handleResetCountry}
          onResetLanguage={handleResetLanguage}
        />
      </div>

      {/* Add padding to avoid content being hidden behind fixed elements */}
      <div className="pt-40 max-w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Flashcard */}
          <div className="col-span-1 md:col-span-1 flex flex-col justify-between">
            <Flashcard
              title="User Details"
              bgColor="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75"
              totalUsers={<CountUp end={totalUsers} duration={2} />}
              selectedCountry={
                selectedCountry ? (
                  <Typewriter
                    options={{
                      strings: [selectedCountry],
                      autoStart: true,
                      loop: false,
                      deleteSpeed: 99999999,
                      cursor: "", // Hide cursor
                    }}
                  />
                ) : null
              }
              selectedYear={
                selectedYear ? (
                  <Typewriter
                    options={{
                      strings: [selectedYear.toString()],
                      autoStart: true,
                      loop: false,
                      deleteSpeed: 99999999,
                      cursor: "", // Hide cursor
                    }}
                  />
                ) : null
              }
            />
            <ArcProgressCard
              title="Progress"
              percentage={(totalUsers / (data ? data.length : 1)) * 100}
              bgColor="bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 mt-6"
            />
          </div>

          {/* Choropleth Map */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-700 to-gray-800 bg-opacity-75 rounded-lg p-8 shadow-xl w-full">
            <h2 className="text-xl font-semibold mb-6 text-gray-300">
              Users by Country
            </h2>
            <ChoroplethMap
              onCountrySelect={setSelectedCountry}
              selectedYear={selectedYear}
              selectedCountry={selectedCountry}
              onTotalUsersChange={setTotalUsers}
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
              onYearSelect={handleYearSelect}
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