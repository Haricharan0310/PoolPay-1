import React from "react";
import HeroSection from "../components/common/HeroSection";
import Header from "../components/common/Header";
import ProductShowcase from "../components/common/ProductShowcase/productshowcase";
import FeelSpecial from "../components/Feelspecial/feelspecial";
import WindowPeak from "../components/peekWindow/peekwindow";
import MobileScroll from "../components/MobileScroll/mobilescroll";
import Footer from "../components/footer/footer";

const HomePage = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ProductShowcase />
      <WindowPeak />
      <FeelSpecial />
      <MobileScroll />
      <Footer />
    </>
  );
};

export default HomePage;
