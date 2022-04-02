import React, { useState, useReducer, useEffect, useContext } from "react";
import CustomButton from "../components/CustomButton";
import logo from "../assets/logo.svg";
import "./dashboard_voter.css";
import CustomTextField from "../components/CustomTextField";
import { Election } from "../domain/Election";
import { ElectionStatus, VoterStatus } from "../utils/utils";
import "../utils/global.css";
import ElectionList from "../components/ElectionList";
import CustomButtonStatus from "../components/CustomButtonStatus";
import { useNavigate } from "react-router-dom";
import ElectionListOnlyElectionStatus from "../components/ElectionListOnlyElectionStatus";
import { UserContext } from "../context/UserContext";

const ACTIONS = {
  PREVIOUS_PAGE: "PREVIOUS_PAGE",
  NEXT_PAGE: "NEXT_PAGE",
  UPDATE_PAGINATED_ELECTIONS: "UPDATE_PAGINATED_ELECTIONS",
  FETCH_ELECTIONS: "FETCH_ELECTIONS",
  SET_FILTER_TITLE_VALUE: "SET_FILTER_TITLE_VALUE",
  SET_FILTER_DATE_VALUE: "SET_FILTER_DATE_VALUE",
  SET_NUMBER_PAGES: "SET_NUMBER_PAGES",
  FIRST_PAGE: "FIRST_PAGE",
  LAST_PAGE: "LAST_PAGE",
};

const itemsPerPage = 4;

export default function AdminDashboard() {
  const computeNumberPages = (list) => {
    let numberPages;
    if (list.length % itemsPerPage !== 0) {
      numberPages = Math.floor(list.length / itemsPerPage) + 1;
    } else {
      numberPages = Math.floor(list.length / itemsPerPage);
    }
    return numberPages;
  };

  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.PREVIOUS_PAGE:
        return {
          ...state,
          positionStartElections: state.positionStartElections - itemsPerPage,
          positionEndElections: state.positionEndElections - itemsPerPage,
          currentPage: state.currentPage - 1,
        };

      case ACTIONS.NEXT_PAGE:
        return {
          ...state,
          positionStartElections: state.positionStartElections + itemsPerPage,
          positionEndElections: state.positionEndElections + itemsPerPage,
          currentPage: state.currentPage + 1,
        };

      case ACTIONS.UPDATE_PAGINATED_ELECTIONS: {
        let filtered = [...state.elections];
        if (state.filterTitleValue) {
          filtered = filtered.filter((election) =>
            election.title
              .toLowerCase()
              .includes(state.filterTitleValue.toLowerCase())
          );
        }
        if (state.filterDateValue) {
          filtered = filtered.filter(
            (election) =>
              state.filterDateValue >= election.dateStart &&
              state.filterDateValue <= election.dateEnd
          );
        }
        return {
          ...state,
          numberPages: computeNumberPages(filtered),
          paginatedElections: filtered.slice(
            state.positionStartElections,
            state.positionEndElections
          ),
        };
      }

      case ACTIONS.FETCH_ELECTIONS:
        return {
          ...state,
          elections: action.payload,
        };

      case ACTIONS.SET_FILTER_TITLE_VALUE:
        return {
          ...state,
          filterTitleValue: action.payload,
        };

      case ACTIONS.SET_FILTER_DATE_VALUE:
        return {
          ...state,
          filterDateValue: action.payload,
        };

      case ACTIONS.SET_NUMBER_PAGES:
        return {
          ...state,
          numberPages: action.payload,
        };

      case ACTIONS.FIRST_PAGE:
        return {
          ...state,
          positionStartElections: 0,
          positionEndElections: itemsPerPage,
          currentPage: 1,
        };

      case ACTIONS.LAST_PAGE:
        return {
          ...state,
          positionStartElections:
            state.numberPages * itemsPerPage - itemsPerPage,
          positionEndElections: state.numberPages * itemsPerPage,
          currentPage: state.numberPages,
        };
    }
  };

  const initialState = {
    positionStartElections: 0,
    positionEndElections: itemsPerPage,
    currentPage: 1,
    numberPages: 0,
    elections: [],
    paginatedElections: [],
    filterTitleValue: "",
    filterDateValue: "",
  };

  const [state, stateDispatch] = useReducer(stateReducer, initialState);

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    stateDispatch({
      type: ACTIONS.SET_NUMBER_PAGES,
      payload: computeNumberPages(state.elections),
    });
    stateDispatch({ type: ACTIONS.UPDATE_PAGINATED_ELECTIONS });
  }, [state.elections]);

  useEffect(() => {
    let fetchedElections = [
      new Election(
        1,
        "Vote for your mayor",
        new Date(2022, 2, 25),
        new Date(2022, 2, 27),
        ElectionStatus.OPEN,
        VoterStatus.NOT_REGISTERED
      ),
      new Election(
        2,
        "Vote for your president 2022",
        new Date(2022, 3, 5),
        new Date(2022, 3, 7),
        ElectionStatus.NOT_STARTED,
        VoterStatus.NOT_REGISTERED
      ),
      new Election(
        3,
        "Vote for the new law",
        new Date(2022, 2, 15),
        new Date(2022, 2, 17),
        ElectionStatus.ENDED,
        VoterStatus.VOTED
      ),
      new Election(
        4,
        "Vote for your president 4018",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
      new Election(
        5,
        "Vote for your president 5010",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
      new Election(
        6,
        "Vote for your president 6011",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
      new Election(
        7,
        "Vote for your president 7012",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
      new Election(
        8,
        "Vote for your president 8013",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
      new Election(
        9,
        "Vote for your president 9013",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
      new Election(
        10,
        "Vote for your president 10013",
        new Date(2018, 7, 8),
        new Date(2018, 7, 6),
        ElectionStatus.ENDED,
        VoterStatus.NOT_VOTED
      ),
    ];
    stateDispatch({
      type: ACTIONS.FETCH_ELECTIONS,
      payload: fetchedElections.sort((a, b) => b.dateStart - a.dateStart),
    });
  }, []);

  let backPageButton;
  if (state.currentPage > 1) {
    backPageButton = (
      <>
        <div style={{ marginRight: "0.5%" }}>
          <CustomButton
            buttonSize={"btn-size-normal"}
            onClick={() => {
              stateDispatch({ type: ACTIONS.FIRST_PAGE });
              stateDispatch({
                type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
              });
            }}
          >
            {"<<"}
          </CustomButton>
        </div>
        <div>
          <CustomButton
            buttonSize={"btn-size-normal"}
            onClick={() => {
              stateDispatch({ type: ACTIONS.PREVIOUS_PAGE });
              stateDispatch({
                type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
              });
            }}
          >
            {"<"}
          </CustomButton>
        </div>
      </>
    );
  }

  let forwardPageButton;
  if (state.currentPage < state.numberPages) {
    forwardPageButton = (
      <>
        <div>
          <CustomButton
            buttonSize={"btn-size-normal"}
            onClick={() => {
              stateDispatch({ type: ACTIONS.NEXT_PAGE });
              stateDispatch({
                type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
              });
            }}
          >
            {">"}
          </CustomButton>
        </div>
        <div style={{ marginLeft: "0.5%" }}>
          <CustomButton
            buttonSize={"btn-size-normal"}
            onClick={() => {
              stateDispatch({ type: ACTIONS.LAST_PAGE });
              stateDispatch({
                type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
              });
            }}
          >
            {">>"}
          </CustomButton>
        </div>
      </>
    );
  }

  let noElectionsInfo;
  if (state.paginatedElections.length === 0) {
    noElectionsInfo = (
      <div
        className="default-text size-large color3"
        style={{ margin: "1%", textAlign: "center" }}
      >
        No elections
      </div>
    );
  }

  return (
    <div className="all-page-wrapper">
      <div className="header">
        <div>
          <img className="logo-size" src={logo} alt="logo"></img>
        </div>
        <CustomButton
          buttonSize={"btn-size-large"}
          onClick={() => {
            navigate("/admin/add/election");
          }}
        >
          ADD ELECTION
        </CustomButton>
        <div className="default-text size-smaller color3">
          <div style={{ textAlign: "right" }}>Logged in as:</div>
          <div>{user.address}</div>
        </div>
      </div>

      <div className="filter-form">
        <div style={{ flex: 2.5 }}>
          <div
            className="default-text size-large color3"
            style={{ marginBottom: "1%" }}
          >
            Filter by title
          </div>
          <CustomTextField
            width="80%"
            icon="search"
            onChange={(value) =>
              stateDispatch({
                type: ACTIONS.SET_FILTER_TITLE_VALUE,
                payload: value,
              })
            }
          ></CustomTextField>
        </div>
        <div style={{ flex: 1 }}>
          <div
            className="default-text size-large color3"
            style={{ marginBottom: "2%" }}
          >
            Filter by date
          </div>
          <CustomTextField
            icon="date"
            onChange={(value) =>
              stateDispatch({
                type: ACTIONS.SET_FILTER_DATE_VALUE,
                payload: value,
              })
            }
          ></CustomTextField>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <CustomButton
          buttonSize={"btn-size-large"}
          onClick={() => {
            stateDispatch({
              type: ACTIONS.FIRST_PAGE,
            });
            stateDispatch({
              type: ACTIONS.UPDATE_PAGINATED_ELECTIONS,
            });
          }}
        >
          FILTER
        </CustomButton>
      </div>

      {noElectionsInfo}

      <ElectionListOnlyElectionStatus
        elections={state.paginatedElections}
        onClick={(electionID) => navigate(`/admin/election/${electionID}`)}
      ></ElectionListOnlyElectionStatus>

      <div className="page-buttons">
        {backPageButton}
        <div style={{ margin: "0 0.5% 0 0.5%" }}>
          <CustomButtonStatus
            buttonSize={"btn-size-normal"}
            buttonStyle={"btn-status-color3"}
          >
            {state.currentPage}
          </CustomButtonStatus>
        </div>
        {forwardPageButton}
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
