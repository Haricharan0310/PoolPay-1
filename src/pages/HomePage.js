import React from "react";
import HeroSection from "../components/common/HeroSection";
import Header from "../components/common/Header";
import ProductShowcase from "../components/common/ProductShowcase/productshowcase";

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
