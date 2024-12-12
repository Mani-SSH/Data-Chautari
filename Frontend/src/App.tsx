import { useEffect, useState } from 'react';

type Data = {
  message: string;
  data: number[];
};

function App() {
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
    <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Dashboard</h1>
      {data ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{data.message}</h2>
          <ul className="space-y-2">
            {data.data.map((item, index) => (
              <li key={index} className="text-xl text-gray-700">{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xl text-gray-500">Loading...</p>
      )}
    </div>
  )
}

export default App