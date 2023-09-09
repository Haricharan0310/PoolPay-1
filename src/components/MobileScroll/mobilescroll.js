import { React, useState } from "react";
import "./mobilescroll.css";
import ScreenText from "./ScreenText";

const scrollData = [
  {
    heading: "Track your each Rupee with Bills",
    description:
      "Securely Pool Bills for Smooth Transactions and Strengthen Friendships",
    lappy_img: require("../../images/carasoul2.png"),
  },
  {
    heading: "Enhance Financial Bonds",
    description:
      "Get your money back with the periodic interest by enabling Financial bonds",
    lappy_img: require("../../images/carasoul1.png"),
  },
  {
    heading: "Split Expenses Smoothly",
    description:
      "Effortlessly divide and manage expenses among friends while maintaining transparency and trust. Bills for Smooth Transactions and Strengthen Friendships",
    lappy_img: require("../../images/Group 31.png"),
  },
];
const MobileScroll = () => {
  const [currentImg, setCurrentImg] = useState(0);
  return (
    <div className="max-width flex mobile-scroll">
      <div className="scroll-full-screen-wrapper">
        {scrollData.map((screen, i) => (
          <div className="scroll-full-screen">
            <ScreenText screen={screen} i={i} setCurrentImg={setCurrentImg} />
          </div>
        ))}
      </div>
      <div className="mobile-mockup-wrapper non-mobile">
        <div className="mobile-mockup">
          <div className="mobile-mockup-screen flex absolute-center">
            <img
              src={scrollData[currentImg].lappy_img}
              className="mobile-screen-img slide-in-right"
              key={scrollData[currentImg].lappy_img}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileScroll;
