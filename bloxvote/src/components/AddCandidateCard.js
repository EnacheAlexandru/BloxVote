import React from "react";
import { MdDelete } from "react-icons/md";

export default function AddCandidateCard({ candidate, onClick }) {
  return (
    <div className="candidate-card">
      <div className="name-desc">
        <div className="default-text size-large color3">{candidate.name}</div>
        <div className="default-text size-small color1">
          {candidate.description}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <MdDelete
          size={40}
          color="red"
          style={{ cursor: "pointer" }}
          onClick={() => onClick(candidate.id)}
        ></MdDelete>
      </div>
    </div>
  );
}
