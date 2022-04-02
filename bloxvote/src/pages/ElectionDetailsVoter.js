import React, { useReducer, useEffect, useContext } from "react";
import "./election_details_voter.css";
import "../utils/global.css";
import logo from "../assets/logo.svg";
import { ElectionDetails } from "../domain/ElectionDetails";
import { Candidate } from "../domain/Candidate";
import { dateToString, ElectionStatus, VoterStatus } from "../utils/utils";
import CandidateList from "../components/CandidateList";
import CustomButtonStatus from "../components/CustomButtonStatus";
import { UserContext } from "../context/UserContext";

const ACTIONS = {
  SET_TOTAL_VOTES: "SET_TOTAL_VOTES",
  ACTIONS_INIT: "ACTIONS_INIT",
  SET_VOTER_STATUS: "SET_VOTER_STATUS",
};

export default function ElectionDetailsVoter() {
  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.INIT:
        return {
          ...state,
          election: action.payload.fetchedElection,
          candidates: action.payload.fetchedCandidates,
          totalVotes: Object.values(
            action.payload.fetchedElection.candidates
          ).reduce((prev, curr) => parseInt(prev) + parseInt(curr), 0),
        };
      case ACTIONS.SET_TOTAL_VOTES:
        return {
          ...state,
          totalVotes: action.payload,
        };
      case ACTIONS.SET_VOTER_STATUS:
        return {
          ...state,
          voterStatus: action.payload,
        };
    }
  };

  const initialState = {
    election: null,
    candidates: [],
    totalVotes: 0,
    voterStatus: null,
  };

  const [state, stateDispatch] = useReducer(stateReducer, initialState);
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchedElection = new ElectionDetails(
      2,
      "Vote for your mayor",
      "The next 4 years will be important for our city! Your vote is very important for our future!",
      new Date(2022, 2, 25),
      new Date(2022, 2, 27),
      ElectionStatus.ENDED,
      { 1: 17, 2: 24, 3: 58 }
    );

    const fetchedCandidates = [
      new Candidate(1, "John Manner", "I want to make lots of parks!"),
      new Candidate(
        2,
        "Umbert Gothium",
        "I want to make a new hospital and a new mall for my lovely citizens!"
      ),
      new Candidate(3, "Cassandra Biggiy", "I want to build an airport!"),
    ];

    if (!(fetchedElection.id in user.votes)) {
      stateDispatch({
        type: ACTIONS.SET_VOTER_STATUS,
        payload: VoterStatus.NOT_REGISTERED,
      });
    } else if (user.votes[fetchedElection.id] === null) {
      stateDispatch({
        type: ACTIONS.SET_VOTER_STATUS,
        payload: VoterStatus.NOT_VOTED,
      });
    } else {
      stateDispatch({
        type: ACTIONS.SET_VOTER_STATUS,
        payload: VoterStatus.VOTED,
      });
    }

    stateDispatch({
      type: ACTIONS.INIT,
      payload: {
        fetchedElection: fetchedElection,
        fetchedCandidates: fetchedCandidates,
      },
    });
  }, []);

  if (!state.election) {
    return <div>Loading...</div>;
  }

  let notRegisteredLabel;
  if (
    state.voterStatus === VoterStatus.NOT_REGISTERED &&
    state.election.electionStatus !== ElectionStatus.ENDED
  ) {
    notRegisteredLabel = (
      <div
        className="default-text size-larger red"
        style={{ textAlign: "center" }}
      >
        You are not registered for this election!
      </div>
    );
  } else if (
    state.voterStatus === VoterStatus.NOT_REGISTERED &&
    state.election.electionStatus === ElectionStatus.ENDED
  ) {
    notRegisteredLabel = (
      <div
        className="default-text size-larger red"
        style={{ textAlign: "center" }}
      >
        You were not registered for this election!
      </div>
    );
  }

  let notVotedLabel;
  if (
    state.voterStatus === VoterStatus.NOT_VOTED &&
    state.election.electionStatus === ElectionStatus.OPEN
  ) {
    notVotedLabel = (
      <>
        <div
          className="default-text size-larger color3"
          style={{ textAlign: "center" }}
        >
          Choose the candidate that you wish to vote for!
        </div>

        <div
          className="default-text size-large color3"
          style={{ textAlign: "center" }}
        >
          But choose wisely, you can only vote once!
        </div>
      </>
    );
  } else if (
    state.voterStatus === VoterStatus.NOT_VOTED &&
    state.election.electionStatus === ElectionStatus.ENDED
  ) {
    notVotedLabel = (
      <div
        className="default-text size-larger color3"
        style={{ textAlign: "center" }}
      >
        You did not vote in this election!
      </div>
    );
  }

  let alreadyVotedLabel;
  if (
    state.voterStatus === VoterStatus.VOTED &&
    state.election.electionStatus === ElectionStatus.OPEN
  ) {
    alreadyVotedLabel = (
      <div
        className="default-text size-larger color1"
        style={{ textAlign: "center" }}
      >
        You have already voted!
      </div>
    );
  }

  let electionStatusButton;
  if (state.election.electionStatus === ElectionStatus.OPEN) {
    electionStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color1"}
        buttonSize={"btn-size-large"}
      >
        OPEN
      </CustomButtonStatus>
    );
  } else if (state.election.electionStatus === ElectionStatus.ENDED) {
    electionStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color3"}
        buttonSize={"btn-size-large"}
      >
        ENDED
      </CustomButtonStatus>
    );
  } else if (state.election.electionStatus === ElectionStatus.NOT_STARTED) {
    electionStatusButton = (
      <CustomButtonStatus
        buttonStyle={"btn-status-color2"}
        buttonSize={"btn-size-large"}
      >
        NOT STARTED
      </CustomButtonStatus>
    );
  }

  return (
    <div className="all-page-wrapper">
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        <div className="default-text size-smaller color3">
          <div style={{ textAlign: "right" }}>Logged in as:</div>
          <div>{user.address}</div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>{electionStatusButton}</div>

      <div
        className="default-text size-larger color3"
        style={{ textAlign: "center" }}
      >
        {state.election.title}
      </div>

      <div
        className="default-text size-small color1"
        style={{ textAlign: "center" }}
      >
        {dateToString(state.election.dateStart)} -{" "}
        {dateToString(state.election.dateEnd)}
      </div>

      <div
        className="default-text size-small color3"
        style={{ textAlign: "center", margin: "1% 20% 4% 20%" }}
      >
        {state.election.description}
      </div>

      {notRegisteredLabel}
      {alreadyVotedLabel}
      {notVotedLabel}

      <div className="candidates-wrapper">
        <div
          className="default-text size-large color3"
          style={{ marginBottom: "2%", marginTop: "2%" }}
        >
          Total votes: {state.totalVotes}
        </div>
        <CandidateList
          candidates={state.candidates}
          candidatesNumberVotes={state.election.candidates}
          electionStatus={state.election.electionStatus}
          voterStatus={state.voterStatus}
          voteFor={user.votes[state.election.id]}
          totalVotes={state.totalVotes}
          onClick={(candidateID) => console.log(candidateID)}
        ></CandidateList>
      </div>

      <div className="custom-shape-divider-bottom-1648118824">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M892.25 114.72L0 0 0 120 1200 120 1200 0 892.25 114.72z"
            className="shape-fill"
          ></path>
        </svg>
      </div>
    </div>
  );
}
