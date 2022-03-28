import React from "react";
import CandidateCard from "./CandidateCard";

export default function CandidateList({
  candidates,
  candidatesNumberVotes,
  electionStatus,
  voterStatus,
  voteFor,
  totalVotes,
  onClick,
}) {
  const candidateInTheLead = Math.max(...Object.values(candidatesNumberVotes));

  return candidates.map((candidate) => {
    return (
      <CandidateCard
        key={candidate.id}
        candidate={candidate}
        candidateNumberVotes={candidatesNumberVotes[candidate.id]}
        isLeading={candidatesNumberVotes[candidate.id] === candidateInTheLead}
        totalVotes={totalVotes}
        electionStatus={electionStatus}
        voterStatus={voterStatus}
        isVotedFor={voteFor === candidate.id}
        onClick={(candidateID) => onClick(candidateID)}
      ></CandidateCard>
    );
  });
}
