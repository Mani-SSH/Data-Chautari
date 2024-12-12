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
    <div>
      <h1>Dashboard</h1>
      {data ? (
        <div>
          <h2>{data.message}</h2>
          <ul>
            {data.data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default App