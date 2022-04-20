import React, { useReducer, useEffect, useContext, useState } from "react";
import CustomButton from "../components/CustomButton";
import logo from "../assets/logo.svg";
import "./dashboard_voter.css";
import CustomTextField from "../components/CustomTextField";
import {
  computeElectionStatus,
  contractAddress,
  contractAdmin,
} from "../utils/utils";
import "../utils/global.css";
import CustomButtonStatus from "../components/CustomButtonStatus";
import { useNavigate } from "react-router-dom";
import ElectionListOnlyElectionStatus from "../components/ElectionListOnlyElectionStatus";
import { UserContext } from "../context/UserContext";
import { ElectionAdmin } from "../domain/ElectionAdmin";
import { ethers } from "ethers";
import Vote from "contracts/Vote.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

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

const computeNumberPages = (list) => {
  let numberPages;
  if (list.length % itemsPerPage !== 0) {
    numberPages = Math.floor(list.length / itemsPerPage) + 1;
  } else {
    numberPages = Math.floor(list.length / itemsPerPage);
  }
  return numberPages;
};

export default function AdminDashboard() {
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
          filtered = filtered.filter((election) => {
            let dateStartMidnight = new Date(election.dateStart);
            dateStartMidnight.setHours(0, 0, 0, 0);

            let dateEndMidnight = new Date(election.dateEnd);
            dateEndMidnight.setHours(0, 0, 0, 0);

            return (
              state.filterDateValue >= dateStartMidnight &&
              state.filterDateValue <= dateEndMidnight
            );
          });
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

  const [isMetaMaskChecked, setIsMetaMaskChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user, setUser } = useContext(UserContext);
  const navigateTo = useNavigate();

  useEffect(() => {
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
        window.location.reload();
      });

      setIsMetaMaskChecked(true);
    };

    checkMetaMask();
  }, []);

  useEffect(() => {
    if (!isMetaMaskChecked) {
      return;
    }

    const fetchElections = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Vote.abi, provider);

      let fetchedElections;
      try {
        fetchedElections = await contract.getElections();
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch {
        navigateTo("/404");
        return;
      }

      const elections = fetchedElections
        .map((election) => {
          const fetchedStartDate =
            new Date(election["startDate"].toNumber()) * 1000;
          const fetchedEndDate =
            new Date(election["endDate"].toNumber()) * 1000;
          return new ElectionAdmin(
            election["id"].toNumber(),
            election["title"],
            fetchedStartDate,
            fetchedEndDate,
            computeElectionStatus(fetchedStartDate, fetchedEndDate)
          );
        })
        .sort((a, b) => b.dateStart - a.dateStart);

      stateDispatch({
        type: ACTIONS.FETCH_ELECTIONS,
        payload: elections,
      });

      setIsLoading(false);
    };

    fetchElections();
  }, [isMetaMaskChecked]);

  useEffect(() => {
    stateDispatch({
      type: ACTIONS.SET_NUMBER_PAGES,
      payload: computeNumberPages(state.elections),
    });
    stateDispatch({ type: ACTIONS.UPDATE_PAGINATED_ELECTIONS });
  }, [state.elections]);

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

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
        }}
      >
        <ClimbingBoxLoader
          color={"#00458b"}
          loading={isLoading}
          size={25}
        ></ClimbingBoxLoader>
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
            navigateTo("/admin/add/election");
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
            withTime={false}
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
        onClick={(electionID) => navigateTo(`/admin/election/${electionID}`)}
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
