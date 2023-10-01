import Button from "../components/common/Button";
import React, { useState,useRef,useEffect } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useSocketRef } from "./contextProvider/SocketProvider";

const Login = () => {
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const [showMobileInput, setShowMobileInput] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const socketRef = useSocketRef();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // After successful Google Sign-In, show the mobile number input
      setShowMobileInput(true);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleMobileNumberChange = (e) => {
    setMobileNumber(e.target.value);
  };

  const handleMobileNumberSubmit = () => {
    console.log("Mobile Number:", mobileNumber);
    sessionStorage.setItem("mobileNumber", mobileNumber);
    if (socketRef.current) {
      const mobileNumber = sessionStorage.getItem("mobileNumber");
      socketRef.current.emit("joinPool", mobileNumber);
    }
    setShowMobileInput(false);

  };

  return (
    <div>
      <Button onClick={handleGoogleSignIn} buttonText="Start Pooling" />
      {showMobileInput && (
        <div className="bg-white p-4 ">
          <input
            type="tel"
            placeholder="Enter your mobile number"
            value={mobileNumber}
            onChange={handleMobileNumberChange}
            className=" text-white rounded-lg border-2 border-gray-300 p-2"
          />
          <button
            onClick={handleMobileNumberSubmit}
            className="bg-black text-white rounded-lg px-4 py-2 mt-2"
          >
            Confirm Number
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
