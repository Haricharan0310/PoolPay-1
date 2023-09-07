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
import LoanRequestForm from "./LoanRequestForm";
import Modal from 'react-modal';
import Login from "./Login";
import app from "../firebase";
import "./CoLoanPage.css"; // Import your CSS file for styling

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
    const q = query(collection(db, "loanRequests"), orderBy("timestamp", "desc"));
    const unsubscribeFirestore = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLoanRequests(requests);
    });

    return () => {
      // Unsubscribe from Firebase Auth and Firestore queries when the component unmounts
      unsubscribe();
      unsubscribeFirestore();
    };
  }, []);

  const handleLoanFormOpen = () => {
    setShowLoanForm(true);
  };

  const handleLoanFormClose = () => {
    setShowLoanForm(false);
  };

  const handleTotalAmountInputChange = (e) => {
    setTotalAmount(parseFloat(e.target.value));
  };

  const handleNumUsersPoolingChange = (e) => {
    const numUsers = parseInt(e.target.value);
    setNumUsersPooling(numUsers);
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

  const handlePhoneNumberInputChange = (e) => {
    setPhoneNumberToPay(e.target.value);
  };

  const handleLoanButtonClick = (loanRequest) => {
    // Placeholder: Display a success message for the loan
    //alert(`Loan provided to user: ${loanRequest.user}`);
    setShowAmountForm(true);
  };

  const handleSignOut = () => {
    signOut(auth);
  };

  const handleUserInputChange = (index, field, value) => {
    // Update the user object with the new value at the specified index
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
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

  return (
    <div className="co-loan-container">
      <div className="co-loan-welcome">
        {user ? (
          <div>
            <h2>Welcome, {user.displayName}</h2>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div>
            <h2>Welcome to Co Loan</h2>
            <Login /> {/* Render the Login component */}
          </div>
        )}

        <button onClick={handleLoanFormOpen}>Request Loan</button>

        {showLoanForm && (
          <LoanRequestForm onSubmit={handleLoanFormSubmit} onClose={handleLoanFormClose} />
        )}
      </div>

      <div className="co-loan-dashboard">
        {/* Display loan requests as cards */}
        {loanRequests.map((request) => (
          <div key={request.id} className="loan-card">
            <div className="card-content">
              <strong>User:</strong> {request.user}<br />
              <strong>Amount:</strong> {request.amount}<br />
              <strong>Info:</strong> {request.info}<br />
            </div>
            <button onClick={() => handleLoanButtonClick(request)}>Loan</button> {/* Loan button */}
            
        {showAmountForm && (
          <Modal
          isOpen={showAmountForm}
          onRequestClose={() => setShowAmountForm(false)}
          style={customStyles}
        >
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
  
          <button onClick={() => setShowAmountForm(false)}>Close</button>
        </Modal>
        )}
      
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoLoanPage;
