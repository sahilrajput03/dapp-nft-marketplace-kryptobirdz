// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
import 'hardhat/console.sol';

contract Contract7 {
	// ~Logrocket: The bytes value type in Solidity is a dynamically sized byte array. It is provided for storing information in binary format. Since the array is dynamic, its length can grow or shrink.
	/** //? Amazing Quesiton: Whay data in hex starts with 0x? Ans. https://stackoverflow.com/questions/2670639/why-are-hexadecimal-numbers-prefixed-with-0x */
	/** //? Mapping of 0x to ascii notation, you can viem image @ https://github.com/sahilrajput03/learn-blockchain/blob/main/solidity-only.md#bytes32-vs-string */
	/** //? LEARN: there is `console.logBytes` and `console.logBytes32` to log `bytes` and `bytes32` values. Hardhat is love!! */

	function simpleFn() external view {
		bytes memory myBytes;
		console.log(myBytes.length == 0);
		console.logBytes(myBytes); // (totalChars=2) Output: 0x

		myBytes = 'a';
		console.log(myBytes.length == 1); // 0x61
		console.logBytes(myBytes); // (totalChars=4) Output: 0x61

		myBytes = 'ab';
		console.log(myBytes.length == 3);
		console.logBytes(myBytes); // (totalChars=6) Output: 0x6162

		bytes1 myBytes1;
		console.logBytes1(myBytes1); // (totalChars=4) Output: 0x00
		console.log(myBytes1.length == 1);
		// console.log(string(myBytes1)); //!throwsError: TypeError: Explicit type conversion not allowed from "bytes1" to "string memory".
		myBytes1 = 'a';
		// myBytes1 = 'ca'; //! throwsError: TypeError: Type literal_string "ca" is not implicitly convertible to expected type bytes1. Literal is larger than the type.
		// Converting {bytes1,bytes8, bytes16, bytes32} to `string` type //? But you should never convert it becoz this conversion costs more gas possibly.
		console.log('myBytes1?', string(abi.encodePacked(myBytes1))); // source: https://ethereum.stackexchange.com/a/101978/106687

		bytes8 myBytes8;
		console.logBytes8(myBytes8); // (totalChars=18) Output: 0x0000000000000000
		console.log(myBytes8.length == 8);

		bytes16 myBytes16;
		console.logBytes16(myBytes16); // (totalChars=34) Output: 0x00000000000000000000000000000000
		console.log(myBytes16.length == 16);

		bytes32 myBytes32;
		console.logBytes32(myBytes32); // (totalChars=66) Output: 0x0000000000000000000000000000000000000000000000000000000000000000
		console.log(myBytes32.length == 32);
		// console.log(string(myBytes32)); //!throwsError: TypeError: Explicit type conversion not allowed from "bytes32" to "string memory".

		// bytes memory choco = 23; //!throwsError: TypeError: Type int_const 23 is not implicitly convertible to expected type bytes memory.
		bytes memory pieBytes = '0';
		console.log('pieBytes?');
		console.logBytes(pieBytes); // 0x30
		string memory pieString = string(pieBytes);
		console.log('pieString?', pieString); // Output: SahilRajput

		console.logBytes(bytes('0')); // 0x30
		console.logBytes(bytes('1')); // 0x31
		console.logBytes(bytes('2')); // 0x32
		console.logBytes(bytes('a')); // 0x61
		console.logBytes(bytes('ab')); // 0x6162
		console.logBytes(bytes('abc')); // 0x616263 (*amazing*)
		console.logBytes(bytes('0abc1')); // 0x3061626331 (**amazing**)
		console.log(string(bytes('0abc1'))); // 0abc1 (***amazing***)
		console.log(true); // true
		//? ~Sahil: We can successfully compare the fixed size bytes:
		console.log('---COMPARING BYTES32:'); // true
		console.log(bytes32('0abc1') == bytes32('0abc1')); // Output: true
		//? ~Sahil: Strings are not comparable at any level i.e., `literal_string`, `bytes` or `string`
		// console.log('0abc1' == '0abc1'); //!throwsError: TypeError: Operator == not compatible with types literal_string "0abc1" and literal_string "0abc1".
		// console.log(bytes('0abc1') == bytes('0abc1')); //!throwsError: TypeError: Operator == not compatible with types bytes memory and bytes memory.
		// console.log(string(bytes('0abc1')) == '0abc1'); //!throwsError: TypeError: Operator == not compatible with types string memory and literal_string "0abc1".
		// console.log(string('0abc1') == string('0abc1')); //!throwsError: TypeError: Operator == not compatible with types string memory and string memory.

		console.log('---hello world');

		/** Learn `abi.encodePacked()` Application: string concatenation */
		bytes memory fullName = abi.encodePacked('Sahil', 'Rajput');
		console.logBytes(fullName); // Output: 0x536168696c52616a707574
		string memory fullNameString = string(fullName);
		console.log(fullNameString); // Output: SahilRajput
		//! LEARN ERRORS
		// console.log(fullName); // ! THROWS COMPILER ERROR: Member log not found or not visible after argument-dependent lookup in type(library console)
		// bytes32 fullName2 = abi.encodePacked('Sahil', 'Rajput'); // !THROWS COMPILER ERROR: Type bytes memory is not implicitly convertible to expected type bytes32.

		/** Learn `abi.encodePacked()` Application: hashing any large data for data integrity puposes and saving gas by avoiding to save all data to storage. */
		/** HASH FN: keccak256() (returns `bytes32`) */
		bytes32 myHashFixedLength = keccak256(fullName);
		console.log(myHashFixedLength.length); // Output: 32
		console.logBytes32(myHashFixedLength); // Output: 0x0de2bb7b236aabbd05402a4fcd1b00fa8ecaf8ec6eaa52d8e3bbbf630f9d1e0e
		console.logBytes32(keccak256(fullName)); // Output: 0x0de2bb7b236aabbd05402a4fcd1b00fa8ecaf8ec6eaa52d8e3bbbf630f9d1e0e
		// Common Use case with `keccak256`: Comparing Two hashes
		console.log(keccak256('abc') == keccak256('abc')); // Output: true
	}
}

// Learn data types in solidity, src: https://blog.logrocket.com/ultimate-guide-data-types-solidity/
