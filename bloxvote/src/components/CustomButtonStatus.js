import React from "react";
import "./custom_button.css";

export default function CustomButtonStatus({
  children,
  buttonStyle,
  buttonSize,
  padding,
}) {
  const STYLES = [
    "btn-status-color1",
    "btn-status-color2",
    "btn-status-color3",
    "btn-status-color4",
  ];
  const setButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

  const SIZES = ["btn-size-normal", "btn-size-large"];
  const setButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];

  return (
    <button className={`custom-btn-status ${setButtonStyle} ${setButtonSize}`}>
      {children}
    </button>
  );
}
