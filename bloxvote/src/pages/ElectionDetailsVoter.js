import React, { useState } from "react";
import "./election_details_voter.css";
import "../utils/global.css";
import logo from "../assets/logo.svg";
import {
  ElectionDetails,
  ElectionStatus,
  VoterStatus,
} from "../domain/ElectionDetails";
import { Candidate } from "../domain/Candidate";
import { dateToString } from "../utils/utils";
import { Voter } from "../domain/Voter";

export default function ElectionDetailsVoter() {
  const [account, setAccount] = useState(
    "0xbfc06bd91802ceccefdac434412a56be26e501d4"
  );

  const election = new ElectionDetails(
    2,
    "Vote for your mayor",
    "The next 4 years will be important for our city! Your vote is very important for our future!",
    new Date(2022, 2, 25),
    new Date(2022, 2, 27),
    ElectionStatus.OPEN,
    VoterStatus.NOT_REGISTERED,
    [
      new Candidate(1, "John Manner", "I want to make lots of parks!"),
      new Candidate(
        2,
        "Umbert Gothium",
        "I want to make a new hospital and a new mall for my lovely citizens!"
      ),
      new Candidate(3, "Cassandra Biggiy", "I want to build an airport!"),
    ]
  );

  const voter = new Voter("0xbfc06bd91802ceccefdac434412a56be26e501d4", {
    3: null,
    4: 1,
  });

  let notRegisteredLabel;
  if (!(election.id in voter.votes)) {
    notRegisteredLabel = (
      <div
        className="default-text size-larger red"
        style={{ textAlign: "center", margin: "2% 1% 2% 1%" }}
      >
        You are not registered for this election!
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        <div className="default-text size-smaller color3">
          <div>Logged in as:</div>
          <div>{account}</div>
        </div>
      </div>

      <div
        className="default-text size-larger color3"
        style={{ textAlign: "center" }}
      >
        {election.title}
      </div>

      <div
        className="default-text size-small color1"
        style={{ textAlign: "center" }}
      >
        {dateToString(election.dateStart)} - {dateToString(election.dateEnd)}
      </div>

      <div
        className="default-text size-small color3"
        style={{ textAlign: "center", margin: "1% 20% 1% 20%" }}
      >
        {election.description}
      </div>

      {notRegisteredLabel}

      <div
        className="default-text size-large color3"
        style={{ textAlign: "center" }}
      >
        Choose the candidate that you wish to vote for!
      </div>

      <div
        className="default-text size-large color3"
        style={{ textAlign: "center" }}
      >
        Choose wisely, you can only vote once!
      </div>
    </div>
  );
}
