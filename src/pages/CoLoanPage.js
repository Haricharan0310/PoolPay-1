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
import "./CoLoanPage.css"; // Import your CSS file for styling
import parsePhoneNumber from 'libphonenumber-js';
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from 'file-saver';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [lenderName, setLenderName] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [duration, setDuration] = useState("");
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


  

 
  
  

 

  const handleLoanButtonClick = (loanRequest) => {
    // Placeholder: Display a success message for the loan
    //alert(`Loan provided to user: ${loanRequest.user}`);
    setShowAmountForm(true);
  };

  const handleSignOut = () => {
    signOut(auth);
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
    // Load your Word document template (replace "your_template.docx" with the actual path)
    fetch("./AutoDocumentation.docx")
      .then((response) => response.arrayBuffer())
      .then((templateData) => {
        // Create a buffer from the template data
        const buffer = new Uint8Array(templateData);
  
        // Create a Docxtemplater instance with the template buffer
        const doc = new Docxtemplater();
        doc.loadZip(buffer);
  
        // Provide data to fill placeholders in the template
        const data = {
          lenderName,
          borrowerName,
          duration,
          amount: totalAmount.toFixed(2), // Assuming totalAmount is a number
        };
  
        // Set the data in the template
        doc.setData(data);
  
        try {
          // Render the document (replace "your_output.docx" with the desired output file name)
          doc.render();
          const outputBlob = doc.getZip().generate({
            mimeType: "application/",
          });
  
          // Save the Blob as a downloadable file
          saveAs(outputBlob, "loan_agreement.docx");
        } catch (error) {
          // Handle errors during document generation
          console.error("Error generating document:", error);
        }
      });
  };

  return (
    <div className="co-loan-container">
      

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

export default CoLoanPage;
