import React from "react";
import "./footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; {currentYear} PoolPay. All Rights Reserved.</p>
          <p>Address: Gajuwaka, Visakhapatnam, India</p>
          <p>Email: PoolPay@support.com</p>
          <p>Phone: +91 8919774630</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
