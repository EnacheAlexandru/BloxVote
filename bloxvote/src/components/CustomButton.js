import React from "react";
import "./custom_button.css";

export default function CustomButton({ children, onClick, buttonStyle }) {
  const STYLES = ["btn-color1", "btn-color2", "btn-color3"];
  const setButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

  return (
    <div>
      <button className={`custom-btn ${setButtonStyle}`} onClick={onClick}>
        {children}
      </button>
    </div>
  );
}
