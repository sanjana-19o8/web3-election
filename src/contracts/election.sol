// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

// This contract represents an Election ballot

contract Election {
    address public owner;

    struct Candidate{
        uint id;
        string name;
        string party;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    uint public candidateCount = 0;
    
    uint public bidderCount = 1;
    bool public ended = false;

    event Voted(uint indexed _candidateId);
    event Results(bool declared, uint CandidateId, string Name);
    event ElectionEnded(bool ended);

    constructor() {
        owner = msg.sender;
    }
    
    modifier isActive(){
        require(!ended, "Election Ended");
        _;
    }
    modifier onlyOwner(){
        require(msg.sender == owner, "Only beneficiary can call the function");
        _;
    }

    function end() onlyOwner private {
        ended = true;
        emit ElectionEnded(true);
    }

    function _addCandidate(string memory _name, string memory _party) onlyOwner private {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, _party, 0);
    }

    function call_election() onlyOwner public{
        require(msg.sender == owner, "Only EC can call the election!");
        require(ended, "Election is currently active.");
        ended = false;
    }

    function vote(uint _candidateId) public{
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidateCount);

        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(_candidateId);
    }

    function declare_results() onlyOwner internal {
        uint count = 0;
        uint winnerId = 0;
        for(uint i = 0 ; i < candidateCount; i++){
            Candidate storage curr = candidates[i];
            if(curr.voteCount > count){
                winnerId = i;
            }
        }
        emit Results(true, candidates[winnerId].id, candidates[winnerId].name);
        end();
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