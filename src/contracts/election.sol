// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

// This contract represents an Election ballot

contract Election {
    address public owner;

    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidateCount = 0;

    event votedEvent(uint indexed _candidateId);

    constructor() {
        owner = msg.sender;
    }

    function _addCandidate(string memory _name) private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    function election(string memory _name) public{
        require(msg.sender == owner, "Only EC can add candidates!");
        _addCandidate(_name);
    }

    function vote(uint _candidateId) public{
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidateCount);

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    function displayCandidates() public view returns(Candidate [] memory candyArr){
        // for frontend
        require(candidateCount > 0, "No registered candidates!");
        candyArr = new Candidate[](candidateCount);
        for(uint i = 0 ; i < candidateCount; i++){
            candyArr[i] = candidates[i];
        }
        return candyArr;
    }
}