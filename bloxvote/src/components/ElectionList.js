import React from "react";
import ElectionCard from "./ElectionCard";

export default function ElectionList({ elections, onClick }) {
  return elections.map((election) => {
    return (
      <ElectionCard
        key={election.id}
        election={election}
        onClick={(electionID) => onClick(electionID)}
      ></ElectionCard>
    );
  });
}
