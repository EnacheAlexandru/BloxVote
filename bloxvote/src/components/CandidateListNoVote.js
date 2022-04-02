import React from "react";
import CandidateCardNoVote from "./CandidateCardNoVote";

export default function CandidateListNoVote({
  candidates,
  candidatesNumberVotes,
  totalVotes,
}) {
  const candidateInTheLead = Math.max(...Object.values(candidatesNumberVotes));

  return candidates.map((candidate) => {
    return (
      <CandidateCardNoVote
        key={candidate.id}
        candidate={candidate}
        candidateNumberVotes={candidatesNumberVotes[candidate.id]}
        isLeading={candidatesNumberVotes[candidate.id] === candidateInTheLead}
        totalVotes={totalVotes}
      ></CandidateCardNoVote>
    );
  });
}
