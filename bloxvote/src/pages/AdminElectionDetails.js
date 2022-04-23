import React, { useReducer, useEffect, useState, useContext } from "react";
import "./election_details_voter.css";
import "../utils/global.css";
import logo from "../assets/logo.svg";
import { Candidate } from "../domain/Candidate";
import {
  computeElectionStatus,
  contractAddress,
  contractAdmin,
  dateToString,
  ElectionStatus,
} from "../utils/utils";
import CustomButtonStatus from "../components/CustomButtonStatus";
import CustomButton from "../components/CustomButton";
import { UserContext } from "../context/UserContext";
import CandidateListNoVote from "../components/CandidateListNoVote";
import { ElectionDetailsAdmin } from "../domain/ElectionDetailsAdmin";
import { useNavigate, useParams } from "react-router-dom";
import { ethers } from "ethers";
import Vote from "contracts/Vote.json";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";

const ACTIONS = {
  SET_CANDIDATES_TOTAL_VOTES: "SET_CANDIDATES_TOTAL_VOTES",
  SET_ELECTION: "SET_ELECTION",
  NEW_VOTE: "NEW_VOTE",
};

const computeTotalVotes = (candidates) => {
  let totalVotes = 0;
  candidates.forEach(
    (candidate) => (totalVotes = totalVotes + candidate.numberVotes)
  );
  return totalVotes;
};

export default function AdminElectionDetails() {
  const stateReducer = (state, action) => {
    switch (action.type) {
      case ACTIONS.SET_CANDIDATES_TOTAL_VOTES:
        return {
          ...state,
          candidates: action.payload.candidates,
          totalVotes: action.payload.totalVotes,
        };
      case ACTIONS.SET_ELECTION:
        return {
          ...state,
          election: action.payload,
        };
      case ACTIONS.NEW_VOTE: {
        const updatedCandidates = state.candidates.map((candidate) => {
          if (action.payload.id == candidate.id) {
            return { ...action.payload };
          }
          return { ...candidate };
        });
        const updatedTotalVotes = computeTotalVotes(updatedCandidates);
        return {
          ...state,
          candidates: updatedCandidates,
          totalVotes: updatedTotalVotes,
        };
      }
    }
  };

  const initialState = {
    election: null,
    candidates: [],
    totalVotes: 0,
  };

  const [state, stateDispatch] = useReducer(stateReducer, initialState);

  const [isMetaMaskChecked, setIsMetaMaskChecked] = useState(false);
  const [isElectionLoaded, setIsElectionLoaded] = useState(false);
  const [areCandidatesLoaded, setAreCandidatesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConfirmation, setIsLoadingConfirmation] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const navigateTo = useNavigate();
  const { electionID } = useParams();

  const [voterAddressToRegister, setVoterAddressToRegister] = useState("");

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

    const fetchElection = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Vote.abi, provider);

      let fetchedElection;
      try {
        fetchedElection = await contract.getElectionByID(electionID);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch {
        navigateTo("/404");
        return;
      }

      const fetchedStartDate =
        new Date(fetchedElection["startDate"].toNumber()) * 1000;
      const fetchedEndDate =
        new Date(fetchedElection["endDate"].toNumber()) * 1000;
      const election = new ElectionDetailsAdmin(
        fetchedElection["id"].toNumber(),
        fetchedElection["title"],
        fetchedElection["description"],
        fetchedStartDate,
        fetchedEndDate,
        computeElectionStatus(fetchedStartDate, fetchedEndDate)
      );

      stateDispatch({
        type: ACTIONS.SET_ELECTION,
        payload: election,
      });

      setIsElectionLoaded(true);
    };

    fetchElection();
  }, [isMetaMaskChecked]);

  useEffect(() => {
    if (!isElectionLoaded) {
      return;
    }

    const fetchCandidates = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Vote.abi, provider);

      let fetchedCandidates;
      try {
        fetchedCandidates = await contract.getCandidatesByElectionID(
          electionID
        );
      } catch {
        navigateTo("/404");
        return;
      }

      const candidates = fetchedCandidates.map((candidate) => {
        return new Candidate(
          candidate["id"].toNumber(),
          candidate["name"],
          candidate["description"],
          candidate["numberVotes"].toNumber()
        );
      });

      const totalVotes = computeTotalVotes(candidates);

      stateDispatch({
        type: ACTIONS.SET_CANDIDATES_TOTAL_VOTES,
        payload: {
          candidates: candidates,
          totalVotes: totalVotes,
        },
      });

      setAreCandidatesLoaded(true);
    };

    fetchCandidates();
  }, [isElectionLoaded]);

  useEffect(() => {
    if (!areCandidatesLoaded) {
      return;
    }

    const createVoteListener = () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, Vote.abi, provider);

      contract.on("NewVote", (candidate) => {
        const updatedCandidate = new Candidate(
          candidate["id"].toNumber(),
          candidate["name"],
          candidate["description"],
          candidate["numberVotes"].toNumber()
        );
        stateDispatch({
          type: ACTIONS.NEW_VOTE,
          payload: updatedCandidate,
        });
      });

      setIsLoading(false);
    };

    createVoteListener();
  }, [areCandidatesLoaded]);

  const clearRegisterVoter = () => {
    setVoterAddressToRegister("");
  };

  const requestRegisterVoter = async () => {
    setIsLoadingConfirmation(true);

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, Vote.abi, signer);

    try {
      const transaction = await contract.registerVoter(
        voterAddressToRegister,
        electionID
      );
      await transaction.wait();
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (e) {
      if (e.hasOwnProperty("data")) {
        toast.error(e.data.message.split(" ").slice(6).join(" "), {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Error processing data", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      setIsLoadingConfirmation(false);
      return;
    }

    toast.success("Voter registered successfully!", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    clearRegisterVoter();

    setIsLoadingConfirmation(false);
  };

  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "3%",
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

  if (isLoadingConfirmation) {
    return (
      <div>
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "3%",
          }}
        >
          <ClimbingBoxLoader
            color={"#00458b"}
            loading={isLoadingConfirmation}
            size={25}
          ></ClimbingBoxLoader>
          <div className="default-text size-smaller color3">
            Please confirm your request in the pop-up window.
          </div>
        </div>
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

  let registerVoterForm;
  let voterAddressToRegisterError;
  if (state.election.electionStatus !== ElectionStatus.ENDED) {
    if (!/^0x[0-9A-Fa-f]{40}$/.test(voterAddressToRegister)) {
      voterAddressToRegisterError = (
        <div className="default-text size-smaller red">Invalid format</div>
      );
    }

    registerVoterForm = (
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
                requestRegisterVoter();
              }
            }}
          >
            REGISTER
          </CustomButton>
        </div>
      </div>
    );
  }

  return (
    <div className="all-page-wrapper">
      <div className="header">
        <div className="cursor-pointer">
          <img
            className="logo-size"
            src={logo}
            alt="logo"
            onClick={() => navigateTo("/admin")}
          ></img>
        </div>

        <div className="default-text size-smaller color3">
          <div style={{ textAlign: "right" }}>Logged in as:</div>
          <div>{user.address}</div>
        </div>
      </div>

      {registerVoterForm}

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
