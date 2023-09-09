import React from "react";
import HeroSection from "../components/common/HeroSection";
import Header from "../components/common/Header";
import ProductShowcase from "../components/common/ProductShowcase/productshowcase";
import FeelSpecial from "../components/Feelspecial/feelspecial";
import WindowPeak from "../components/peekWindow/peekwindow";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ProductShowcase />
      <WindowPeak />
      <FeelSpecial />
    </>
  );
};

export default HomePage;
