import React, { useState, useEffect } from "react";
import "./CoSpendPage.css";
import parsePhoneNumber from "libphonenumber-js";

import { decodeQRCode } from "./qrCodeUtils";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useRef } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props) => {
  const html5QrcodeScannerRef = useRef(null);

  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Success callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw new Error("qrCodeSuccessCallback is a required callback.");
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScannerRef.current = html5QrcodeScanner;
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScannerRef.current.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={qrcodeRegionId} />;
};
const CoSpendPage = () => {
  const [showGroupImage, setShowGroupImage] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [currentScanStep, setScanStep] = useState(0);
  const [showScanner, setShowScanner] = useState(false);
  const [uploadedQRCodeImage, setUploadedQRCodeImage] = useState(null);
  const [scannedPhoneNumber, setScannedPhoneNumber] = useState("");
  const [showPayByPhoneNumber, setShowPayByPhoneNumber] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [users, setUsers] = useState([]);
  const [phoneNumberToPay, setPhoneNumberToPay] = useState("");
  const [numUsersPooling, setNumUsersPooling] = useState(0);
  const [totalUserAmount, setTotalUserAmount] = useState(0);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);

  const [decodedResults, setDecodedResults] = useState(null);

  useEffect(() => {
    // Calculate the totalUserAmount (sum of userAmounts)
    const sum = users.reduce((acc, user) => acc + parseFloat(user.amount), 0);
    setTotalUserAmount(sum);
  }, [users]);

  const handleUploadQRCode = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataURL = event.target.result;
        setUploadedQRCodeImage(dataURL);
        setScannedPhoneNumber(""); // Clear previously scanned phone number
      };
      reader.readAsDataURL(file);
    }
  };

  function scanNextStepHandler() {
    setScanStep(currentScanStep + 1);
  }
  function scanPrevStepHandler() {
    setScanStep(currentScanStep - 1);
  }

  const handleScanQRCode = async () => {
    if (uploadedQRCodeImage) {
      try {
        const phoneNumber = await decodeQRCode(uploadedQRCodeImage);

        if (phoneNumber) {
          setScannedPhoneNumber(phoneNumber);
        } else {
          alert("Failed to decode QR code. Please try again.");
        }
      } catch (error) {
        console.error("Error decoding QR code:", error);
        alert("An error occurred while decoding the QR code.");
      }
    } else {
      alert("Please upload a QR code image first.");
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

  //extracting text

  const onNewScanResult = (decodedText, decodedResult) => {
    // alert(decodedText)
    setPhoneNumberToPay(decodedText);
    setIsPhoneNumberValid(validatePhoneNumber(decodedText));
    setDecodedResults(decodedText);
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
  const renderPayByScanStep = () => {
    switch (currentScanStep) {
      case 1:
        return (
          <div>
            <div className="pay-by-phone">
              <label>Enter Phone Number to Send Money To:</label>
              <input
                type="text"
                placeholder="Phone Number"
                value={phoneNumberToPay}
                onChange={handlePhoneNumberInputChange}
              />
              <button
                onClick={scanNextStepHandler}
                disabled={!isPhoneNumberValid}
              >
                Next
              </button>
            </div>
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
            <button onClick={scanNextStepHandler}>Next</button>
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
            <button onClick={scanNextStepHandler}>Next</button>
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
            <button onClick={scanPrevStepHandler}>Previous</button>
            <button onClick={scanNextStepHandler}>Next</button>
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
            <button className="pay-money-button" onClick={handlePayMoneyClick}>
              Send Requests
            </button>
            <button onClick={scanPrevStepHandler}>Previous</button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleScanAndPayClick = () => {
    setShowScanner(true);
    setShowPayByPhoneNumber(false);
    setSelectedContact(null);
    setTotalAmount(0);
    setUsers([]);

    // Add this to hide the Group32.png image when the button is clicked
    setShowGroupImage(false);
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

  const handleKevinClick = ({ phoneNumber }) => {
    setSelectedContact({ phoneNumber: phoneNumber });
    setShowPayByPhoneNumber(true); // Assuming you want to proceed with payment after selecting Kevin
  };

  return (
    <div className="co-spend-container">
      {/* Left Side */}
      <div className="co-spend-buttons">
        <button className="co-spend-button" onClick={handleScanAndPayClick}>
          <div>
            <img src="./images/Qrcode.svg" />
          </div>{" "}
          Scan & Pay
        </button>

        <button
          className="co-spend-button"
          onClick={handlePayByPhoneNumberClick}
        >
          <div>
            <img src="./images/Phone call.svg" />
          </div>{" "}
          Pay by Phone Number
        </button>
      </div>

      {/* Right Side */}
      <div className="co-spend-welcome">
        {showGroupImage && ( // Conditionally render the Group32.png image
          <img src="./images/Group32.png" alt="Group Image" />
        )}
        {showScanner ? (
          currentScanStep == 0 ? (
            <div className="scanner">
              <Html5QrcodePlugin
                fps={10}
                qrbox={250}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
              />

              {decodedResults && (
                <button onClick={() => scanNextStepHandler()}>Next</button>
              )}

              {/* <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUploadQRCode(e.target.files[0])}
            /> */}
              {uploadedQRCodeImage ? (
                <>
                  <img src={uploadedQRCodeImage} alt="Uploaded QR Code" />
                  <button onClick={handleScanQRCode}>Scan QR Code</button>
                  {scannedPhoneNumber && (
                    <div>
                      <label>Scanned Phone Number:</label>
                      <input type="text" value={scannedPhoneNumber} readOnly />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <p>Scan or Upload a QR code image to scan</p>
                </>
              )}
            </div>
          ) : (
            <>{renderPayByScanStep()}</>
          )
        ) : showPayByPhoneNumber ? (
          <div className="pay-by-phone">{renderPayByPhoneStep()}</div>
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
          <h1></h1>
        )}
      </div>
    </div>
  );
};

export default CoSpendPage;
