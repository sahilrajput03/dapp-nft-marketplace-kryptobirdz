// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Contract2{
    uint8 public myuInt = 2;
    // struct is a `user-defined data structure`
    struct customer{
        address addr;
        uint amt;
    }

    customer public fund;

    function change() public {
        fund.addr = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        fund.amt = 25;
    }

    // DYNAMIC SIZE ARRAY
    uint[] public arr; // Default value is [] imo ~Sahil
    // uint[] public arr = []; // LEARN: It is not possible to declare like this in solidity
    function pushArr(uint val) public {
        arr.push(val);
    }
    function popArr() public {
        arr.pop();
    }

    // FIXED SIZE ARRAY
    uint[3] public barr; // Default value is [0,0,0] imo ~Sahil
    function setSecondIndexValueInBarr(uint val) public {
        // barr.push(val); // throws compile time error like: Member "push" not found not found or not visible after argumetn-dependent lookup in uing256[3] storage ref.
        barr[1] = val;
    }
}