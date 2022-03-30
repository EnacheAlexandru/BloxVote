import React, { useEffect, useReducer } from "react";
import "./admin_add_election.css";
import "../utils/global.css";
import "../utils/footer.css";
import logo from "../assets/logo.svg";
import { Voter } from "../domain/Voter";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CustomButton from "../components/CustomButton";
import { Candidate } from "../domain/Candidate";
import AddCandidateList from "../components/AddCandidateList";

const ACTIONS = {
  SET_TOTAL_VOTES: "SET_TOTAL_VOTES",
  ACTIONS_INIT: "ACTIONS_INIT",
};

const candidatesToBeAdded = [
  new Candidate(1, "John Manner", "I want to make lots of parks!"),
  new Candidate(
    2,
    "Umbert Gothium",
    "I want to make a new hospital and a new mall for my lovely citizens!aaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaaaaaaaa aaaaaaaaaaa aaaaaaaaa aaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa aaaaaaaaaaaaa"
  ),
  new Candidate(3, "Cassandra Biggiy", "I want to build an airport!"),
];

export default function AdminAddElection() {
  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.INIT:
        return {
          ...state,
          voter: action.payload.fetchedVoter,
        };
    }
  };

  const initialState = {
    voter: null,
    selectedStartDate: "",
    selectedEndDate: "",
  };

  const [state, stateDispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchedVoter = new Voter(
      "0xbfc06bd91802ceccefdac434412a56be26e501d4",
      {
        3: null,
        4: 1,
      }
    );

    stateDispatch({
      type: ACTIONS.INIT,
      payload: {
        fetchedVoter: fetchedVoter,
      },
    });
  }, []);

  if (!state.voter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        <div className="default-text size-smaller color3">
          <div>Logged in as:</div>
          <div>{state.voter.address}</div>
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
            //onChange={(event) => onChange(event.target.value)}
          ></input>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">Description:</div>
        <div>
          <textarea
            className="custom-textarea"
            maxLength="300"
            rows="4"
            //onChange={(event) => onChange(event.target.value)}
          ></textarea>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div className="date-form">
          <div className="date-form-component">
            <div className="default-text size-large color3">Start date:</div>
            <div style={{ margin: "0 2% 0 2%" }}>
              <DatePicker
                className="custom-text-field"
                onChange={(date) => {
                  //onChange(date);
                  //setSelectedDate(date);
                }}
                selected={state.selectedStartDate}
                dateFormat="dd/MM/yyyy"
              ></DatePicker>
            </div>
            <div>
              <MdDateRange
                size={30}
                style={{ marginRight: "1%" }}
              ></MdDateRange>
            </div>
          </div>
          <div
            className="date-form-component"
            style={{ justifyContent: "end" }}
          >
            <div className="default-text size-large color3">End date:</div>
            <div style={{ margin: "0 2% 0 2%" }}>
              <DatePicker
                className="custom-text-field"
                onChange={(date) => {
                  //onChange(date);
                  //setSelectedDate(date);
                }}
                selected={state.selectedEndDate}
                dateFormat="dd/MM/yyyy"
              ></DatePicker>
            </div>
            <div>
              <MdDateRange
                size={30}
                style={{ marginRight: "1%" }}
              ></MdDateRange>
            </div>
          </div>
        </div>

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
            type="text"
            className="custom-text-field"
            maxLength="75"
            //onChange={(event) => onChange(event.target.value)}
          ></input>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">Description:</div>
        <div>
          <textarea
            className="custom-textarea"
            maxLength="300"
            rows="4"
            //onChange={(event) => onChange(event.target.value)}
          ></textarea>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div style={{ textAlign: "center" }}>
          <CustomButton
            buttonSize={"btn-size-large"}
            onClick={() => {
              // stateDispatch({ type: ACTIONS.FIRST_PAGE });
              // stateDispatch({
              //   type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
              // });
            }}
          >
            ADD CANDIDATE
          </CustomButton>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div className="default-text size-large color3">
          Candidates to be added:
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div>
          <AddCandidateList
            candidates={candidatesToBeAdded}
            onClick={() => console.log("lol")}
          ></AddCandidateList>
        </div>

        <div style={{ marginBottom: "40px" }}></div>

        <div style={{ textAlign: "center" }}>
          <CustomButton
            buttonSize={"btn-size-large"}
            onClick={() => {
              // stateDispatch({ type: ACTIONS.FIRST_PAGE });
              // stateDispatch({
              //   type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
              // });
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
