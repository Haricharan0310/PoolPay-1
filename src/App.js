import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CoSpendPage from "./pages/CoSpendPage"; // Create this page component
import CoLoanPage from "./pages/CoLoanPage"; // Create this page component
import CoInvestPage from "./pages/CoInvestPage"; // Create this page component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/co-spend" element={<CoSpendPage/>} />
        <Route path="/co-loan" element={<CoLoanPage/>} />
        <Route path="/co-invest" element={<CoInvestPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
