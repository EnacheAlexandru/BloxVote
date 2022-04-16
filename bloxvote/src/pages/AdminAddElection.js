import React, { useContext, useEffect, useReducer, useState } from "react";
import "./admin_add_election.css";
import "./admin_election_details.css";
import "../utils/global.css";
import "../utils/footer.css";
import logo from "../assets/logo.svg";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomButton from "../components/CustomButton";
import { Candidate } from "../domain/Candidate";
import AddCandidateList from "../components/AddCandidateList";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { contractAdmin } from "../utils/utils";

const ACTIONS = {
  ADD_CANDIDATE: "ADD_CANDIDATE",
  DELETE_CANDIDATE: "DELETE_CANDIDATE",
};

const today = new Date();

let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const filterPassedTime = (time) => {
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const selectedDate = new Date(time);

  return tomorrow.getTime() < selectedDate.getTime();
};

let currentCandidateID = 11;

// const candidatesToBeAdded = [
//   new Candidate(1, "John Manner", "I want to make lots of parks!"),
//   new Candidate(
//     2,
//     "Umbert Gothium",
//     "I want to make a new hospital and a new mall for my lovely citizens!aaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa"
//   ),
//   new Candidate(3, "Cassandra Biggiy", "I want to build an airport!"),
// ];

export default function AdminAddElection() {
  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.ADD_CANDIDATE: {
        return {
          ...state,
          candidatesToBeAdded: [...state.candidatesToBeAdded, action.payload],
        };
      }
      case ACTIONS.DELETE_CANDIDATE: {
        return {
          ...state,
          candidatesToBeAdded: state.candidatesToBeAdded.filter(
            (candidate) => candidate.id !== action.payload
          ),
        };
      }
    }
  };

  const initialState = {
    candidatesToBeAdded: [],
  };

  const [titleElection, setTitleElection] = useState("");
  const [descriptionElection, setDescriptionElection] = useState("");
  const [nameCandidate, setNameCandidate] = useState("");
  const [descriptionCandidate, setDescriptionCandidate] = useState("");

  const [startDateElection, setStartDateElection] = useState(null);
  const [endDateElection, setEndDateElection] = useState(null);

  const [state, stateDispatch] = useReducer(stateReducer, initialState);
  const { user, setUser } = useContext(UserContext);
  const navigateTo = useNavigate();

  const checkMetaMask = async () => {
    if (typeof window.ethereum === "undefined") {
      navigateTo("/nomask");
      return;
    }

    let accounts;
    try {
      accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
    } catch (error) {
      navigateTo("/nomask");
      return;
    }

    if (!accounts || accounts.length === 0) {
      navigateTo("/nomask");
      return;
    }
    setUser((state) => ({ ...state, address: accounts[0] }));

    if (accounts[0].toLowerCase() !== contractAdmin.toLowerCase()) {
      navigateTo("/");
      return;
    }

    window.ethereum.on("accountsChanged", (accounts) => {
      if (!accounts || accounts.length === 0) {
        navigateTo("/nomask");
        return;
      }
      setUser((state) => ({ ...state, address: accounts[0] }));

      if (accounts[0].toLowerCase() !== contractAdmin.toLowerCase()) {
        navigateTo("/");
        return;
      }
    });
  };

  useEffect(() => {
    checkMetaMask();

    window.scrollTo(0, 0);
  }, []);

  let titleElectionError;
  if (!titleElection) {
    titleElectionError = (
      <div className="default-text size-smaller red">Invalid field</div>
    );
  }

  let descriptionElectionError;
  if (!descriptionElection) {
    descriptionElectionError = (
      <div className="default-text size-smaller red">Invalid field</div>
    );
  }

  let startDateElectionError;
  if (!startDateElection) {
    startDateElectionError = (
      <span className="default-text size-smaller red">Invalid field</span>
    );
  }

  let endDateElectionError;
  if (!endDateElection) {
    endDateElectionError = (
      <span className="default-text size-smaller red">Invalid field</span>
    );
  }

  let startAndEndDatesTooCloseError;
  if (
    startDateElection &&
    endDateElection &&
    Math.round((endDateElection - startDateElection) / (1000 * 60)) < 60 * 24
  ) {
    startAndEndDatesTooCloseError = (
      <span className="default-text size-smaller red">
        Start and end dates should be at least one day apart
      </span>
    );
  }

  let nameCandidateError;
  if (!nameCandidate) {
    nameCandidateError = (
      <div className="default-text size-smaller red">Invalid field</div>
    );
  }

  let descriptionCandidateError;
  if (!descriptionCandidate) {
    descriptionCandidateError = (
      <div className="default-text size-smaller red">Invalid field</div>
    );
  }

  let lessThanTwoCandidatesError;
  if (state.candidatesToBeAdded.length < 2) {
    lessThanTwoCandidatesError = (
      <div className="default-text size-smaller red">
        At least 2 candidates must be added
      </div>
    );
  }

  let addCandidateButton;
  if (state.candidatesToBeAdded.length < 10) {
    addCandidateButton = (
      <div style={{ textAlign: "center" }}>
        <CustomButton
          buttonSize={"btn-size-large"}
          onClick={() => {
            if (!nameCandidateError && !descriptionCandidateError) {
              stateDispatch({
                type: ACTIONS.ADD_CANDIDATE,
                payload: new Candidate(
                  currentCandidateID,
                  nameCandidate,
                  descriptionCandidate
                ),
              });
              currentCandidateID += 1;
              setNameCandidate("");
              setDescriptionCandidate("");
            }
          }}
        >
          ADD CANDIDATE
        </CustomButton>
      </div>
    );
  }

  // if (!state.voter) {
  //   return <div>Loading...</div>;
  // }

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

      <div
        className="default-text size-larger color3"
        style={{ textAlign: "center" }}
      >
        Add election
      </div>

      <div className="form-wrapper">
        <div className="default-text size-large color3">Title:</div>
        <div>
          <input
            type="text"
            className="custom-text-field"
            maxLength="75"
            onChange={(event) => {
              setTitleElection(event.target.value);
            }}
          ></input>
        </div>
        {titleElectionError}

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">Description:</div>
        <div>
          <textarea
            className="custom-textarea"
            maxLength="300"
            rows="4"
            onChange={(event) => {
              setDescriptionElection(event.target.value);
            }}
          ></textarea>
        </div>
        {descriptionElectionError}

        <div style={{ marginBottom: "40px" }}></div>

        <div className="date-form">
          <div>
            <div className="default-text size-large color3">Start date:</div>
            <div className="date-form-component">
              <div style={{ width: "100%" }}>
                <DatePicker
                  className="custom-text-field"
                  showTimeSelect
                  onChange={(date) => {
                    setStartDateElection(date);
                  }}
                  selected={startDateElection}
                  minDate={tomorrow}
                  filterTime={filterPassedTime}
                  dateFormat="dd/MM/yyyy HH:mm"
                  timeFormat="HH:mm"
                ></DatePicker>
              </div>
              <div style={{ marginLeft: "1%" }}>
                <MdDateRange size={30}></MdDateRange>
              </div>
            </div>
            {startDateElectionError}
          </div>

          <div>
            <div className="default-text size-large color3">End date:</div>
            <div className="date-form-component">
              <div style={{ width: "100%" }}>
                <DatePicker
                  className="custom-text-field"
                  showTimeSelect
                  onChange={(date) => {
                    setEndDateElection(date);
                  }}
                  selected={endDateElection}
                  minDate={tomorrow}
                  filterTime={filterPassedTime}
                  dateFormat="dd/MM/yyyy HH:mm"
                  timeFormat="HH:mm"
                ></DatePicker>
              </div>
              <div style={{ marginLeft: "1%" }}>
                <MdDateRange size={30}></MdDateRange>
              </div>
            </div>

            {endDateElectionError}
          </div>
        </div>

        {startAndEndDatesTooCloseError}

        <div style={{ marginBottom: "40px" }}></div>

        <div
          className="default-text size-larger color3"
          style={{ textAlign: "center" }}
        >
          Add up to 10 candidates
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">Name:</div>
        <div>
          <input
            className="custom-text-field"
            type="text"
            value={nameCandidate}
            maxLength="75"
            onChange={(event) => {
              setNameCandidate(event.target.value);
            }}
          ></input>
        </div>
        {nameCandidateError}

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">Description:</div>
        <div>
          <textarea
            className="custom-textarea"
            value={descriptionCandidate}
            maxLength="300"
            rows="4"
            onChange={(event) => {
              setDescriptionCandidate(event.target.value);
            }}
          ></textarea>
        </div>
        {descriptionCandidateError}

        <div style={{ marginBottom: "40px" }}></div>

        {addCandidateButton}

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">
          Candidates to be added:
        </div>

        {lessThanTwoCandidatesError}

        <div style={{ marginBottom: "40px" }}></div>

        <div className="candidate-list">
          <AddCandidateList
            candidates={state.candidatesToBeAdded}
            onClick={(candidateID) =>
              stateDispatch({
                type: ACTIONS.DELETE_CANDIDATE,
                payload: candidateID,
              })
            }
          ></AddCandidateList>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div style={{ textAlign: "center" }}>
          <CustomButton
            buttonSize={"btn-size-large"}
            onClick={() => {
              if (
                !titleElectionError &&
                !descriptionElectionError &&
                !startDateElectionError &&
                !endDateElectionError &&
                !lessThanTwoCandidatesError
              ) {
                console.log("add election");
                window.location.reload();
              }
            }}
          >
            ADD ELECTION
          </CustomButton>
        </div>
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
