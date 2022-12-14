// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// You can get above spdx and pragma instructions via shorthands i.e., spdx and pragm
import "hardhat/console.sol";

contract Contract4 {
	event msgDetails(address msgSenderAddr, uint256 msgValueInWeiWithMessage, uint amount, uint256 gasLeft);

	//! LEARN: This throws error possibly becoz console.log can only be run inside the function calls
	// console.log('hello');

	// Adding money to contract address from thin air IMO ~Sahil
	function getMsgDetails() public payable {
		// FYI: If I use visibility "public"  instead of "public payable" I get following error for usage of `msg.value`:
		// "msg.value" and "callbalue()" can only be used in "payable public" functions. Make the function "payable" or use an "internal" function to avoid this error.

		// msg.sender is the address of the `firstAccAddr` from 20 demo accounts of the hardhat node.
		// msg.value is zero by default
		// address(this).balance is the balance of contract, zero by default
		// msg.gas: remaining gas deprecated in 0.4.21, please use gasleft() instead
		emit msgDetails(msg.sender, msg.value, address(this).balance, gasleft());

		// console.log('Balance of contract:', address(this).balance);
		// console.log('Timestamp of block', block.timestamp);
	}

	function isTwoDigitNumber() public payable {
		// Throw err 'give number is smaller' when msg.value is *not* a two digit number
		require(msg.value > 9, "give number's is smaller");
	}

	function getSomeTimeStamp() public view returns (uint) {
		return block.timestamp;
	}
}
