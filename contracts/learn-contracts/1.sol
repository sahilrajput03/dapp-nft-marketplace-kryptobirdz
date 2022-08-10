// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Contract1{
	// For all variables with public visibility respective getter is generate on deployment
    // uint8 public myuInt; // default value 0
    uint8 public myuInt = 2;
    bool public myBool; // non-initialized bool has false value ~Sahil
    string public myString; // non-initialized string has '' value ~Sahil
    // address type is used to send funds and for sending account balances
    // an address is of 20 bytes size
    address public defAddress; // defalt value is zeroAddress i.e., '0x0000000000000000000000000000000000000000'
    address public myAdd;
    mapping (uint => address) public myMap;
    // All variables are assiged with 0, false, 0x000 (zeroAddress) or ''
    constructor() {
        myAdd = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266; // in js myAdd is returned as plain string
    }
    function initUser(uint k, address addr) public {
        myMap[k] = addr;
    }
    function initMyMap() public{
        // We set address for 0 key in our map
        myMap[0] = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    }
    // Balance is retuned as string
    function getMyBalance() public view returns(uint) {
        return myAdd.balance;
    }
    function getDefBalance() public view returns(uint) {
        return defAddress.balance;
    }
    // TODO
    // function setDefBalance1Ether() public view returns(uint) {
    //     return defAddress.balance;
    // }
    function changeString() public {
        myString = 'sahil';
    }
    function changeVal () public {
        myBool = true;
    }
    function inc()public{
        myuInt++;
    }
    function dec()public{
        myuInt--;
    }
}