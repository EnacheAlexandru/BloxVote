import React from "react";
import CandidateCard from "./CandidateCard";

export default function CandidateList({ election, candidates, onClick }) {
  return candidates.map((candidate) => {
    return (
      <CandidateCard
        key={candidate.id}
        election={election}
        candidate={candidate}
        onClick={(candidateID) => onClick(candidateID)}
      ></CandidateCard>
    );
  });
}
