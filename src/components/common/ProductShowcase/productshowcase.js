import React, { useRef, useState, useEffect } from "react";
import "./productShowcase.css";

const ProductShowcase = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const ref = useRef(null);

  const toggleAnimation = (entries) => {
    if (entries[0]?.isIntersecting) {
      setShowAnimation(true);
    }
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(toggleAnimation, options);
    if (!showAnimation && ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []); // Removed "showAnimation" and "options" from the dependency array

  return (
    <div
      className={`product-showcase ${showAnimation ? "scale-in-bottom" : ""}`}
      ref={ref}
    >
      {showAnimation && (
        <div className="showcase-wrapper">
          <img
            src="./images/Group 26.svg"
            className="showcase-ui showcase-mockup-1"
            alt="Mockup 1"
          />
          <img
            src="./images/Group 24.svg"
            className="showcase-ui showcase-mockup-2"
            alt="Mockup 2"
          />
          <img
            src="./images/Group 25.svg"
            className="showcase-ui showcase-mockup-3"
            alt="Mockup 3"
          />
        </div>
      )}
    </div>
  );
};

export default ProductShowcase;
