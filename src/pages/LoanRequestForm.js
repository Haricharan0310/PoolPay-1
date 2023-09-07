import React, { useState } from "react";

const LoanRequestForm = ({ onSubmit, onClose }) => {
  const [user, setUser] = useState("");
  const [amount, setAmount] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = () => {
    // Validate form input (you can add more validation as needed)
    if (user.trim() === "" || isNaN(parseFloat(amount)) || amount <= 0) {
      alert("Please enter valid user and amount.");
      return;
    }

    // Create a loan request object
    const loanRequest = {
      user,
      amount: parseFloat(amount),
      info,
    };

    // Call the onSubmit function with the loan request object
    onSubmit(loanRequest);

    // Clear the form fields
    setUser("");
    setAmount("");
    setInfo("");

    // Close the form
    onClose();
  };

  return (
    <div className="loan-request-form">
      <h3>Loan Request Form</h3>
      <div>
        <label>User:</label>
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label>Additional Info:</label>
        <textarea
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}>Submit Request</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default LoanRequestForm;
