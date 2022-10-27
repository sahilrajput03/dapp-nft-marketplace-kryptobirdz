// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import 'hardhat/console.sol';

contract Contract8 {
	event myEvent(string name);

	fallback() external {
		emit myEvent('fallback-function-works-yoo');
		// console.log('fallback fn called'); // Works well
	}
}

contract Contract9 {
	event myEvent(string name);

	// LEARN: Below fallback fn throws warning like: // ! Warning: This contract has a payable fallback function, but no receive ether function. Consider adding a receive ether function.
	fallback() external payable {
		emit myEvent('fallback-function-works-yoo');
	}
}

contract Contract10 {
	event myEvent(string name);

	// We just need to send a transaction to the address of the contract with some ether in it but without targeting any function and below fn will be triggered automatically. Learn: We don't need fn body such receive fn
	// LEARN: If we remove `payable` from the below receive function then compiler throws error: //! DeclarationError: Receive ether function must be payable, but is "nonpayable".
	receive() external payable {
		// console.log('receive?'); // Works well
		emit myEvent('receive-function-works-too');
	}

	fallback() external payable {
		emit myEvent('fallback-function-works-yoo');
	}
}
