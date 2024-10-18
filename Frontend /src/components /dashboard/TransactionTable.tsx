import { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionTable = () => {
  const [items, setItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm === "") getItems();
  }, [page, searchTerm]);

  const getItems = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/products/${page}`);
      const sortedItems = await response.data.data.sort((a: any, b: any) => a.id - b.id);
      setItems(sortedItems);
      setItemCount(response.data.total);
    } catch (error) {
      console.log('Oops! Something went wrong:', error);
    }
  };

  const nextPage = () => {
    setPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (page > 1) {
      setPage(prev => prev - 1);
    }
  };

  useEffect(() => {
    (async () => {
      if (selectedMonth) {
        const response = await axios.get(`http://localhost:3000/sale/${selectedMonth}`);
        const sortedSales = await response.data.saleData.sort((a: any, b: any) => a.id - b.id);
        setItems(sortedSales);
      }
    })();
  }, [selectedMonth]);

  useEffect(() => {
    (async () => {
      if (searchTerm !== "") {
        const response = await axios.get(`http://localhost:3000/search/${searchTerm}`);
        const sortedProducts = await response.data.products.sort((a: any, b: any) => a.id - b.id);
        setItems(sortedProducts);
      }
    })();
  }, [searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className='text-center text-4xl py-2'>Items</h1>
      <div className='py-2 flex flex-row gap-2'>
        <div className='flex-1'>
          <input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className='p-1 px-3 border-2 rounded-md focus:outline-blue-400 w-full'
            placeholder='Search...'
          />
        </div>
        <div className='px-3 border-2 rounded-lg bg-gray-200'>
          <select
            value={selectedMonth}
            onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(await JSON.parse(e.target.value))}
            className='outline-none border-2 border-gray-200 bg-gray-200'
          >
            <option value={undefined} disabled>Select a month</option>
            <option value={1}>Jan</option>
            <option value={2}>Feb</option>
            <option selected value={3}>Mar</option>
            <option value={4}>Apr</option>
            <option value={5}>May</option>
            <option value={6}>Jun</option>
            <option value={7}>Jul</option>
            <option value={8}>Aug</option>
            <option value={9}>Sep</option>
            <option value={10}>Oct</option>
            <option value={11}>Nov</option>
            <option value={12}>Dec</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {items.map((item: any) => (
              <tr key={item._id} className="hover:bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs. {item.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.sold ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {item.sold ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={prevPage}
          disabled={page === 1 || searchTerm !== ""}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">Page {page}</span>
        <button
          onClick={nextPage}
          disabled={page * 10 >= itemCount || searchTerm !== ""}
          className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
