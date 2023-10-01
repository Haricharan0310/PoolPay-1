import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoSpendPage from "./pages/CoSpend/CoSpendPage"; // Create this page component
import CoLoanPage from "./pages/CoLoan/CoLoanPage"; // Create this page component
import CoInvestPage from "./pages/CoInvest/CoInvestPage"; // Create this page component
import { SocketProvider } from "./pages/contextProvider/SocketProvider";

const App = () => {
  return (
    <SocketProvider> 
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/co-spend" element={<CoSpendPage />} />
        <Route path="/co-loan" element={<CoLoanPage />} />
        <Route path="/co-invest" element={<CoInvestPage />} />
      </Routes>
    </Router>
    </SocketProvider> 
  );
};

export default App;
