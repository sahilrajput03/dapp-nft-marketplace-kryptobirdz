let votingId = 0
const votings = {}

// feat 1
// create new voting
function createVoting(voting_name, options){
	votings[votingId] = {}

	votings[votingId].name	= voting_name
	votings[votingId].options	= options // this should be an array and its id will be used to vote for each option
	votings[votingId].voters	= []
	votings[votingId].votes	= {}
	votingId++

	console.log('voting created')
	return votingId - 1
}

// feat 2
function addVoter(votingId, voter_address){
	votings[votingId].voters.push(voter_address)
	console.log('voter added')
}

// feat 3
function vote(votingId, voteOption, voter_address = "msg.sender"){
	// TODO: check if user has already voted and revert if so
	votings[votingId].votes	= {[voter_address]: true} // to suggest that voter voted
	votings[votingId].options[voteOption]	+= 1
	console.log('voted successfully')
}

let activityVotingId = createVoting('Event Activity', ['Dance Event', 'Singing Event']) //feat1
addVoter(activityVotingId, '0x_address_1') //feat2
vote(activityVotingId, 1,'0x_address_1') //feat3; Also, 1 is the id of th options array

// FEATS: 
// 1. shown only the totalVotes and not which option is voting until all the voters vote for it
// VALIDATIONS
// 1. prevent adding of duplciate address to a voting
// 2. get pending voters of a voting
