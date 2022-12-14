// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/**
 * THIS IS HELLO WOLRD IN SOLIDITY CONTRACTS.
 * We don't need this at all so you may delete this file. ~TJ
 */

// Import this file to use console.log
import "hardhat/console.sol";

contract Lock {
	uint public unlockTime;
	address payable public owner;

	event Withdrawal(uint amount, uint when);

	constructor(uint _unlockTime) payable {
		// console.log('INFO: Lock Contract: constructor invoked');
		require(block.timestamp < _unlockTime, "Unlock time should be in the future");

		unlockTime = _unlockTime;
		owner = payable(msg.sender);
	}

	function withdraw() public {
		// Uncomment this line to print a log in your terminal
		// console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
		// console.log("Unlock time is", unlockTime,  "and block timestamp is ", block.timestamp);
		// console.log(msg.sender);

		require(block.timestamp >= unlockTime, "You can't withdraw yet");
		require(msg.sender == owner, "You aren't the owner");

		emit Withdrawal(address(this).balance, block.timestamp);

		owner.transfer(address(this).balance);
	}
}
