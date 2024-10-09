import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


interface Props {
  selectedMonth: string; 
}

const BarChart: React.FC<Props> = ({ selectedMonth }) => {
  
  const data = {
    labels: ['Transaction 1', 'Transaction 2', 'Transaction 3', 'Transaction 4', 'Transaction 5'],
    datasets: [
      {
        label: 'Amount ($)',
        data: [200, 150, 300, 250, 400], 
        backgroundColor: 'rgba(255, 205, 86, 0.6)', 
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1,
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
        text: `Transaction Amounts for ${selectedMonth}`, 
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
