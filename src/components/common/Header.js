import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./header.css";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Login from "../../pages/Login"; // Import the Google login component

const Header = () => {
  const [showMobMenu, setShowMobMenu] = useState(false);
  const [user, setUser] = useState(null); // Store user data
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        setUser(user);
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleMobileMenu = () => {
    setShowMobMenu(!showMobMenu);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className={`mobile-menu-wrapper ${user ? "" : "hidden"}`}>
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
          </button>
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
          {user && (
            <div className="header-profile" onClick={toggleProfileDropdown}>
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="profile-picture"
              />
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;
