import React from "react";
import ElectionCard from "./ElectionCard";

export default function ElectionList({ elections }) {
  return elections.map((election) => {
    return <ElectionCard key={election.id} election={election}></ElectionCard>;
  });
}
