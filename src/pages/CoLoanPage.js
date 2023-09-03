import React, { useState } from "react";
import "./CoLoanPage.css";

const CoLoanPage = () => {
  const [showLoanDialog, setShowLoanDialog] = useState(false);

  const handleRequestLoanByQRClick = () => {
    setShowLoanDialog((prevShowLoanDialog) => !prevShowLoanDialog);
  };

  const handleRequestLoanByPhoneNumberClick = () => {
    // Implement your logic for requesting a loan by phone number
    // For example, you can display a loan request form
    alert("Loan Request by Phone Number");
  };

  return (
    <div className="co-loan-container">
      {/* Left Side */}
      <div className="co-loan-buttons">
        <button className="co-loan-button" onClick={handleRequestLoanByQRClick}>
          Request Loan Through QR
        </button>
        <button className="co-loan-button" onClick={handleRequestLoanByPhoneNumberClick}>
          Request Loan by Phone Number
        </button>
      </div>

      {/* Right Side */}
      <div className="co-loan-welcome">
        {showLoanDialog ? (
          <>
            <h2>Loan Request Form</h2>
            {/* Add loan request form or content here */}
          </>
        ) : (
          <h1>Welcome to Co Loan</h1>
        )}
      </div>
    </div>
  );
};

export default CoLoanPage;

