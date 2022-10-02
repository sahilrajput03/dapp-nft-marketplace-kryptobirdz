// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

//1. This contract is *inspired* from 3.sol and https://solidity-by-example.org/payable/
//2. And from this: https://solidity-by-example.org/payable/

// LEARN: SOURCE: https://ethereum.stackexchange.com/a/109508/106687
// payable() function: What was it used for?
// FROM DOCS - https://docs.soliditylang.org/en/v0.8.7/080-breaking-changes.html?highlight=payable#new-restrictions
// Address literals have the type `address` instead of `address payable`. They can be converted to `address payable` by using an explicit conversion, e.g. `payable(0xdCad3a6d3569DF655070DEd06cb7A1b2Ccd1D3AF)`.
// TLDR: To convert type from `address` to `address payable` ```payable()``` function was used before Solidity version:0.8.x

// OBJECTIVE: Learn the foo.call{value: amount}("") syntax to send some amount to `foo` address ~Sahil

contract Contract6 {
	uint256 public balance; // initial value is 0
	// Payable address can receive Ether
	address payable public owner;

	// Payable constructor can receive Ether
	constructor() payable {
		// owner = msg.sender;
		// ~Sahil ^^^: Comiler throws exception: Type `address` is not implicitly convertible, expected type `address payable`
		owner = payable(msg.sender);
		// Now, `owner` is the creator of this contract ~Sahil
	}

	// ?@@@@ Read this: Works phenomenally ~Sahil
	// Function to deposit Ether into this contract.
	// Call this function along with some Ether.
	// The balance of this contract will be automatically updated.
	function deposit() public payable {}

	// ~Sahil: Contract's balance is not the owner's balance, contract balance is the balance of the contract itself.
	function getContractBalance() external view returns (uint) {
		return address(this).balance;
	}

	// Function to withdraw all Ether from this contract to the owner
	function withdrawToOwner() public {
		// get the amount of Ether stored in this contract
		uint amount = address(this).balance;

		// send all Ether to owner (i.e., contract creator ~Sahil)
		// Owner can receive Ether since the address of owner is payable
		(bool success, ) = owner.call{value: amount}('');
		require(success, 'Failed to send Ether');
		// ~Sahil: ^ I din't find a way mimic any test for this require on failure event.
	}

	// Call this function along with some Ether. ~ https://solidity-by-example.org/payable/
	// The function will throw an error since this function is not payable.
	function notPayable() public {}

	// ~Sahil
	function deleteOwner() public {
		owner = payable(0);
	}

	function getOwnerAddress() public view returns (address) {
		return owner;
	}

	// from: https://solidity-by-example.org/hacks/self-destruct/
	function withdrawToAny() public {
		// require(msg.sender == winner, "Not winner");

		(bool sent, ) = msg.sender.call{value: address(this).balance}('');
		require(sent, 'Failed to send Ether');
	}

	// Adding money to contract address from thin air IMO ~Sahil
	// function getMoney() public payable {
	// 	balance += msg.value;
	// }

	//? LEARN: (TIP: WE HAVE DONE `to.transfer`/`withdraw()` and have a test for `contract3` and `contract5` i.e., 3.sol and 5.sol)
	// Transfer money from contract to given account ~Sahil
	// function withdraw(address payable to, uint256 amt) public {
	// 	balance -= amt;
	// 	to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
	// }
}
