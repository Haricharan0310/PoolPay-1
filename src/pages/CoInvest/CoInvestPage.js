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
import "../CoInvest/CoInvestPage.css"; // Import your CSS file for styling
import parsePhoneNumber from "libphonenumber-js";

const auth = getAuth(app);
const db = getFirestore(app);

const CoInvestPage = () => {
  // Remove the parameter here
  const profilePictures = [
    "./images/img1.svg",
    "./images/img2.svg",
    "./images/img3.svg",
    "./images/img4.svg",
    "./images/img5.svg",
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvestRequests, setFilteredInvestRequests] = useState([]);

  const handleSearch = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);

    // Filter the investRequests based on the search term
    const filtered = investRequests.filter((request) =>
      request.user.toLowerCase().includes(newSearchTerm.toLowerCase())
    );

    setFilteredInvestRequests(filtered);
  };
  const [user, setUser] = useState(null);
  const [investRequests, setInvestRequests] = useState([]);
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
      overflowY: "auto",
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
    const q = query(
      collection(db, "investRequests"),
      orderBy("timestamp", "desc")
    );
    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
            <button
              className="pay-money-button"
              onClick={handleGenerateDocument}
            >
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
        <h1>DRAFT OF LENDING AGREEMENT</h1>
        <p>LENDING AGREEMENT BETWEEN</p>
        <p><span class="highlight-placeholder size">${lenderName}</span></p>
        <p>AND</p>
        <p><span class="highlight-placeholder size">${borrowerName}</span></p>
        <p>THIS AGREEMENT made BETWEEN <span class="highlight-placeholder">${lenderName} </span> hereinafter called "the Lender" AND <span class="highlight-placeholder">${borrowerName} </span> hereinafter called "the Borrower" and reference to the parties hereto shall mean and include their respective heirs, executors, administrators and assigns;</p>
        <p>WHEREAS the Borrower is in need of funds and hence has approached the Lender to grant him/her an interest-free loan of Rs.<span class="highlight-placeholder">${totalAmount}/-</span> for a period of <span class="highlight-placeholder">${duration}</span></p>
        <p>AND WHEREAS the Lender has agreed to grant a loan to the Borrower, with an interest of <span class="highlight-placeholder">${interest}% </span>;</p>
        <p>AND WHEREAS the parties hereto are desirous of recording the terms and conditions of this loan in writing;</p>
        <p>NOW THIS AGREEMENT WITNESSETH and it is hereby agreed by and between the parties hereto as under:</p>
        <p>1. The Borrower hereto, being in need of money, has requested the Lender to give him/her a loan of Rs.<span class="highlight-placeholder">${totalAmount}/-</span> with interest <span class="highlight-placeholder">${interest}% </span>, to which the Lender has agreed.</p>
        <p>2. The said loan is repaid by the Borrower for a period of <span class="highlight-placeholder">${duration}</span> months.</p>
        <p>3. The terms and conditions of this Agreement are arrived at by the mutual consent of the parties hereto.</p>
        <p>*Terms and Conditions:*</p>
        <p>1. The Lender, <span class="highlight-placeholder">${lenderName} </span>, agrees to lend the Borrower, <span class="highlight-placeholder">${borrowerName} </span>, the sum of Rs.<span class="highlight-placeholder">${totalAmount}/-</span> with an interest of<span class="highlight-placeholder">${interest}% </span>.</p>
        <p>2. The Borrower acknowledges receiving the loan and agrees to repay the full amount, including interest, before <span class="highlight-placeholder">${duration}</span>.</p>
        <p>3. The Borrower shall make repayment in a single installment before <span class="highlight-placeholder">${duration}</span>. Failure to repay on time may result in additional charges or penalties.</p>
        <p>4. Both parties agree to abide by all applicable laws and regulations governing this loan transaction.</p>
        <p>*Note:* This document is a legally binding agreement. Please read and understand the terms.</p>
        <!-- Lender's Signature -->
       <h4> <p>Lender's Signature: <span class="highlight-placeholder">${lenderName} </span></p>
        <!-- Borrower's Signature -->
        <p>Borrower's Signature:<span class="highlight-placeholder">${borrowerName} </span></p></h4>
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
    a.download = "invest_agreement.html";
    a.style.display = "none";

    // Trigger the download
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="co-invest-container">
      <div className="search-bar">
        <img
          className="search-icon"
          src="./images/searchsvg.svg"
          alt="Search Icon"
        />
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="co-loan-dashboard">
        {searchTerm === ""
          ? investRequests.map((request) => (
              <div key={request.id} className="loan-card">
                <div className="profile-info">
                  <div className="profile-picture">
                    <img
                      src={
                        profilePictures[
                          Math.floor(Math.random() * profilePictures.length)
                        ]
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="user-info">
                    <strong className="username">{request.user}</strong>
                    <p className="info">{request.info}</p>
                  </div>
                </div>

                <div className="amount">
                  <strong className="amount-label">Amount:</strong>
                  <span className="amount-value">{request.amount}</span>
                </div>

                <button onClick={() => handleInvestButtonClick(request)}>
                  Invest
                </button>

                {showAmountForm && (
                  <Modal
                    isOpen={showAmountForm}
                    onRequestClose={() => setShowAmountForm(false)}
                    style={customStyles}
                  >
                    <div className="pay-by-phone">{renderPayByPhoneStep()}</div>
                    <button onClick={() => setShowAmountForm(false)}>
                      Close
                    </button>
                  </Modal>
                )}
              </div>
            ))
          : filteredInvestRequests.map((request) => (
              <div key={request.id} className="loan-card">
                <div className="profile-info">
                  <div className="profile-picture">
                    <img
                      src={
                        profilePictures[
                          Math.floor(Math.random() * profilePictures.length)
                        ]
                      }
                      alt="Profile"
                    />
                  </div>
                  <div className="user-info">
                    <strong className="username">{request.user}</strong>
                    <p className="info">{request.info}</p>
                  </div>
                </div>

                <div className="amount">
                  <strong className="amount-label">Amount:</strong>
                  <span className="amount-value">{request.amount}</span>
                </div>

                <button onClick={() => handleInvestButtonClick(request)}>
                  Invest
                </button>

                {showAmountForm && (
                  <Modal
                    isOpen={showAmountForm}
                    onRequestClose={() => setShowAmountForm(false)}
                    style={customStyles}
                  >
                    <div className="pay-by-phone">{renderPayByPhoneStep()}</div>
                    <button onClick={() => setShowAmountForm(false)}>
                      Close
                    </button>
                  </Modal>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};
export default CoInvestPage;
