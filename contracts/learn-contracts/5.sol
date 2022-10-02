// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// You can get above spdx and pragma instructions via shorthands i.e., spdx and pragm

// Video 19: Errror Handling ~ Swapnil Course

// require(), assert(), revert() in solidity docs: https://docs.soliditylang.org/en/v0.8.9/control-structures.html#error-handling-assert-require-revert-and-exceptions
import "hardhat/console.sol";

contract Contract5 {
	uint public balance; // initial value is 0
	address public owner;

	constructor() {
		owner = msg.sender;
	}

	modifier onlyOwner() {
		require(owner == msg.sender, "xxx - U are not the owner");
		_;
		// Learn how placeholder i.e., `_` like we have in above line work?
		// Ans. It is like to whatever function we apply our `onlyOwner` modifier then whenever that function is called all code of that function will first put in the place of placeholder and then the all the code of the modifer will be run. So that means that the code of before the placeholder will be run before the code of the function code. COOL..
	}

	// Adding money to contract address from thin air IMO ~Sahil
	function getMoney() public payable {
		if (msg.sender != owner) {
			revert("Not owner");
		}
		balance += msg.value;
	}

	// Transfer money from contract to given account ~Sahil
	function withdraw(uint amt) public onlyOwner {
		// ? We dont' need require statement here coz we extracted the code of require to our modifier i.e, `onlyOwner`, yo!
		// ? // require(owner == msg.sender, "xxx - U are not the owner");
		
		// console.log('calling now():', now()); // compiler throws `"now" has been deprecated. Use "block.timestamp" instead.`
		assert(amt <= balance);

		balance -= amt;
		// to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
	}

	uint public targetAmount = 7 ether;
	// ^ This equals to 7 * 10**18 in value

	// #destory contract, #selfdestruct, #delete contract
	// function destructTheContract()public{
	//     selfdestruct(address); // DOESN'T WORK
	// ? @@@@ LEARN Below is the new syntax according to: https://stackoverflow.com/a/70672198/10012446
	//     selfdestruct(payable(address(this)));
	// }
}
