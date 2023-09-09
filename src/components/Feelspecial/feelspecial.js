import React from "react";
import "./feelspecial.css";
import Button from "../../components/common/Button.js";
import Login from "./Joinus";
const FeelSpecial = () => {
  return (
    <div className="feel-special photo-section">
      <div className="max-width">
        <div className="photo-section-child">
          <div className="photo-section-top">
            <div className="photo-section-subheading">
              Request money from Friends, Keep transactions Social
            </div>
          </div>
          <div className="photo-section-bottom">
            <div className="photo-section-description">
              "Shamelessly request money from friends while maintaining a social
              transaction experience. Empower shared financial interactions in a
              user-friendly environment."
            </div>
            <div>
              <Login buttonText="Join Us" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeelSpecial;
