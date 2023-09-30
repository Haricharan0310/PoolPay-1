import React, { useState } from "react";
import "./LoanRequestForm.css";

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
      <h2 className="heading">Loan Request Form</h2>
      <div >
        <label className="labell">User :</label>
        <input className="box1"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
      </div>
      <div>
        <label className="labell">Amount :</label>
        <input className="box2"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label className="labell">Information :</label>
        <textarea className="box3"
          value={info}
          onChange={(e) => setInfo(e.target.value)}
        />
      </div>
      <button onClick={handleSubmit}className="submit">Submit</button>
      <button onClick={onClose}className="cancel">Cancel</button>
    </div>
  );
};

export default LoanRequestForm;
