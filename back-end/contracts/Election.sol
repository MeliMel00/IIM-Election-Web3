// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Election {
    address public admin;
    uint public totalVoters;
    uint public currentVoters;
    bool public electionEnded;

    struct Candidate {
        string name;
        uint voteCount;
    }

    struct Voter {
        bool registered;
        bool voted;
        string name;
    }

    mapping(address => Voter) public voters;
    Candidate[] public candidates;
    address[] public registeredVoters;

    constructor(address _admin, string[] memory candidateNames, uint _totalVoters) {
        admin = _admin;
        totalVoters = _totalVoters;

        for (uint i = 0; i < candidateNames.length; i++) {
            candidates.push(Candidate(candidateNames[i], 0));
        }
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyDuringElection() {
        require(!electionEnded, "Election ended");
        _;
    }

    function register(string calldata name) external onlyDuringElection {
        require(!voters[msg.sender].registered, "Already registered");
        require(registeredVoters.length < totalVoters, "Max voters reached");

        voters[msg.sender] = Voter(true, false, name);
        registeredVoters.push(msg.sender);
    }

    function vote(uint candidateIndex) external onlyDuringElection {
        Voter storage sender = voters[msg.sender];
        require(sender.registered, "Not registered");
        require(!sender.voted, "Already voted");
        require(candidateIndex < candidates.length, "Invalid candidate");

        candidates[candidateIndex].voteCount++;
        sender.voted = true;
        currentVoters++;
    }

    function endElection() external onlyAdmin {
        require(!electionEnded, "Already ended");
        require(currentVoters * 100 / totalVoters >= 51, "Not enough participation");

        // Trouver le max
        uint highestVotes = 0;
        uint winnerCount = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > highestVotes) {
                highestVotes = candidates[i].voteCount;
                winnerCount = 1;
            } else if (candidates[i].voteCount == highestVotes) {
                winnerCount++;
            }
        }

        require(winnerCount == 1, "Tie: Cannot end with equal top votes");

        electionEnded = true;
    }

    function getCandidate(uint index) external view returns (string memory name, uint voteCount) {
        require(index < candidates.length, "Invalid index");
        Candidate storage candidate = candidates[index];
        return (candidate.name, candidate.voteCount);
    }

    function getTotalCandidates() external view returns (uint) {
        return candidates.length;
    }

    function getRegisteredVoters() external view returns (address[] memory) {
        return registeredVoters;
    }
}
