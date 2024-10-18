import React from "react";
import { Link } from "react-router-dom";


const Dashboard: React.FC = () => {
  return (
    <div className='bg-sky-100 flex justify-center items-center h-screen'>
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-4xl py-10 font-semibold'>Welcome to the Roxiler Dashboard</h1>
        <div className="h-full flex flex-1">
          <Link to="/Transaction" className="h-32 w-32 bg-purple-200 rounded-xl flex justify-center items-center m-2 text-center">
            Transaction Table
          </Link>
          <Link to="/Stats" className="h-32 w-32 bg-purple-200 rounded-xl flex justify-center items-center m-2 text-center">
            Transaction Statistics
          </Link>
          <Link to="/Charts" className="h-32 w-32 bg-purple-200 rounded-xl flex justify-center items-center m-2 text-center">
            Transaction Bar Chart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
