// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

// ! hardhat doesn't support import from http:
// 1. https://github.com/NomicFoundation/hardhat/issues/557
// 2. https://github.com/NomicFoundation/hardhat/issues/649

// ? WATCH FILE 5_4.sol instead ~Sahil

/*

// import "./5_2_1.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol"

import "hardhat/console.sol";

// 
// THIS IS A DEMO FOR USING INTERITANCE FOR BENEFIT OF REUSING CODE
// => THIS FILE IS A DEMO FOR THE USAGE OF `import` with github file link.
// 


// Note: We are inheriting `owned` contract in `Contract5_2`
contract Contract5_3 is owned{
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

*/
