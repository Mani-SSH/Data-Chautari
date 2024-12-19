import React from "react";
import BarChart from "./BarChart";
import ChoroplethMap from "./ChoroplethMap";
import DonutChart from "./DonutChart";
import { useState } from "react";
import { useData } from "../hooks/useData";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  if (isLoading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="p-4 bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Gihub Users Data</h1>

        {selectedCountry && (
          <button
            onClick={() => setSelectedCountry(null)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reset Selection
          </button>
        )}

        <div className="grid gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <ChoroplethMap onCountrySelect={setSelectedCountry} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <BarChart selectedCountry={selectedCountry} />
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <DonutChart selectedCountry={selectedCountry} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
