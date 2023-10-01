import React, { createContext, useContext, useRef, useEffect } from "react";

const SocketContext = createContext();

export function useSocketRef() {
  const socketRef = useContext(SocketContext);
  if (!socketRef) {
    throw new Error("useSocketRef must be used within a SocketProvider");
  }
  return socketRef;
}

export function SocketProvider({ children }) {
  const socketRef = useRef(null);

//   useEffect(() => {
//     socketRef.current = io("https://poolpayapi.onrender.com").connect();
//     // console.log(socketRef.current.connected)

//     if (socketRef.current) {
//       console.log("Connected to socket");

//     //   socket.current.on("paymentStatus", () => {
//     //     // Open the payment modal when a payment confirmation event is received
//     //     setIsPaymentModalOpen(true);
//     //   });
//     }

//     // if (sessionStorage.getItem("mobileNumber")) {
//     //   const mobileNumber = sessionStorage.getItem("mobileNumber");
//     //   socketRef.current.emit("joinPool", mobileNumber);
//     // }

//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         console.log("Disconnected from socket");
//       }
//     };
//   }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}
