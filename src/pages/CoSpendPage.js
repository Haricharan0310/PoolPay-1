import React, { useState, useEffect } from "react";
import "./CoSpendPage.css";

const CoSpendPage = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showPayByPhoneNumber, setShowPayByPhoneNumber] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const [phoneNumberToPay, setPhoneNumberToPay] = useState("");
  const [numUsersPooling, setNumUsersPooling] = useState(0);
  const [totalUserAmount, setTotalUserAmount] = useState(0);

  useEffect(() => {
    // Calculate the totalUserAmount (sum of userAmounts)
    const sum = users.reduce((acc, user) => acc + parseFloat(user.amount), 0);
    setTotalUserAmount(sum);
  }, [users]);

  const handleScanAndPayClick = () => {
    setShowScanner(true);
    setShowPayByPhoneNumber(false);
    setSelectedContact(null);
    setTotalAmount(0);
    setUsers([]);
  };

  const handlePayByPhoneNumberClick = () => {
    setShowScanner(false);
    setShowPayByPhoneNumber(true);
    setSelectedContact(null);
    setTotalAmount(0);
    setUsers([]);
    setPhoneNumberToPay("");
    setNumUsersPooling(0);
    setTotalUserAmount(0);
  };

  const handlePayMoneyClick = () => {
    // Check if the total amount and totalUserAmount match before proceeding with payment
    if (totalAmount === totalUserAmount) {
      // Implement your logic for payment here
      // For example, you can display a confirmation message
      alert("Payment Successful!");
    } else {
      alert(
        "Please ensure the total amount and user amounts match before proceeding with payment."
      );
    }
  };

  const handleScannerComplete = (qrData) => {
    // Parse QR code data, assuming it contains information about totalAmount and userAmount
    const { totalAmount, userAmount } = JSON.parse(qrData);

    setShowScanner(false);
    setShowPayByPhoneNumber(true);
    setTotalAmount(totalAmount);
    setUsers([]);
  };

  const handleAddUserClick = () => {
    if (numUsersPooling > 0) {
      setUsers(
        Array.from({ length: numUsersPooling }, () => ({
          name: "",
          phoneNumber: "",
          amount: "0",
        }))
      ); // Initialize amount as "0"
    }
  };

  const handlePhoneNumberInputChange = (e) => {
    setPhoneNumberToPay(e.target.value);
  };

  const handleTotalAmountInputChange = (e) => {
    setTotalAmount(parseFloat(e.target.value));
  };

  const handleNumUsersPoolingChange = (e) => {
    const numUsers = parseInt(e.target.value);
    setNumUsersPooling(numUsers);

    // Clear the existing user data when the number of users changes
    setUsers([]);
    setTotalUserAmount(0);
  };

  const handleUserInputChange = (index, field, value) => {
    // Update the user object with the new value at the specified index
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  const handleKevinClick = () => {
    setSelectedContact({ name: "Kevin", phoneNumber: "987654321" });
    setShowPayByPhoneNumber(true); // Assuming you want to proceed with payment after selecting Kevin
  };

  return (
    <div className="co-spend-container">
      {/* Left Side */}
      <div className="co-spend-buttons">
        <button className="co-spend-button" onClick={handleScanAndPayClick}>
          Scan and Pay
        </button>
        <button
          className="co-spend-button"
          onClick={handlePayByPhoneNumberClick}
        >
          Pay by Phone Number
        </button>
      </div>

      {/* Right Side */}
      <div className="co-spend-welcome">
        {showScanner ? (
          <div className="scanner">
            {
              <div className="scanner">
                {/* Add your QR code scanner component here */}
                {/* When the scan is complete, call handleScannerComplete with the QR data */}
                {/* For demonstration purposes, you can use a simple input field */}
                <input
                  type="text"
                  placeholder="Enter QR Code Data"
                  onChange={(e) => handleScannerComplete(e.target.value)}
                />
              </div>
            }
          </div>
        ) : showPayByPhoneNumber ? (
          <div className="pay-by-phone">
            <>
              <label>Enter Phone Number to Send Money To:</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumberToPay}
                onChange={handlePhoneNumberInputChange}
              />
              <label>Enter Total Amount (₹):</label>
              <input
                type="number"
                placeholder="Total Amount"
                value={totalAmount}
                onChange={handleTotalAmountInputChange}
              />
              <label>Number of Users Pooling Money:</label>
              <input
                type="number"
                placeholder="Number of Users"
                value={numUsersPooling}
                onChange={handleNumUsersPoolingChange}
              />
              <button className="add-users-button" onClick={handleAddUserClick}>
                Add Users
              </button>
              {users.length > 0 && (
                <div>
                  <h3>Enter User Details:</h3>
                  {users.map((user, index) => (
                    <div key={index} className="user-input-row">
                      <div className="user-input">
                        <input
                          type="text"
                          placeholder={`User ${index + 1} Name`}
                          value={user.name}
                          onChange={(e) =>
                            handleUserInputChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="user-input">
                        <input
                          type="text"
                          placeholder={`User ${index + 1} Phone Number`}
                          value={user.phoneNumber}
                          onChange={(e) =>
                            handleUserInputChange(
                              index,
                              "phoneNumber",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="user-input">
                        <input
                          type="number"
                          placeholder={`Amount (₹)`}
                          value={user.amount}
                          onChange={(e) =>
                            handleUserInputChange(
                              index,
                              "amount",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p>
                Total Amount Needed to be Paid (₹): ₹{totalAmount.toFixed(2)}
              </p>
              <p>
                Total Amount Entered by Users (₹): ₹{totalUserAmount.toFixed(2)}
              </p>
              <p>
                Amount Remaining (₹): ₹
                {(totalAmount - totalUserAmount).toFixed(2)}
              </p>
              <button
                className="pay-money-button"
                onClick={handlePayMoneyClick}
              >
                Pay Money
              </button>
            </>
          </div>
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
