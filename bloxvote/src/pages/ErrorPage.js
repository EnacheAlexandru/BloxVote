import React, { useState, useEffect } from "react";
import { Voter } from "../domain/Voter";
import logo from "../assets/logo.svg";

export default function ErrorPage() {
  const [voter, setVoter] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchedVoter = new Voter(
      "0xbfc06bd91802ceccefdac434412a56be26e501d4",
      {
        3: null,
        4: 1,
      }
    );

    setVoter(fetchedVoter);
  }, []);

  return (
    <div className="all-page-wrapper">
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        {voter ? (
          <div className="default-text size-smaller color3">
            <div style={{ textAlign: "right" }}>Logged in as:</div>
            <div>{voter.address}</div>
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
