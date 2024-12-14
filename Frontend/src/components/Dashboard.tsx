// Dashboard.tsx
import { useEffect, useState } from 'react';
import ScatterPlot from './scatterplot';
import BarChart from './BarChart';

type Data = {
  message: string;
  data: { SepalLengthCm: number; SepalWidthCm: number; PetalLengthCm: number; PetalWidthCm: number; Species: string }[];
};

const Dashboard: React.FC = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/data`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-start px-4 py-5 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Dashboard</h1>
      {data ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <ScatterPlot data={data.data} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <BarChart data={data.data} />
          </div>
        </div>
      ) : (
        <p className="text-xl text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
