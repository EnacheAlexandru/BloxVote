import React, { useState, useEffect, useContext } from "react";
import logo from "../assets/logo.svg";
import { UserContext } from "../context/UserContext";

export default function ErrorPage() {
  const { user, setUser } = useContext(UserContext);

  return (
    <div className="all-page-wrapper">
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        {user ? (
          <div className="default-text size-smaller color3">
            <div style={{ textAlign: "right" }}>Logged in as:</div>
            <div>{user.address}</div>
          </div>
        ) : null}
      </div>

      <div
        className="default-text color3"
        style={{
          textAlign: "center",
          fontSize: "50px",
          marginTop: "7%",
          marginBottom: "7%",
        }}
      >
        <div>We're sorry!</div>
        <div>We couldn't find the page you requested.</div>
      </div>

      <div className="footer">
        <div className="custom-shape-divider-bottom-1648118824">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
