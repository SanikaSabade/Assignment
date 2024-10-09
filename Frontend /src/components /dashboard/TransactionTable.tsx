import { useState } from 'react';
import { Search } from 'lucide-react';
import MonthSelector from '../shared/MonthSelector';

const TransactionTable = () => {
  const [month, setMonth] = useState('March');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with API call
  const transactions = [
    {
      id: 1,
      title: 'iPhone 13 Pro',
      description: '256GB Graphite',
      price: 999,
      dateOfSale: '2024-03-15',
      category: 'Electronics'
    },
    // Add more mock data as needed
  ];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm">
        <MonthSelector selectedMonth={month} onChange={setMonth} />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search transaction"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date of Sale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map(transaction => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">{transaction.title}</td>
                  <td className="px-4 py-3">{transaction.description}</td>
                  <td className="px-4 py-3">${transaction.price}</td>
                  <td className="px-4 py-3">{transaction.category}</td>
                  <td className="px-4 py-3">{transaction.dateOfSale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
