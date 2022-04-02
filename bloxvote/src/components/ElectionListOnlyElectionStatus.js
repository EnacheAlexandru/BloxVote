import React from "react";
import ElectionCardOnlyElectionStatus from "./ElectionCardOnlyElectionStatus";

export default function ElectionListOnlyElectionStatus({ elections, onClick }) {
  return elections.map((election) => {
    return (
      <ElectionCardOnlyElectionStatus
        key={election.id}
        election={election}
        onClick={(electionID) => onClick(electionID)}
      ></ElectionCardOnlyElectionStatus>
    );
  });
}
