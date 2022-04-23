// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Vote {

    modifier isAdmin() {
        require(msg.sender == admin, "Not the administrator");
        _;
    }

    modifier electionExists(uint256 _electionID) {
        require(_electionID >= 1 && _electionID <= elections.length, "Election does not exist");
        _;
    }

    modifier candidateExists(uint256 _candidateID) {
        require(_candidateID >= 1 && _candidateID <= candidates.length, "Candidate does not exist");
        _;
    }

    struct ElectionToCandidate {
        uint256 electionID;
        uint256 candidateID;
    }

    struct Candidate {
        uint256 id;
        string name;
        string description;
        uint64 numberVotes;
    }

    struct CandidateDTO {
        string name;
        string description;
    }

    struct Election {
        uint256 id;
        string title;
        string description;
        uint256 startDate;
        uint256 endDate;
        uint256[] candidatesIDs;
    }

    event NewVote(Candidate candidate);

    address private admin;
    Election[] private elections;   // starts from ID 1, i.e. elections[i] has an election with ID i + 1
    Candidate[] private candidates; // starts from ID 1

    // candidateID not found    => voter not registered
    // candidateID == 0         => voter registered but have not voted yet
    // candidateID >= 1         => voter registered and have voted
    mapping(address => ElectionToCandidate[]) private voters;

    constructor() {
        admin = msg.sender;
    }

    function getElections() external view returns (Election[] memory) {
        return elections;
    }

    function getElectionByID(uint256 _electionID) external view electionExists(_electionID) returns (Election memory) {
        return elections[_electionID - 1];
    }

    function getVoter() external view returns (ElectionToCandidate[] memory) {
        return voters[msg.sender];
    }

    function getCandidatesByElectionID(uint256 _electionID) external view electionExists(_electionID) returns(Candidate[] memory) {
        Candidate[] memory candidatesToReturn = new Candidate[](elections[_electionID - 1].candidatesIDs.length);

        for (uint256 i = 0; i < candidatesToReturn.length; i++) {
            candidatesToReturn[i] = candidates[elections[_electionID - 1].candidatesIDs[i] - 1];
        }

        return candidatesToReturn;
    }

    function addElection(string memory _title, string memory _description, uint256 _startDate, uint256 _endDate, CandidateDTO[] memory _candidatesToAdd, bool _ignoreDatesCheck) external isAdmin {
        require(bytes(_title).length >= 1 && bytes(_title).length <= 75, "Invalid election title");
        require(bytes(_description).length >= 1 && bytes(_description).length <= 300, "Invalid election description");

        if (_ignoreDatesCheck == false) {
            require(_startDate >= block.timestamp, "Election should not start in the past");
            require(_endDate >= _startDate + 30 minutes, "Election should lasts at least 30 minutes");
        }

        require(_candidatesToAdd.length >= 2 && _candidatesToAdd.length <= 10, "Invalid number of candidates");

        for (uint256 i = 0; i < _candidatesToAdd.length; i++) {
            require(bytes(_candidatesToAdd[i].name).length >= 1 && bytes(_candidatesToAdd[i].name).length <= 75, "At least one invalid candidate name");
            require(bytes(_candidatesToAdd[i].description).length >= 1 && bytes(_candidatesToAdd[i].description).length <= 300, "At least one invalid candidate description");
        }

        Election memory electionToAdd = Election(elections.length + 1, _title, _description, _startDate, _endDate, new uint256[](_candidatesToAdd.length));

        for (uint256 i = 0; i < _candidatesToAdd.length; i++) {
            Candidate memory candidateToAdd = Candidate(candidates.length + 1, _candidatesToAdd[i].name, _candidatesToAdd[i].description, 0);
            candidates.push(candidateToAdd);
            electionToAdd.candidatesIDs[i] = candidateToAdd.id;
        }

        elections.push(electionToAdd);
    }

    function registerVoter(address _voter, uint256 _electionID) external isAdmin electionExists(_electionID) {
        require(_voter != admin, "Administrator not allowed to vote");
        
        require(block.timestamp <= elections[_electionID - 1].endDate, "Election ended");

        for (uint256 i = 0; i < voters[_voter].length; i++) {
            require(voters[_voter][i].electionID != _electionID, "Already registered to the election");
        }
        
        voters[_voter].push(ElectionToCandidate(_electionID, 0));
    }

    function vote(uint256 _electionID, uint256 _candidateID) external electionExists(_electionID) candidateExists(_candidateID) {
        require(msg.sender != admin, "Administrator not allowed to vote");

        require(block.timestamp >= elections[_electionID - 1].startDate, "Election not open");
        require(block.timestamp <= elections[_electionID - 1].endDate, "Election ended");
        
        bool isCandidateInElection = false;
        for (uint256 i = 0; i < elections[_electionID - 1].candidatesIDs.length; i++) {
            if (elections[_electionID - 1].candidatesIDs[i] == _candidateID) {
                isCandidateInElection = true;
                break;
            }
        }
        require(isCandidateInElection, "Candidate not in election");

        for (uint256 i = 0; i < voters[msg.sender].length; i++) {
            if (voters[msg.sender][i].electionID == _electionID) {
                if (voters[msg.sender][i].candidateID == 0) {
                    voters[msg.sender][i].candidateID = _candidateID;
                    candidates[_candidateID - 1].numberVotes++;
                    emit NewVote(candidates[_candidateID - 1]);
                    return;
                } else {
                    revert("Already voted");
                }
            }
        }
        revert("Not registered");
    }

}