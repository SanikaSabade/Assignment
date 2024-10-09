
interface StatisticsProps {
  month: string;
}

const TransactionStatistics = ({ month }: StatisticsProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-medium mb-4">Statistics - {month}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p className="text-sm text-gray-600">Total Sale Amount</p>
          <p className="text-2xl font-semibold mt-1">$12,450</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Sold Items</p>
          <p className="text-2xl font-semibold mt-1">45</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Not Sold Items</p>
          <p className="text-2xl font-semibold mt-1">15</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionStatistics;