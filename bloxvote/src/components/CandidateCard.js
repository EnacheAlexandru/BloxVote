import React from "react";
import { ElectionStatus, VoterStatus } from "../utils/utils";
import "./candidate_card.css";

export default function CandidateCard({
  candidate,
  candidateNumberVotes,
  isLeading,
  totalVotes,
  electionStatus,
  voterStatus,
  isVotedFor,
  onClick,
}) {
  let tickBox;
  if (
    electionStatus === ElectionStatus.NOT_STARTED ||
    voterStatus === VoterStatus.NOT_REGISTERED
  ) {
    tickBox = <div className="tick-box-closed-no-hover"></div>;
  } else if (
    electionStatus === ElectionStatus.ENDED ||
    voterStatus === VoterStatus.VOTED
  ) {
    if (isVotedFor) {
      tickBox = <div className="tick-box-ticked"></div>;
    } else {
      tickBox = <div className="tick-box-no-hover"></div>;
    }
  } else if (voterStatus === VoterStatus.NOT_VOTED) {
    tickBox = <div className="tick-box" onClick={() => onClick()}></div>;
  }

  return (
    <div className="candidate-card">
      {tickBox}
      <div className="name-desc">
        <div className="default-text size-large color3">{candidate.name}</div>
        <div className="default-text size-small color1">
          {candidate.description}
        </div>
      </div>
      <div className="default-text size-small color3 percentage">
        {totalVotes === 0
          ? "0%"
          : `${((candidateNumberVotes / totalVotes) * 100).toFixed(2)}%`}
      </div>
      <div className={isLeading ? "number-votes-lead" : "number-votes"}>
        <div className="default-text size-large white">
          {candidateNumberVotes}
        </div>
      </div>
    </div>
  );
}
