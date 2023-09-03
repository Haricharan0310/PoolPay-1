import React, { useState } from "react";
import "./CoInvestPage.css";

const CoInvestPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState([
    { ticker: "AAPL", price: 150.25, change: "+1.20%" },
    { ticker: "GOOGL", price: 2750.50, change: "-0.50%" },
    { ticker: "TSLA", price: 710.20, change: "+2.05%" },
    { ticker: "AMZN", price: 3456.55, change: "-0.75%" },
    { ticker: "MSFT", price: 305.80, change: "+0.90%" },
    { ticker: "FB", price: 360.10, change: "-0.25%" },
    { ticker: "GOOG", price: 2755.80, change: "+1.10%" },
    { ticker: "NVDA", price: 225.40, change: "+1.75%" },
    { ticker: "AAPL", price: 150.25, change: "+1.20%" },
    { ticker: "GOOGL", price: 2750.50, change: "-0.50%" },
    { ticker: "TSLA", price: 710.20, change: "+2.05%" },
    { ticker: "AMZN", price: 3456.55, change: "-0.75%" },
    { ticker: "MSFT", price: 305.80, change: "+0.90%" },
    { ticker: "FB", price: 360.10, change: "-0.25%" },
    { ticker: "GOOG", price: 2755.80, change: "+1.10%" },
  ]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRequestFriendClick = () => {
    // Implement your logic for sending friend requests
    alert("Friend Request Sent!");
  };

  return (
    <div className="co-invest-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for Asset"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Stock Table */}
      <div className="stock-table">
        <table>
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Current Price</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {filteredStocks.map((stock, index) => (
              <tr key={index}>
                <td>{stock.ticker}</td>
                <td>{stock.price}</td>
                <td>{stock.change}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Request Friend Button */}
      <div className="request-friend-button">
        <button onClick={handleRequestFriendClick}>Request Friend</button>
      </div>
    </div>
  );
};

export default CoInvestPage;
