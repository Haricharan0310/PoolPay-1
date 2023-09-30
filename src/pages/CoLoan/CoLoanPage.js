import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import Modal from "react-modal";
import app from "../../firebase";
import LoanRequestForm from "../LoanRequestForm";
import "./CoLoanPage.css";
import parsePhoneNumber from "libphonenumber-js";

const auth = getAuth(app);
const db = getFirestore(app);

const CoLoanPage = () => {
  const [user, setUser] = useState(null);
  const [loanRequests, setLoanRequests] = useState([]);
  const [showLoanForm, setShowLoanForm] = useState(false);
  const [showAmountForm, setShowAmountForm] = useState(false);
  const [phoneNumberToPay, setPhoneNumberToPay] = useState("");
  const [numUsersPooling, setNumUsersPooling] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalUserAmount, setTotalUserAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [lenderName, setLenderName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [duration, setDuration] = useState("");
  const [isRightSideImageVisible, setIsRightSideImageVisible] = useState(true);

  // const customStyles = {
  //   content: {
  //     top: "50%",
  //     left: "50%",
  //     right: "auto",
  //     bottom: "auto",
  //     marginRight: "-50%",
  //     transform: "translate(-50%, -50%)",
  //     backgroundColor: "white",
  //     color: "black",
  //     width: 400,
  //     maxHeight: "calc(100vh-210px)",
  //     overflowY: "auto",
  //   },
  // };

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
    const q = query(
      collection(db, "loanRequests"),
      orderBy("timestamp", "desc")
    );
    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLoanRequests(requests);
    });

    return () => {
      // Unsubscribe from Firebase Auth and Firestore queries when the component unmounts
      unsubscribe();
      unsubscribeFirestore();
    };
  }, []);

  const handleLoanButtonClick = (loanRequest) => {
    // Placeholder: Display a success message for the loan
    //alert(`Loan provided to user: ${loanRequest.user}`);
    setShowAmountForm(true);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleLoanFormOpen = () => {
    setShowLoanForm(true);
  };
  const handleLoanFormClose = () => {
    setShowLoanForm(false);
  };
  const handleLoanFormSubmit = async (loanRequest) => {
    try {
      // Add the loan request to Firestore
      const loanRequestsCollection = collection(db, "loanRequests");
      await addDoc(loanRequestsCollection, {
        ...loanRequest,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error adding loan request:", error);
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

  const handleLenderNameInputChange = (e) => {
    setLenderName(e.target.value);
  };

  const handleBorrowerNameInputChange = (e) => {
    setBorrowerName(e.target.value);
  };

  const handleDurationInputChange = (e) => {
    setDuration(e.target.value);
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderRequestLoanWithFriendsStep = () => {
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
            <button onClick={handlePrevStep}>Previous</button>
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
            <button onClick={handlePrevStep}>Previous</button>
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
                      handleUserInputChange(index, "amount", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
            <button className="add-users-button" onClick={handleAddUserClick}>
              Add Users
            </button>
            <p>Total Amount Needed to be Paid (₹): ₹{totalAmount.toFixed(2)}</p>
            <p>
              Total Amount Entered by Users (₹): ₹{totalUserAmount.toFixed(2)}
            </p>
            <p>
              Amount Remaining (₹): ₹
              {(totalAmount - totalUserAmount).toFixed(2)}
            </p>
            <button onClick={handlePrevStep}>Previous</button>
            <button onClick={handleNextStep}>Next</button>
          </div>
        );
      case 5:
        return (
          <div>
            <button className="pay-money-button" onClick={handlePayMoneyClick}>
              Pay Money
            </button>
            <button onClick={handlePrevStep}>Previous</button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleSubmitLoanRequest = async () => {
    try {
      // Create the loan request object
      const loanRequest = {
        lenderName,
        borrowerName,
        duration,
        totalAmount,
        users,
      };

      // Place your logic here to submit the loan request, e.g., sending it to a server or Firestore
      // For example:
      // await submitLoanRequestToServer(loanRequest);

      // Display a success message or redirect the user to a confirmation page
      alert("Loan request submitted successfully!");
    } catch (error) {
      console.error("Error submitting loan request:", error);
      alert("An error occurred while submitting the loan request.");
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
      amount: totalAmount.toFixed(2), // Assuming totalAmount is a number
    };
    const htmlTemplate = `
    <html>
      <head>
        <title>Loan Agreement</title>
        <style>
        div{
          text-align:left;
          padding-left:100px;
          padding-right:100px;
        }
    body {
      text-align:center;
      align-items: center;
      height: 100vh; /* 100% viewport height for vertical centering */
      margin: 0; /* Remove default margin for horizontal centering */
    }
    .highlight-placeholder {
      font-weight: bold; /* Change the background color to your preference */
    }
    .size{
      font-size:22px;
    }
    /* Add any additional CSS styles as needed */
  </style>
      </head>
      <body>
        <h1>DRAFT OF LOAN AGREEMENT</h1>
        <p>LOAN AGREEMENT BETWEEN</p>
        <p><span class="highlight-placeholder size">${lenderName}</span></p>
        <p>AND</p>
        <p><span class="highlight-placeholder size">${borrowerName}</span></p>
        <div>
        <p>THIS AGREEMENT made BETWEEN <span class="highlight-placeholder">${lenderName} </span>hereinafter called "the Lender" AND <span class="highlight-placeholder">${borrowerName} </span> hereinafter called "the Borrower" and reference to the parties hereto shall mean and include their respective heirs, executors, administrators and assigns;</p>
        <p>WHEREAS the Borrower is in need of funds and hence has approached the Lender to grant him/her an interest-free loan of Rs.<span class="highlight-placeholder">${totalAmount}/-</span> for a period of <span class="highlight-placeholder">${duration}</span></p>
        <p>AND WHEREAS the Lender has agreed to grant a loan to the Borrower, free of interest, as the Lender and the Borrower have known each other for enough time;</p>
        <p>AND WHEREAS the parties hereto are desirous of recording the terms and conditions of this loan in writing;</p>
        <p>NOW THIS AGREEMENT WITNESSETH and it is hereby agreed by and between the parties hereto as under:</p>
        <p>1. The Borrower hereto, being in need of money, has requested the Lender to give her an interest-free loan of <span class="highlight-placeholder">Rs.${totalAmount}/-</span>, to which the Lender has agreed.</p>
        <p>2. The said loan is required by the Borrower for a period of <span class="highlight-placeholder">${duration} months</span>.</p>
        <p>3. The terms and conditions of this Agreement are arrived at by the mutual consent of the parties hereto.</p>
        <p>*Terms and Conditions:*</p>
        <p>1. The Lender, <span class="highlight-placeholder">${lenderName}</span>, agrees to lend the Borrower, <span class="highlight-placeholder">${borrowerName}</span>, the sum of <span class="highlight-placeholder">Rs.${totalAmount}/- </span>.</p>
        <p>2. The Borrower acknowledges receiving the loan and agrees to repay the full amount, including interest, before <span class="highlight-placeholder">${duration}</span>.</p>
        <p>3. The Borrower shall make repayment in a single installment before <span class="highlight-placeholder">${duration} months</span>. Failure to repay on time may result in additional charges or penalties.</p>
        <p>4. Both parties agree to abide by all applicable laws and regulations governing this loan transaction.</p>
        <p>*Note:* This document is a legally binding agreement. Please read and understand the terms.</p>
        </div>
        <!-- Lender's Signature -->
       <h4> <p>Lender's Signature: ${lenderName}</p>
        <!-- Borrower's Signature -->
        <p>Borrower's Signature:${borrowerName}</p></h4>
      </body>
    </html>
  `;

    // Create a Blob from the HTML content
    const blob = new Blob([htmlTemplate], { type: "text/html" });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "loan_agreement.html";
    a.style.display = "none";

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="co-spend-container">
      {/* left side */}
      <div className="co-spend-buttons">
        <button className="co-spend-button" onClick={handleLoanFormOpen}>
          Request Loan Globally
        </button>
        {/* New "Request Loan With Friends" button */}
        <button
          className="co-spend-button"
          onClick={() => {
            setCurrentStep(1);
            setIsRightSideImageVisible(false);
          }} // Start the process from step 1
        >
          Request Loan With Friends
        </button>

        {showLoanForm && (
          <LoanRequestForm
            onSubmit={handleLoanFormSubmit}
            onClose={handleLoanFormClose}
          />
        )}
      </div>
      {/* Right side */}
      <div className="co-spend-welcome">
        {isRightSideImageVisible && <img src="./images/Group 10.svg" />}
      </div>
      <div className="pay-by-phone">
        {/* Display the loan request with friends steps */}
        {currentStep > 0 && renderRequestLoanWithFriendsStep()}
      </div>
    </div>
  );
};

export default CoLoanPage;
