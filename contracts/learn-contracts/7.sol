// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import 'hardhat/console.sol';

contract Contract7 {
	function simpleFn() view external {
		console.log('hello');
		/** // ? LEARN: there is `console.logBytes` and `console.logBytes32` to log `bytes` and `bytes32` values. Hardhat is love!! */
		
		/** Learn `abi.encodePacked()` Application: string concatenation */
		bytes memory fullName = abi.encodePacked('Sahil', 'Rajput');
		console.logBytes(fullName); // Output: 0x536168696c52616a707574
		string memory fullNameString = string(fullName);
		console.log(fullNameString); // Output: SahilRajput
		//! LEARN ERRORS
		// console.log(fullName); // ! THROWS COMPILER ERROR: Member log not found or not visible after argument-dependent lookup in type(library console)
		// bytes32 fullName2 = abi.encodePacked('Sahil', 'Rajput'); // !THROWS COMPILER ERROR: Type bytes memory is not implicitly convertible to expected type bytes32.

		/** Learn `abi.encodePacked()` Application: hashing any large data for data integrity puposes and saving gas by avoiding to save all data to storage. */
		/** keccak256 is hash fn */
		bytes32 myFixedLength = keccak256(fullName); // throws error: Type bytes32 is not implicitly convertible to expected type bytes memory
		console.logBytes32(myFixedLength); // Output: 0x0de2bb7b236aabbd05402a4fcd1b00fa8ecaf8ec6eaa52d8e3bbbf630f9d1e0e
		// console.log(myFixedLength); // ! THROWS COMPILER ERROR: Member "log" not found or not visible after argument-dependent lookup in type(library console)
	}
}
