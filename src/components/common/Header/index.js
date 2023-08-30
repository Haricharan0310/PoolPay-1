import React, { useState } from "react";
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
          <div className="mobile-nav-item">CO SPEND</div>
          <div className="mobile-nav-item">CO LOAN</div>
          <div className="mobile-nav-item">CO INVEST</div>
        </div>
      </div>
      <div className="flex max-width header">
        <div className="header-logo">POOLPAY</div>
        <div className="only-mobile mobile-menu-button-wrapper">
          <button
            class={`hamburger hamburger--spin ${
              showMobMenu ? "is-active" : ""
            }`}
            type="button"
            onClick={toggleMobileMenu}
          >
            <span class="hamburger-box">
              <span class="hamburger-inner"></span>
            </span>
          </button>{" "}
        </div>
        <div className="non-mobile flex">
          <div className="header-nav-item">CO SPEND</div>
          <div className="header-nav-item">CO LOAN</div>
          <div className="header-nav-item">CO INVEST</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
