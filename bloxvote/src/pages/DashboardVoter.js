import React, { useState, createRef, useEffect } from "react";
import CustomButton from "../components/CustomButton";
import logo from "../assets/logo.svg";
import "./dashboard_voter.css";
import CustomTextField from "../components/CustomTextField";
import { Election, ElectionStatus, VoterStatus } from "../domain/Election";
import "../utils/global.css";
import ElectionList from "../components/ElectionList";
import CustomButtonStatus from "../components/CustomButtonStatus";
import { dateToString, deepCopy } from "../utils/utils";

export default function DashboardVoter() {
  const [account, setAccount] = useState(
    "0xbfc06bd91802ceccefdac434412a56be26e501d4"
  );
  const [searchValue, setSearchValue] = useState("");
  const [dateValue, setDateValue] = useState("");

  const [positionStartElections, setPositionStartElections] = useState(0);
  const [positionEndElections, setPositionEndElections] = useState(3);

  const [currentPage, setCurrentPage] = useState(1);

  const pageNumberFocus = createRef(null);

  const elections = [
    new Election(
      1,
      "Vote for your mayor",
      new Date(2022, 2, 25),
      new Date(2022, 2, 27),
      ElectionStatus.OPEN,
      VoterStatus.NOT_REGISTERED
    ),
    new Election(
      2,
      "Vote for your president 2022",
      new Date(2022, 3, 5),
      new Date(2022, 3, 7),
      ElectionStatus.NOT_STARTED,
      VoterStatus.NOT_REGISTERED
    ),
    new Election(
      3,
      "Vote for the new law",
      new Date(2022, 2, 15),
      new Date(2022, 2, 17),
      ElectionStatus.ENDED,
      VoterStatus.VOTED
    ),
    new Election(
      4,
      "Vote for your president 4018",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
    new Election(
      5,
      "Vote for your president 5010",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
    new Election(
      6,
      "Vote for your president 6011",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
    new Election(
      7,
      "Vote for your president 7012",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
    new Election(
      8,
      "Vote for your president 8013",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
    new Election(
      9,
      "Vote for your president 9013",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
    new Election(
      10,
      "Vote for your president 10013",
      new Date(2018, 7, 8),
      new Date(2018, 7, 6),
      ElectionStatus.ENDED,
      VoterStatus.NOT_VOTED
    ),
  ];

  const [paginatedElections, setPaginatedElections] = useState(() => {
    const temp = [...elections];
    return temp.slice(positionStartElections, positionEndElections);
  });

  useEffect(() => {
    setPaginatedElections(() => {
      const temp = [...elections];
      return temp.slice(positionStartElections, positionEndElections);
    });
  }, [positionEndElections]);

  useEffect(() => {
    handlePageNumberFocus();
  }, [paginatedElections]);

  const handlePageNumberFocus = () =>
    window.scrollTo({
      top: pageNumberFocus.current.offsetTop,
    });

  let backPageButton;
  if (currentPage > 1) {
    backPageButton = (
      <div>
        <CustomButton
          buttonSize={"btn-size-normal"}
          onClick={() => {
            setCurrentPage((prev) => prev - 1);
            setPositionStartElections((prev) => prev - 3);
            setPositionEndElections((prev) => prev - 3);
          }}
        >
          {"<"}
        </CustomButton>
      </div>
    );
  }

  let forwardPageButton;
  if (
    (elections.length % 3 !== 0 &&
      currentPage < Math.floor(elections.length / 3) + 1) ||
    (elections.length % 3 === 0 &&
      currentPage < Math.floor(elections.length / 3))
  ) {
    forwardPageButton = (
      <div>
        <CustomButton
          buttonSize={"btn-size-normal"}
          onClick={() => {
            setCurrentPage((prev) => prev + 1);
            setPositionStartElections((prev) => prev + 3);
            setPositionEndElections((prev) => prev + 3);
          }}
        >
          {">"}
        </CustomButton>
      </div>
    );
  }

  let noElectionsInfo;
  if (paginatedElections.length === 0) {
    noElectionsInfo = (
      <div
        className="default-text size-large color3"
        style={{ margin: "1%", textAlign: "center" }}
      >
        No elections
      </div>
    );
  }

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
        <CustomButton buttonSize={"btn-size-large"}>FILTER</CustomButton>
      </div>

      {noElectionsInfo}

      <ElectionList elections={paginatedElections}></ElectionList>

      <div className="page-buttons">
        {backPageButton}
        <div style={{ margin: "0 0.5% 0 0.5%" }} ref={pageNumberFocus}>
          <CustomButtonStatus
            buttonSize={"btn-size-normal"}
            buttonStyle={"btn-status-color3"}
          >
            {currentPage}
          </CustomButtonStatus>
        </div>
        {forwardPageButton}
      </div>
    </div>
  );
}
