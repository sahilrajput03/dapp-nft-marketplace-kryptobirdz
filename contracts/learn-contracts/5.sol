// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// You can get above spdx and pragma instructions via shorthands i.e., spdx and pragm

// require(), assert(), revert() in solidity docs: https://docs.soliditylang.org/en/v0.8.9/control-structures.html#error-handling-assert-require-revert-and-exceptions
import "hardhat/console.sol";

contract Contract5{
    uint public balance; // initial value is 0
    address public owner;

    constructor(){
        owner = msg.sender;
    }
    modifier onlyOwner(){
        require(owner == msg.sender, "xxx - U are not the owner");
        _;
    }
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

    // function destructTheContract()public{
    //     selfdestruct(address);
    // }
}
