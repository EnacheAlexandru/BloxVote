import React, { useState } from "react";
import CustomButton from "../components/CustomButton";
import logo from "../assets/logo.svg";
import "./dashboard_voter_style.css";
import CustomTextField from "../components/CustomTextField";
import dateToString from "../utils/utils";

export default function DashboardVoter() {
  const [account, setAccount] = useState(
    "0xbfc06bd91802ceccefdac434412a56be26e501d4"
  );
  const [searchValue, setSearchValue] = useState("");
  const [dateValue, setDateValue] = useState("");

  console.log(searchValue);
  console.log(dateToString(dateValue));

  return (
    <div>
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        <div className="default-text size-smaller color3">
          <div>Logged in as:</div>
          <div>{account}</div>
        </div>
      </div>

      <div className="bg-title">
        <div
          className="default-text size-larger color3"
          style={{ textAlign: "center" }}
        >
          BloxVote: A decentralized voting system
        </div>

        <div
          className="default-text size-larger color3"
          style={{ textAlign: "center" }}
        >
          Choose an election and start voting!
        </div>
      </div>

      <div className="filter-form">
        <div style={{ flex: 2.5 }}>
          <div
            className="default-text size-large color3"
            style={{ marginBottom: "1%" }}
          >
            Filter by title
          </div>
          <CustomTextField
            width="80%"
            icon="search"
            onChange={setSearchValue}
          ></CustomTextField>
        </div>
        <div style={{ flex: 1 }}>
          <div
            className="default-text size-large color3"
            style={{ marginBottom: "2%" }}
          >
            Filter by date
          </div>
          <CustomTextField
            width="100%"
            icon="date"
            onChange={setDateValue}
          ></CustomTextField>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <CustomButton>FILTER</CustomButton>
      </div>
    </div>
  );
}
