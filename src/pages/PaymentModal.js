import React from "react";
import "./PaymentModal.css"; // Import your CSS file

const PaymentModal = ({ onClose, onConfirmPayment, onDeclinePayment ,Amount}) => {
  return (
    <div className="payment-modal">
      <div className="backdrop"></div>
      <div className="modal">
        <h2 className="modal-title">Confirm Payment of ₹{Amount}</h2>
        <p className="modal-text">Are you sure you want to confirm this payment?</p>
        <div className="modal-buttons">
          <button className="modal-button decline" onClick={onDeclinePayment}>
            Decline
          </button>
          <button className="modal-button confirm" onClick={onConfirmPayment}>
            Confirm
          </button>
        </div>
        <button className="close-button" onClick={onClose}>
          &#215;
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
