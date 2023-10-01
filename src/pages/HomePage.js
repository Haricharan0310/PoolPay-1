import React, { useState, useEffect } from "react";
import HeroSection from "../components/common/HeroSection";
import Header from "../components/common/Header";
import ProductShowcase from "../components/common/ProductShowcase/productshowcase";
import FeelSpecial from "../components/Feelspecial/feelspecial";
import WindowPeak from "../components/peekWindow/peekwindow";
import MobileScroll from "../components/MobileScroll/mobilescroll";
import Footer from "../components/footer/footer";
import PaymentModal from "./PaymentModal";
import { io } from "socket.io-client";
import { useSocketRef } from "./contextProvider/SocketProvider";
const HomePage = () => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const socket = useSocketRef();

  console.log(socket.current);
  const handleConfirmPayment = () => {
    // Trigger a socket event for payment confirmation
    socket.current.emit("paymentAccepted", { status: "confirmed" });
    setIsPaymentModalOpen(false);
  };

  // Function to handle payment decline
  const handleDeclinePayment = () => {
    // Trigger a socket event for payment decline
    socket.current.emit("paymentDeclined", { status: "declined" });
    setIsPaymentModalOpen(false);
  };

  useEffect(() => {
    // Listen for paymentConfirmation events from the server
    socket.current = io("https://poolpayapi.onrender.com").connect();
    if (socket.current) {
      console.log("connected to socket");
    }
    // console.log(socket.current.connected);
    if (sessionStorage.getItem("mobileNumber")) {
      const mobileNumber = sessionStorage.getItem("mobileNumber");
      socket.current.emit("joinPool", mobileNumber);
    }
    // if(socket.current){
    // console.log(socket.current.connected)
    socket.current.on("paymentStatus", (event) => {
      try {
        console.log("payment status received", event.status);
        setAmount(event.Amount);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error("Error handling paymentStatus event:", error);
      }
    });
    // }

    // Clean up the event listener when the component unmounts
    return () => {
      socket.current.disconnect();
      console.log("Disconnected from socket");
      socket.current.off("paymentStatus");
    };
  }, [socket]);

  return (
    <>
      <Header />
      <HeroSection />
      <ProductShowcase />
      <WindowPeak />
      <FeelSpecial />
      <MobileScroll />
      <Footer />

      {/* Render the PaymentModal component conditionally */}
      {isPaymentModalOpen && (
        <PaymentModal
          onClose={() => setIsPaymentModalOpen(false)}
          onConfirmPayment={handleConfirmPayment}
          onDeclinePayment={handleDeclinePayment}
          Amount={amount}
          // Add other props as needed
        />
      )}
    </>
  );
};

export default HomePage;
