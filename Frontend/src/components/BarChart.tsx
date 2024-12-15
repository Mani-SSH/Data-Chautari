import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  data: { Species: string }[];
};

const BarChart: React.FC<Props> = ({ data }) => {
  // Aggregate data by species
  const speciesCount = data.reduce((acc: Record<string, number>, curr) => {
    acc[curr.Species] = (acc[curr.Species] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(speciesCount), // Species names
    datasets: [
      {
        label: 'Count',
        data: Object.values(speciesCount), // Count of each species
        backgroundColor: 'rgba(54, 162, 235, 0.5)', // Bar color
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Species Distribution (Bar Chart)',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;