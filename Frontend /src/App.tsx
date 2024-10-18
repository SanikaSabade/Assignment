import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./components /dashboard/Dashboard";
import TransactionTable from "./components /dashboard/TransactionTable"; 
import TransactionStats from "./components /dashboard/TransactionStatistics"; 
// import BarChart from "./components /dashboard/BarChart"; 

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/Transaction" element={<TransactionTable/>} />
        <Route path="/Stats" element={<TransactionStats />} />
        {/* <Route path="/Charts" element={<BarChart/>} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
