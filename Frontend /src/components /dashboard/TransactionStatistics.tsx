import React, { useEffect, useState } from "react";
import axios from "axios";

interface SalesSummary {
  month: string;
  totalTransactions: number;
  totalRevenue: number;
}

const TransactionStats: React.FC = () => {
  const [stats, setStats] = useState<SalesSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3000/sales-summary");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching transaction stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Transaction Stats</h2>
      <ul>
        {stats.map((stat) => (
          <li key={stat.month}>
            Month: {stat.month}, Total Transactions: {stat.totalTransactions}, Total Revenue: ${stat.totalRevenue}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionStats;
