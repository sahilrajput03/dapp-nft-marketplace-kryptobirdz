// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//
// => This file is imported in file: `5_2.sol`
//

contract owned {
	address public owner;

	constructor() {
		owner = msg.sender;
	}

	modifier onlyOwner() {
		require(owner == msg.sender, "xxx - U are not the owner");
		_;
	}
}
