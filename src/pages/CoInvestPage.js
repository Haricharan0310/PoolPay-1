import React, { useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Modal from 'react-modal';
import app from "../firebase";
import LoanRequestForm from "./LoanRequestForm";
import "./CoLoanPage.css"; // Import your CSS file for styling
import parsePhoneNumber from 'libphonenumber-js';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';

const auth = getAuth(app);
const db = getFirestore(app);

const CoInvestPage = () => {
  const [user, setUser] = useState(null);
  const [investRequests, setInvestRequests] = useState([]);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showInvestForm, setShowInvestForm] = useState(false);
  const [showAmountForm, setShowAmountForm] = useState(false);
  const [phoneNumberToPay, setPhoneNumberToPay] = useState("");
  const [numUsersPooling, setNumUsersPooling] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalUserAmount, setTotalUserAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [lenderName, setLenderName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [duration, setDuration] = useState("");
  const [interest, setInterest] = useState("");
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white",
      color: "black",
      width: 400,
      maxHeight: "calc(100vh-210px)",
      overflowY: "auto"
    },
  };

  useEffect(() => {
    // Calculate the totalUserAmount (sum of userAmounts)
    const sum = users.reduce((acc, user) => acc + parseFloat(user.amount), 0);
    setTotalUserAmount(sum);
  }, [users]);


  useEffect(() => {
    // Check the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null); // Reset the user state
      }
    });

    // Retrieve loan requests from Firestore, ordered by timestamp
    const q = query(collection(db, "investRequests"), orderBy("timestamp", "desc"));
    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setInvestRequests(requests);
    });

    return () => {
      // Unsubscribe from Firebase Auth and Firestore queries when the component unmounts
      unsubscribe();
      unsubscribeFirestore();
    };
  }, []);


  

 
  
  

 

  const handleInvestButtonClick = (investRequest) => {
    // Placeholder: Display a success message for the loan
    //alert(`Loan provided to user: ${loanRequest.user}`);
    setShowAmountForm(true);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleInvestFormOpen = () => {
    setShowInvestForm(true);
  };
  const handleInvestFormClose = () => {
    setShowInvestForm(false);
  };
  const handleInvestFormSubmit = async (investRequest) => {
    try {
      // Add the loan request to Firestore
      const investRequestsCollection = collection(db, "investRequests");
      await addDoc(investRequestsCollection, {
        ...investRequest,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error adding invest request:", error);
    }
  };

  const handlePayMoneyClick = () => {
    // Check if the total amount and totalUserAmount match before proceeding with payment
    if (totalAmount === totalUserAmount && totalAmount !== 0) {
      // Implement your logic for payment here
      // For example, you can display a confirmation message
      alert("Payment Successful!");
      setShowAmountForm(false);
    } else {
      alert(
        "Please ensure the total amount and user amounts match before proceeding with payment."
      );
    }
  };
  const validatePhoneNumber = (phoneNumber) => {
    try {
      const parsedPhoneNumber = parsePhoneNumber(phoneNumber);
      const isValid = parsedPhoneNumber.isValid();
      return isValid;
    } catch (error) {
      return false;
    }
  };
  
  
  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  

  // Add onChange handlers for lenderName, borrowerName, and duration
  const handleLenderNameInputChange = (e) => {
    setLenderName(e.target.value);
  };

  const handleBorrowerNameInputChange = (e) => {
    setBorrowerName(e.target.value);
  };

  const handleDurationInputChange = (e) => {
    setDuration(e.target.value);
  };
  const handleInterestInputChange = (e) => {
    setInterest(e.target.value);
  };
  const renderPayByPhoneStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <label>Enter Phone Number to Send Money To:</label>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumberToPay}
              onChange={handlePhoneNumberInputChange}
            />
            <button onClick={handleNextStep} disabled={!isPhoneNumberValid}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <label>Enter Total Amount (₹):</label>
            <input
              type="number"
              placeholder="Total Amount"
              value={totalAmount}
              onChange={handleTotalAmountInputChange}
            />
            <label>Lender's Name:</label>
            <input
              type="text"
              placeholder="Lender's Name"
              value={lenderName}
              onChange={handleLenderNameInputChange}
            />
            <label>Borrower's Name:</label>
            <input
              type="text"
              placeholder="Borrower's Name"
              value={borrowerName}
              onChange={handleBorrowerNameInputChange}
            />
            <label>Duration (months):</label>
            <input
              type="number"
              placeholder="Duration"
              value={duration}
              onChange={handleDurationInputChange}
            />
             <label>Interest (in %):</label>
            <input
              type="number"
              placeholder="Interest"
              value={interest}
              onChange={handleInterestInputChange}
            />

            <button onClick={handleNextStep}>Next</button>
          </div>
          
        );
      case 3:
        return (
          <div>
            <label>Number of Users Pooling Money:</label>
            <input
              type="number"
              placeholder="Number of Users"
              value={numUsersPooling}
              onChange={handleNumUsersPoolingChange}
            />
            <button onClick={handleNextStep}>Next</button>
          </div>
        );
      case 4:
        return (
          <div>
            {/* Render user input fields here */}
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
                      handleUserInputChange(index, "phoneNumber", e.target.value)
                    }
                  />
                </div>
                <div className="user-input">
                  <input
                    type="number"
                    placeholder={`Amount (₹)`}
                    value={user.amount}
                    onChange={(e) =>
                      handleUserInputChange(index, "amount", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <button className="add-users-button" onClick={handleAddUserClick}>
              Add Users
            </button>
            <button onClick={handlePrevStep}>Previous</button>
            <button onClick={handleNextStep}>Next</button>
          </div>
        );
      case 5:
        return (
          <div>
            <p>Total Amount Needed to be Paid (₹): ₹{totalAmount.toFixed(2)}</p>
            <p>
              Total Amount Entered by Users (₹): ₹{totalUserAmount.toFixed(2)}
            </p>
            <p>
              Amount Remaining (₹): ₹
              {(totalAmount - totalUserAmount).toFixed(2)}
            </p>
            <button className="pay-money-button" onClick={handleGenerateDocument}>
              Pay Money
            </button>
            <button onClick={handlePrevStep}>Previous</button>
          </div>
        );
      default:
        return null;
    }
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
    const newPhoneNumber = e.target.value;
  const isValid = validatePhoneNumber(newPhoneNumber);
  setPhoneNumberToPay(newPhoneNumber); // Update the phone number state
  setIsPhoneNumberValid(isValid);

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

  const handleGenerateDocument = () => {
    const data = {
      lenderName,
      borrowerName,
      duration,
      amount: totalAmount.toFixed(2),
      interest,
    };
    const htmlTemplate = `
    <html>
      <head>
        <title>Lending Agreement</title>
      </head>
      <body>
        <h1>DRAFT OF LENDING AGREEMENT</h1>
        <p>LENDING AGREEMENT BETWEEN</p>
        <p>${lenderName}</p>
        <p>AND</p>
        <p>${borrowerName}</p>
        <p>THIS AGREEMENT made BETWEEN ${lenderName} hereinafter called "the Lender" AND ${borrowerName} hereinafter called "the Borrower" and reference to the parties hereto shall mean and include their respective heirs, executors, administrators and assigns;</p>
        <p>WHEREAS the Borrower is in need of funds and hence has approached the Lender to grant him/her an interest-free loan of Rs.${totalAmount}/- for a period of ${duration}</p>
        <p>AND WHEREAS the Lender has agreed to grant a loan to the Borrower, with an interest of ${interest}%;</p>
        <p>AND WHEREAS the parties hereto are desirous of recording the terms and conditions of this loan in writing;</p>
        <p>NOW THIS AGREEMENT WITNESSETH and it is hereby agreed by and between the parties hereto as under:</p>
        <p>1. The Borrower hereto, being in need of money, has requested the Lender to give him/her a loan of Rs.${totalAmount}/- with interest ${interest}%, to which the Lender has agreed.</p>
        <p>2. The said loan is repaid by the Borrower for a period of ${duration} months.</p>
        <p>3. The terms and conditions of this Agreement are arrived at by the mutual consent of the parties hereto.</p>
        <p>*Terms and Conditions:*</p>
        <p>1. The Lender, ${lenderName}, agrees to lend the Borrower, ${borrowerName}, the sum of Rs.${totalAmount}/- with an interest of ${interest}%.</p>
        <p>2. The Borrower acknowledges receiving the loan and agrees to repay the full amount, including interest, before ${duration}.</p>
        <p>3. The Borrower shall make repayment in a single installment before ${duration}. Failure to repay on time may result in additional charges or penalties.</p>
        <p>4. Both parties agree to abide by all applicable laws and regulations governing this loan transaction.</p>
        <p>*Note:* This document is a legally binding agreement. Please read and understand the terms.</p>
        <!-- Lender's Signature -->
       <h4> <p>Lender's Signature: ${lenderName}</p>
        <!-- Borrower's Signature -->
        <p>Borrower's Signature:${borrowerName}</p></h4>
      </body>
    </html>
  `;

  // Create a Blob from the HTML content
  const blob = new Blob([htmlTemplate], { type: 'text/html' });

  // Create a URL for the Blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'invest_agreement.html';
  a.style.display = 'none';

  // Trigger the download
  document.body.appendChild(a);
  a.click();

  // Clean up
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);

  };


  return (
    <div className="co-loan-container">
      
      <div className="co-loan-welcome"><button onClick={handleInvestFormOpen}>Request Investment</button>

{showInvestForm && (
  <LoanRequestForm onSubmit={handleInvestFormSubmit} onClose={handleInvestFormClose} />
)}</div>
      <div className="co-loan-dashboard">
      
        {/* Display loan requests as cards */}
        {investRequests.map((request) => (
          <div key={request.id} className="loan-card">
            <div className="card-content">
              <strong>User:</strong> {request.user}<br />
              <strong>Amount:</strong> {request.amount}<br />
              <strong>Info:</strong> {request.info}<br />
              
            </div>
            <button onClick={() => handleInvestButtonClick(request)}>Invest</button> {/* Loan button */}
            
        {showAmountForm && (
          <Modal
          isOpen={showAmountForm}
          onRequestClose={() => setShowAmountForm(false)}
          style={customStyles}
        >
          <div className="pay-by-phone">{renderPayByPhoneStep()}</div>
  
          <button onClick={() => setShowAmountForm(false)}>Close</button>
        </Modal>
        )}
      
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoInvestPage;
