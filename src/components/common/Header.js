import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./header.css";

const Header = () => {
  const [showMobMenu, setShowMobMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobMenu(!showMobMenu);
  };

  return (
    <div className="mobile-menu-wrapper">
      <div
        className={`mobile-menu only-mobile ${showMobMenu ? "overlay" : ""}`}
      >
        <div className="mobile-navbar">
          <Link to="/co-spend" className="mobile-nav-item">
            CO SPEND
          </Link>
          <Link to="/co-loan" className="mobile-nav-item">
            CO LOAN
          </Link>
          <Link to="/co-invest" className="mobile-nav-item">
            CO INVEST
          </Link>
        </div>
      </div>
      <div className="flex max-width header">
        <div className="header-logo"></div>

        <div className="only-mobile mobile-menu-button-wrapper">
          <button
            className={`hamburger hamburger--spin ${
              showMobMenu ? "is-active" : ""
            }`}
            type="button"
            onClick={toggleMobileMenu}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>{" "}
        </div>
        <div className="non-mobile flex">
          <Link to="/co-spend" className="header-nav-item">
            CO SPEND
          </Link>
          <Link to="/co-loan" className="header-nav-item">
            CO LOAN
          </Link>
          <Link to="/co-invest" className="header-nav-item">
            CO INVEST
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
