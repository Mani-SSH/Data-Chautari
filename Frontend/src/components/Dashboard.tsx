import React from 'react';
import BarChart from './BarChart';
import ChoroplethMap from './ChoroplethMap';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="charts-container">
        <BarChart />
        <ChoroplethMap />
      </div>
    </div>
  );
};

export default Dashboard;