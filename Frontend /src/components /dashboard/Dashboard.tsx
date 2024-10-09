// src/pages/DashboardPage.tsx
import React, { useState } from 'react';
import TransactionTable from './TransactionTable';
import Statistics from './TransactionStatistics';
import BarChart from './BarChart';
import './../../Dashboard.css'
const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Transaction Dashboard
            </h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <TransactionTable />
          <Statistics month={selectedMonth} />
          <BarChart month={selectedMonth} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;