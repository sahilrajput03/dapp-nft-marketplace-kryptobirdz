// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * Features of the project:
 * - Contract must have properties i.e., totalBalance, paymentNumber, payment (amt, timestamp)
 * - getBalance() to get contract's balance --- function of view type
 * - sendMoney() to send money to contract
 * - withdrawMoney() to get money from contract to one's own account
 * - convert() to convert wei to eth --- use 10**18 as division simply
 * - destroy() to destroy the contract (*callable by owner only)
 * - pause() to pause the contract (*callable by owner only)
 *
 * pending feats: pause, convert, paymentNumber, payment (amt, timestamp)
 */

contract DistributedWalletMinimal {
	// Balance of the contract
	uint public balance; // initial value is 0
	address public owner;

	constructor() {
		owner = msg.sender;
	}

	// Get balance of contract (this is redundant {but we need to make it according to our project requirements} to use coz `balance` is public and can be accessed directly from all users directly)
	function getBalance() public view returns (uint) {
		return balance;
	}

	modifier onlyOwner() {
		require(owner == msg.sender, 'xxx - U are not the owner');
		_;
	}

	// Send money to contract
	function sendMoney() public payable {
		balance += msg.value;
	}

	// Withdraw to a particular given account
	function withdraw(address payable to, uint amt) public onlyOwner {
		assert(amt <= balance);
		balance -= amt;
		to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
	}

	function destructTheContract() public {
		selfdestruct(payable(address(this)));
	}
}
