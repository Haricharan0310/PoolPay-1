import React, { useState } from "react";
import "./CoSpendPage.css";

const CoSpendPage = () => {
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const handleScanAndPayClick = () => {
    setShowPayDialog((prevShowPayDialog) => !prevShowPayDialog);
    setSelectedContact(null); // Close the contact view
  };

  const handlePayMoneyClick = () => {
    // Implement your logic for payment here
    // For example, you can display a confirmation message
    alert("Payment Successful!");
  };

  const handlePayByPhoneNumberClick = () => {
    if (!selectedContact) {
      setSelectedContact({ name: "Kevin", phoneNumber: "987654321" });
    } else {
      setSelectedContact(null);
      setShowPayDialog(false); // Close the "Pay Money" dialog if it's open
    }
  };

  const handleKevinClick = () => {
    setShowPayDialog(true);
  };

  return (
    <div className="co-spend-container">
      {/* Left Side */}
      <div className="co-spend-buttons">
        <button className="co-spend-button" onClick={handleScanAndPayClick}>
           Scan and Pay
        </button>
        <button className="co-spend-button" onClick={handlePayByPhoneNumberClick}>
           Pay by Phone Number
        </button>
      </div>

      {/* Right Side */}
      <div className="co-spend-welcome">
        {showPayDialog ? (
          <button className="pay-money-button" onClick={handlePayMoneyClick}>
            Pay Money
          </button>
        ) : selectedContact ? (
          <>
            
            <div className="contact-details">
            <h2>Contact Information</h2>
              <p>Name: {selectedContact.name}</p>
              <p>Phone Number: {selectedContact.phoneNumber}</p>
            </div>
            <button className="pay-money-button" onClick={handleKevinClick}>
              Select
            </button>
          </>
        ) : (
          <h1>Welcome to Co Spend</h1>
        )}
      </div>
    </div>
  );
};

export default CoSpendPage;
