import React from "react";
import AddCandidateCard from "./AddCandidateCard";

export default function AddCandidateList({ candidates, onClick }) {
  return candidates.map((candidate) => {
    return (
      <AddCandidateCard
        key={candidate.id}
        candidate={candidate}
        onClick={(candidateID) => onClick(candidateID)}
      ></AddCandidateCard>
    );
  });
}
