// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// You can get above spdx and pragma instructions via shorthands i.e., spdx and pragm

contract Contract3 {
	uint public balance; // initial value is 0

	// Adding money to contract address from the sender's account ~Sahil
	function getMoney() public payable {
		balance += msg.value;
	}

	// Transfer money from contract to given account ~Sahil
	function withdraw(address payable to, uint amt) public {
		balance -= amt;
		to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
	}
}
