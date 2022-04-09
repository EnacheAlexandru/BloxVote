// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Vote {

    enum ElectionStatus {
        NOT_STARTED, OPEN, ENDED
    }

    function areStringEqual(string memory _a, string memory _b) private pure returns (bool) {
        return keccak256(abi.encodePacked(_a)) == keccak256(abi.encodePacked(_b));
    }

    function stringToElectionStatus(string memory _stringElectionStatus) private pure returns (ElectionStatus) {
        if (areStringEqual(_stringElectionStatus, "NOT_STARTED")) {
            return ElectionStatus.NOT_STARTED;
        }
        if (areStringEqual(_stringElectionStatus, "OPEN")) {
            return ElectionStatus.OPEN;
        }
        if (areStringEqual(_stringElectionStatus, "ENDED")) {
            return ElectionStatus.ENDED;
        }
        revert("Invalid election status");
    }

    function electionStatusToString(ElectionStatus _electionStatus) private pure returns (string memory) {
        if (_electionStatus == ElectionStatus.NOT_STARTED) {
            return "NOT_STARTED";
        }
        if (_electionStatus == ElectionStatus.OPEN) {
            return "OPEN";
        }
        if (_electionStatus == ElectionStatus.ENDED) {
            return "ENDED";
        }
        revert("Invalid election status");
    }

    modifier isAdmin() {
        require(msg.sender == admin, "Not the administrator");
        _;
    }

    struct ElectionToCandidate {
        uint32 election;
        uint32 candidate;
    }

    struct Candidate {
        uint32 id;
        string name;
        string description;
        uint32 numberVotes;
    }

    struct CandidateDTO {
        string name;
        string description;
    }

    struct Election {
        uint32 id;
        string title;
        string description;
        uint256 dateStart;
        uint256 dateEnd;
        ElectionStatus electionStatus;
        uint32[] candidates;
    }

    address private admin;
    Election[] private elections;
    Candidate[] private candidates;

    mapping(address => ElectionToCandidate[]) private voters;

    constructor() {
        admin = msg.sender;
    }

    function getElections() public view returns (Election[] memory) {
        return elections;
    }

    function addElection(string memory _title, string memory _description, uint256 _dateStart, uint256 _dateEnd, CandidateDTO[] memory _candidates) external isAdmin {
        require(bytes(_title).length >= 1 && bytes(_title).length <= 75, "Invalid election title");
        require(bytes(_description).length >= 1 && bytes(_description).length <= 300, "Invalid election description");

        //TODO: check dateStart and dateEnd
        
        require(_candidates.length >= 2 && _candidates.length <= 10, "Invalid number of candidates");

        for (uint i = 0; i < _candidates.length; i++) {
            require(bytes(_candidates[i].name).length >= 1 && bytes(_candidates[i].name).length <= 75, "At least one invalid candidate name");
            require(bytes(_candidates[i].description).length >= 1 && bytes(_candidates[i].description).length <= 300, "At least one invalid candidate description");
        }

        uint32 current = 0;
        Election memory electionToAdd = Election(uint32(elections.length), _title, _description, _dateStart, _dateEnd, ElectionStatus.NOT_STARTED, new uint32[](_candidates.length));

        for (uint i = 0; i < _candidates.length; i++) {
            Candidate memory candidateToAdd = Candidate(uint32(candidates.length), _candidates[i].name, _candidates[i].description, 0);
            candidates.push(candidateToAdd);
            electionToAdd.candidates[current] = candidateToAdd.id;
            current++;
        }

        elections.push(electionToAdd);
    }

}