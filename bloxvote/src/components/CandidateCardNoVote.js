import React from "react";
import "./candidate_card.css";

export default function CandidateCardNoVote({
  candidate,
  isLeading,
  totalVotes,
}) {
  return (
    <div className="candidate-card">
      <div className="name-desc">
        <div className="default-text size-large color3">{candidate.name}</div>
        <div className="default-text size-small color1">
          {candidate.description}
        </div>
      </div>
      <div className="default-text size-small color3 percentage">
        {totalVotes === 0
          ? "0%"
          : `${((candidate.numberVotes / totalVotes) * 100).toFixed(2)}%`}
      </div>
      <div className={isLeading ? "number-votes-lead" : "number-votes"}>
        <div className="default-text size-large white">
          {candidate.numberVotes}
        </div>
      </div>
    </div>
  );
}
