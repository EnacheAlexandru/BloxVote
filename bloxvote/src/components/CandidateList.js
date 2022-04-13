import React from "react";
import CandidateCard from "./CandidateCard";

export default function CandidateList({
  candidates,
  electionStatus,
  voterStatus,
  voteFor,
  totalVotes,
  onClick,
}) {
  const leading = Math.max.apply(
    Math,
    candidates.map((candidate) => candidate.numberVotes)
  );

  return candidates.map((candidate) => {
    return (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        isLeading={candidate.numberVotes == leading}
        totalVotes={totalVotes}
        electionStatus={electionStatus}
        voterStatus={voterStatus}
        isVotedFor={voteFor == candidate.id}
        onClick={(candidateID) => onClick(candidateID)}
      ></CandidateCard>
    );
  });
}
