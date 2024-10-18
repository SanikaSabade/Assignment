import React from "react";
import { Bar } from "react-chartjs-2";

interface BarChartProps {
  data: { month: string; totalRevenue: number }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Total Revenue',
        data: data.map(item => item.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div>
      <h2>Revenue Bar Chart</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default BarChart;
