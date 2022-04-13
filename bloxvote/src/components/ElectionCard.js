import React from "react";
import "../utils/global.css";
import {
  computeElectionStatus,
  dateToString,
  ElectionStatus,
  VoterStatus,
} from "../utils/utils";
import CustomButtonStatus from "./CustomButtonStatus";
import "./election_card.css";

export default function ElectionCard({ election, onClick }) {
  const electionStatus = computeElectionStatus(
    election.dateStart,
    election.dateEnd
  );

  let electionStatusButton;
  if (electionStatus === ElectionStatus.OPEN) {
    electionStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color1"}
        buttonSize={"btn-size-large"}
      >
        OPEN
      </CustomButtonStatus>
    );
  } else if (electionStatus === ElectionStatus.ENDED) {
    electionStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color3"}
        buttonSize={"btn-size-large"}
      >
        ENDED
      </CustomButtonStatus>
    );
  } else if (electionStatus === ElectionStatus.NOT_STARTED) {
    electionStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color2"}
        buttonSize={"btn-size-large"}
      >
        NOT STARTED
      </CustomButtonStatus>
    );
  }

  let voterStatusButton;
  if (election.voterStatus === VoterStatus.NOT_REGISTERED) {
    voterStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color4"}
        buttonSize={"btn-size-large"}
      >
        NOT REGISTERED
      </CustomButtonStatus>
    );
  } else if (election.voterStatus === VoterStatus.NOT_VOTED) {
    voterStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color2"}
        buttonSize={"btn-size-large"}
      >
        NOT VOTED
      </CustomButtonStatus>
    );
  } else if (election.voterStatus === VoterStatus.VOTED) {
    voterStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color1"}
        buttonSize={"btn-size-large"}
      >
        VOTED
      </CustomButtonStatus>
    );
  }

  return (
    <div className="election-card" onClick={() => onClick(election.id)}>
      <div>
        <div
          className="default-text size-large color3"
          style={{ padding: "1px" }}
        >
          {election.title}
        </div>
        <div className="default-text size-small color1">
          {dateToString(election.dateStart)} - {dateToString(election.dateEnd)}
        </div>
      </div>
      <div className="election-card-status">
        <div>{electionStatusButton}</div>
        <div style={{ marginTop: "10px" }}>{voterStatusButton}</div>
      </div>
    </div>
  );
}
