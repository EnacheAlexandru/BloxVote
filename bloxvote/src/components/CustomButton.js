import React from "react";
import "./custom_button.css";

export default function CustomButton({
  children,
  onClick,
  buttonStyle,
  buttonSize,
}) {
  const STYLES = ["btn-color1", "btn-color2", "btn-color3"];
  const setButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

  const SIZES = ["btn-size-normal", "btn-size-large"];
  const setButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <button
      className={`custom-btn ${setButtonStyle} ${setButtonSize}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
