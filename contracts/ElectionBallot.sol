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

    struct Voter{
        string uid;
        string name;
        bool voted;
    }

    mapping(address => Voter) public voters;
    mapping(string => bool) public registeredIDs;
    mapping(address => bool) public registeredAddrs;
    mapping(uint256 => Candidate) public candidates;
    uint public candidateCount = 1;
    
    bool public ended = false;

    event NewVoter(string msg);
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
        require(msg.sender == owner, "Only admin can access the function");
        _;
    }

    function end() onlyOwner private {
        ended = true;
        emit ElectionEnded(true);
    }

    function addCandidate(string memory _name, string memory _party) onlyOwner public  {
        candidates[candidateCount] = Candidate(candidateCount, _name, _party, 0);
        candidateCount++;
    }

    function voterRegisteration(string memory _name, string memory _uid) public {
        require(!registeredIDs[_uid], "Sorry, this Unique ID has already been registered");
        require(!registeredAddrs[msg.sender], "Voter exists on this address. Please use a different address");

        voters[msg.sender] = Voter(_name, _uid, false);
        emit NewVoter("Successfully registered new voter");
    }

    function vote(uint _candidateId) public{
        require(!voters[msg.sender].voted, "Sorry, you've already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount);

        voters[msg.sender].voted = true;
        candidates[_candidateId].voteCount++;
        emit Voted(_candidateId);
    }

    function declare_results() onlyOwner internal returns(uint id, string memory name) {
        uint count = 0;
        uint winnerId = 0;
        for(uint i = 0 ; i <= candidateCount; i++){
            Candidate storage curr = candidates[i];
            if(curr.voteCount > count){
                winnerId = i;
            }
        }
        emit Results(true, candidates[winnerId].id, candidates[winnerId].name);
        end();
        return (candidates[winnerId].id, candidates[winnerId].name);
    }

    function displayCandidates() public view returns(Candidate [] memory candidatesArr){
        // for frontend
        require(candidateCount > 0, "No registered candidates!");
        candidatesArr = new Candidate[](candidateCount);
        for(uint i = 0 ; i < candidateCount; i++){
            candidatesArr[i] = candidates[i];
        }
        return candidatesArr;
    }
}