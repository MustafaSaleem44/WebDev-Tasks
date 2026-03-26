import React from "react";

const Commentary = ({ text }) => {
  return (
    <div className="commentary-box">
      <h4>Commentary</h4>
      <p className="fade-in">{text}</p>
    </div>
  );
};

export default Commentary;
