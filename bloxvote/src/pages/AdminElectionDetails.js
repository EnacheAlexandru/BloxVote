import React, { useReducer, useEffect, useState, useContext } from "react";
import "./election_details_voter.css";
import "../utils/global.css";
import logo from "../assets/logo.svg";
import { ElectionDetails } from "../domain/ElectionDetails";
import { Candidate } from "../domain/Candidate";
import {
  computeElectionStatus,
  dateToString,
  ElectionStatus,
} from "../utils/utils";
import CustomButtonStatus from "../components/CustomButtonStatus";
import CustomButton from "../components/CustomButton";
import { UserContext } from "../context/UserContext";
import CandidateListNoVote from "../components/CandidateListNoVote";
import { ElectionDetailsAdmin } from "../domain/ElectionDetailsAdmin";
import { ElectionDetailsDTO } from "../dto/ElectionDetailsDTO";

const ACTIONS = {
  SET_TOTAL_VOTES: "SET_TOTAL_VOTES",
  ACTIONS_INIT: "ACTIONS_INIT",
};

export default function AdminElectionDetails() {
  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.INIT:
        return {
          ...state,
          election: action.payload.fetchedElection,
          candidates: action.payload.fetchedCandidates,
          totalVotes: action.payload.totalVotes,
        };
      case ACTIONS.SET_TOTAL_VOTES:
        return {
          ...state,
          totalVotes: action.payload,
        };
    }
  };

  const initialState = {
    election: null,
    candidates: [],
    totalVotes: 0,
  };

  const [state, stateDispatch] = useReducer(stateReducer, initialState);
  const { user, setUser } = useContext(UserContext);

  const [voterAddressToRegister, setVoterAddressToRegister] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchedElection = new ElectionDetailsDTO(
      2,
      "Vote for your mayor",
      "The next 4 years will be important for our city! Your vote is very important for our future!",
      Math.floor(new Date(2022, 3, 13).getTime() / 1000) * 1000,
      Math.floor(new Date(2022, 3, 16).getTime() / 1000) * 1000,
      [1, 2, 3]
    );

    const fetchedCandidates = [
      new Candidate(1, "John Manner", "I want to make more parks!", 17),
      new Candidate(
        2,
        "Umbert Gothium",
        "I want to make a new hospital and a new mall for my lovely citizens!",
        24
      ),
      new Candidate(3, "Cassandra Biggiy", "I want to build an airport!", 58),
    ];

    let totalVotes = 0;
    fetchedCandidates.forEach(
      (candidate) => (totalVotes = totalVotes + candidate.numberVotes)
    );

    const election = new ElectionDetailsAdmin(
      fetchedElection.id,
      fetchedElection.title,
      fetchedElection.description,
      fetchedElection.dateStart,
      fetchedElection.dateEnd,
      computeElectionStatus(fetchedElection.dateStart, fetchedElection.dateEnd)
    );

    stateDispatch({
      type: ACTIONS.INIT,
      payload: {
        fetchedElection: election,
        fetchedCandidates: fetchedCandidates,
        totalVotes: totalVotes,
      },
    });
  }, []);

  if (!state.election) {
    return <div>Loading...</div>;
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

  let voterAddressToRegisterError;
  if (!/^0x[0-9A-Fa-f]{40}$/.test(voterAddressToRegister)) {
    voterAddressToRegisterError = (
      <div className="default-text size-smaller red">Invalid format</div>
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

      <div className="register-voter">
        <div className="default-text size-larger color3">Register voter</div>
        <div
          className="default-text size-small color3"
          style={{ marginTop: "1%", marginBottom: "1%" }}
        >
          Enter voter's address{" "}
          <span className="default-text size-smaller color3">
            <i>(0x followed by 40 hexadecimal characters)</i>
          </span>
        </div>
        <div>
          <input
            type="text"
            className="custom-text-field"
            maxLength="42"
            onChange={(event) => {
              setVoterAddressToRegister(event.target.value);
            }}
          ></input>
        </div>

        {voterAddressToRegisterError}

        <div style={{ marginTop: "1%" }}>
          <CustomButton
            buttonSize={"btn-size-large"}
            onClick={() => {
              if (!voterAddressToRegisterError) {
                console.log("register voter");
              }
            }}
          >
            REGISTER
          </CustomButton>
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

      <div className="candidates-wrapper">
        <div
          className="default-text size-large color3"
          style={{ marginBottom: "2%" }}
        >
          Total votes: {state.totalVotes}
        </div>
        <CandidateListNoVote
          candidates={state.candidates}
          totalVotes={state.totalVotes}
        ></CandidateListNoVote>
      </div>

      <div className="footer">
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
    </div>
  );
}
