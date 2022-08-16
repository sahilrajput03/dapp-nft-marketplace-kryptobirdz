// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// Importing all contracts and identifiers from the given file
import "./5_2_1.sol";

import "hardhat/console.sol";

// 
// THIS IS A DEMO FOR USING INTERITANCE FOR BENEFIT OF REUSING CODE
// => THIS FILE IS A DEMO FOR THE USAGE OF `import` for the purpose of code-splitting.
// 

// Note: We are inheriting `owned` contract in `Contract5_2`
contract Contract5_2 is owned{
    uint public balance; // initial value is 0

    // Adding money to contract address from thin air IMO ~Sahil
    function getMoney()public payable{
        if(msg.sender != owner){
            revert("Not owner");
        }
        balance += msg.value;
    }
    // Transfer money from contract to given account ~Sahil
    function withdraw(uint amt)public onlyOwner {
        // console.log('calling now():', now()); // compiler throws `"now" has been deprecated. Use "block.timestamp" instead.`
        assert(amt  <= balance);

        balance -= amt;
        // to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
    }

    uint public targetAmount = 7 ether;
    // ^ This equals to 7 * 10**18 in value

    // function destructTheContract()public{
    //     selfdestruct(address);
    // }
}
