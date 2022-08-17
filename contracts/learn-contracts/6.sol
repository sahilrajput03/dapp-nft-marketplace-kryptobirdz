// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// This contract is *inspired* from 3.sol and https://solidity-by-example.org/payable/

contract Contract6 {
	uint256 public balance; // initial value is 0

	// Adding money to contract address from thin air IMO ~Sahil
	function getMoney() public payable {
		balance += msg.value;
	}

	// Transfer money from contract to given account ~Sahil
	function withdraw(address payable to, uint256 amt) public {
		balance -= amt;
		to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
	}
}
