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

//? @@@@@@@ LEARN: Tested this contract via Remix IDE and it works really well!

contract DistributedWallet {
	// Balance of the contract
	uint public balance; // initial value is 0
	address public owner;
	bool public pause;

	// Using `Payment` to create a payment struct instance ~Sahil
	// Payment memory pay = Payment(msg.value, block.timestamp);
	struct Payment {
		uint amt;
		uint timestampe;
	}
	struct Account {
		uint totBal; // total balance of a address/person
		uint paymentIndex; // paymentIndex of the payment (number of payments have occured), default value: 0
		mapping(uint => Payment) getPayment; // we can get the any payment details by calling this `getPayment` mapping with a paymentIndex value, i.e., `getPayment[somePaymentIndex]`
	}
	// LEARN: A mapping is called with keys using square bracket notation
	// mapping of balance (balance will be mapped to each account number)
	mapping(address => Account) public getAccount;

	// Our Events
	event sendMoneyAlert(address indexed add1, uint amt1);
	event receiveMoneyAlert(address indexed add2, uint amt2);

	constructor() {
		owner = msg.sender;
	}

	// Get balance of contract (this is redundant {but we need to make it according to our project requirements} to use coz `balance` is public and can be accessed directly from all users directly)
	function getBalance() public view checkPause returns (uint) {
		return getAccount[msg.sender].totBal;

		// my old code
		// return balance;
	}

	// This modifier can be better named as `checkIsOwner` as well ~Sahil
	modifier onlyOwner() {
		require(owner == msg.sender, 'xxx - U are not the owner');
		_; // This is called placeholder
	}

	modifier checkPause() {
		require(pause == false, 'Contract is paused temporarily, please ask the owner to unpause it.');
		_;
	}

	function changePause(bool val) public onlyOwner {
		pause = val;
	}

	// Send money to contract
	function sendMoney() public payable checkPause {
		getAccount[msg.sender].totBal += msg.value;
		getAccount[msg.sender].paymentIndex += 1;
		Payment memory pay = Payment(msg.value, block.timestamp);
		uint userPaymentIndex = getAccount[msg.sender].paymentIndex;
		getAccount[msg.sender].getPayment[userPaymentIndex] = pay;

		emit sendMoneyAlert(msg.sender, msg.value);

		// my old code
		// balance += msg.value;
	}

	// Withdraw to a particular given account
	function withdraw(uint amt) public checkPause onlyOwner {
		require(getAccount[msg.sender].totBal >= amt, 'Not enough funds in your account.');
		getAccount[msg.sender].totBal -= amt;
		// msg.sender.tranfer(amt); // DEPRECATED IMO (from swapnil's course)
		payable(msg.sender).transfer(amt); // https://stackoverflow.com/a/66297057/10012446
		emit receiveMoneyAlert(msg.sender, amt);

		// my old code
		// assert(amt <= balance);
		// balance -= amt;
		// to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
	}

	// We cannot  use `checkPause` modifier with `convert` function becoz convert is `pure` and thus it cannot read anything from Contract i.e., variables, members, etc
	function convert(uint amountInWei) public pure returns (uint) {
		return amountInWei / 1 ether;
		// return amountInWei / 10**18; // ~ I haven't tested it yet ~Sahil
	}

	// What does destroy do?
	// Ans. Since any anything on blockchian can not be deleted the contract will be there for always but its state will be changed till the latest block and after that block no state will be changed but if you send some funds to some `selfdestructed` contract you'll the funds.
	function destroy(address payable targetAddress) public onlyOwner {
		// This will transfer all the funds of the smart contract to the sender
		selfdestruct(targetAddress); // transfer to the targetAddress address passed as argument by the caller
		// selfdestruct(payable(address(this))); // ~ (not tested yet) use this to transfer to the owner
	}
}
