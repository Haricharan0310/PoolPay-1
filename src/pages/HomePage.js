import React from "react";
import HeroSection from "../components/HeroSection";
import Header from "../components/common/Header";
import ProductShowcase from "../components/Productshowcase";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ProductShowcase />
    </>
  );
};

export default HomePage;
