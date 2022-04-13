import React from "react";
import CandidateCardNoVote from "./CandidateCardNoVote";

export default function CandidateListNoVote({ candidates, totalVotes }) {
  const leading = Math.max.apply(
    Math,
    candidates.map((candidate) => candidate.numberVotes)
  );

  return candidates.map((candidate) => {
    return (
      <CandidateCardNoVote
        key={candidate.id}
        candidate={candidate}
        isLeading={candidate.numberVotes == leading}
        totalVotes={totalVotes}
      ></CandidateCardNoVote>
    );
  });
}
