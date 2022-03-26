import React from "react";
import "./candidate_card.css";

export default function CandidateCard({ election, candidate, onClick }) {
  const totalVotes = Object.values(election.candidates).reduce(
    (prev, curr) => parseInt(prev) + parseInt(curr),
    0
  );
  const candidateInTheLead = Math.max(...Object.values(election.candidates));

  return (
    <div className="candidate-card">
      <div className="tick-box"></div>
      <div className="name-desc">
        <div className="default-text size-large color3">{candidate.name}</div>
        <div className="default-text size-small color1">
          {candidate.description}
        </div>
      </div>
      <div className="default-text size-small color3 percentage">
        {`${((election.candidates[candidate.id] / totalVotes) * 100).toFixed(
          2
        )}%`}
      </div>
      <div
        className={
          election.candidates[candidate.id] === candidateInTheLead
            ? "number-votes-lead"
            : "number-votes"
        }
      >
        <div className="default-text size-large white">
          {election.candidates[candidate.id]}
        </div>
      </div>
    </div>
  );
}
