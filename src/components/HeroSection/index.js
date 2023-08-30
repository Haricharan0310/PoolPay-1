import React from "react";
import Button from "../common/button";
import "./herosection.css";

const HeroSection = () => {
  return (
    <div className="hero-section-wrapper">
      <div className="flex absolute-center flex-col hero-section max-width">
        <div className="hero-heading">
          Share Moments,Share Costs, Request with Ease.
        </div>
        <div className="hero-subheading">with POOLPAY</div>
        <Button buttonText="Start Pooling" />
      </div>
    </div>
  );
};

export default HeroSection;
