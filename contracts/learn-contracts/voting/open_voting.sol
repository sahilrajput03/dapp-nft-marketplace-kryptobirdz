// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import 'hardhat/console.sol';

contract OpenVoting {
	uint public votingId;
	mapping(uint => Voting) public votings;
	// votingId => voterAddress => isVoted(bool)
	mapping(uint => mapping(address => bool)) hasVoted;
	// votingId => voteOption(uint) => votes(uint)
	mapping(uint => mapping(uint => uint)) public votes;

	struct Voting {
		uint votingId;
		string name;
		string[] options;
		address[] voters;
	}
	event VotingCreated(string name, string[] options, address[] voters);

	// feat 1
	// create new voting
	function createVoting(
		string memory voting_name,
		string[] memory options,
		address[] memory voters
	) external {
		// console.log(options[0]);
		// console.log(voters[0]);
		votings[votingId].votingId = votingId;
		votings[votingId].name = voting_name;
		votings[votingId].options = options; // this should be an array and its it will be used to vote for each option
		votings[votingId].voters = voters;
		votingId++;
	}

	// feat 2
	function vote(uint _votingId, uint voteOptionIdx) external {
		// TODO: check if user has already voted and revert if so
		require(hasVoted[_votingId][msg.sender] == false, 'You can not vote twice');

		hasVoted[_votingId][msg.sender] = true;
		votes[_votingId][voteOptionIdx] += 1;
	}

	// get all votings
	function getAllVotings() public view returns (Voting[] memory, uint[][] memory) {
		Voting[] memory _votings = new Voting[](votingId);
		uint[][] memory _optionVotes = new uint[][](votingId);
		for (uint i = 0; i < votingId; i++) {
			_votings[i] = votings[i];
			_optionVotes[i] = new uint[](votings[i].options.length);
			for (uint j = 0; j < votings[i].options.length; j++) {
			_optionVotes[i][j] = votes[i][j];
			}
		}
		return (_votings, _optionVotes);
	}

	// get all votes of a Voting
	// function getAllVotes(uint _votingId) external view returns(uint ){
	// 	for(uint i = 0; i < votings[_votingId].options.length; i++){

	// 	}

	// 	return ()
	// }
}

// let activityVotingId = createVoting('Event Activity', ['Dance Event', 'Singing Event'], ['addr1', 'addr2']) //feat1
// vote(activityVotingId, 1) //feat3; Also, 1 is the id of th options array
