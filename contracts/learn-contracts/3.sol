// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;
// You can get above spdx and pragma instructions via shorthands i.e., spdx and pragm

contract Contract3{
    uint public balance; // initial value is 0

    // Adding money to contract address from thin air IMO ~Sahil
    function getMoney()public payable{
        balance += msg.value;
    }
    // Transfer money from contract to give account ~Sahil
    function withdraw(address payable to, uint amt)public {
        balance -= amt;
        to.transfer(amt); // `transfer` is a builtin function for address imo ~Sahil
    }
}
// maxFeePerGas: 1000000016 => 10 digit
// gasPrice : 1000000008 => 10 digit
// gasLimit: 29023000 => 8 digit
// actualDiff : 33919000271360 => 14 digit