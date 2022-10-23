// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import 'hardhat/console.sol';

contract Contract7 {
	// ~Logrocket: The bytes value type in Solidity is a dynamically sized byte array. It is provided for storing information in binary format. Since the array is dynamic, its length can grow or shrink.
	// ? Amazing Quesiton: Whay data in hex starts with 0x? Ans. https://stackoverflow.com/questions/2670639/why-are-hexadecimal-numbers-prefixed-with-0x
	// ? Mapping of 0x to ascii notation, you can viem image @ https://github.com/sahilrajput03/learn-blockchain/blob/main/solidity-only.md#bytes32-vs-string
	function simpleFn() external view {
		bytes memory myBytes;
		console.logBytes(myBytes); // (totalChars=2) Output: 0x
		console.log(myBytes.length); // Output: 0

		bytes1 myBytes1;
		console.logBytes1(myBytes1); // (totalChars=4) Output: 0x00
		console.log(myBytes1.length); // Output: 1
		
		bytes8 myBytes8;
		console.logBytes8(myBytes8); // (totalChars=18) Output: 0x0000000000000000
		console.log(myBytes8.length); // Output: 8

		bytes16 myBytes16;
		console.logBytes16(myBytes16); // (totalChars=34) Output: 0x00000000000000000000000000000000
		console.log(myBytes16.length); // Output: 16
		
		bytes32 myBytes323;
		console.logBytes32(myBytes323); // (totalChars=66) Output: 0x0000000000000000000000000000000000000000000000000000000000000000
		console.log(myBytes323.length); // Output: 32

		// bytes memory choco = 23; //! TypeError: Type int_const 23 is not implicitly convertible to expected type bytes memory.
		bytes memory pie = '0';
		console.logBytes(pie); // 0x30
		console.logBytes(bytes('0')); // 0x30
		console.logBytes(bytes('1')); // 0x31
		console.logBytes(bytes('2')); // 0x32
		console.logBytes(bytes('a')); // 0x61
		console.logBytes(bytes('ab')); // 0x6162
		console.logBytes(bytes('abc')); // 0x616263 (*amazing*)
		console.logBytes(bytes('0abc1')); // 0x3061626331 (**amazing**)
		

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

// Learn data types in solidity, src: https://blog.logrocket.com/ultimate-guide-data-types-solidity/
