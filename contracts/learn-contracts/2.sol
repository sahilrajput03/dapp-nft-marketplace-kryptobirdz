// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

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

    // We can have n dynamic sized arrays like
    // uint[][3] public barr; // this means we will have 3 dynamic sized array (*NOTE: notation of array is reverse i.e., uint[][3] )

    // ENUMS:
    enum ActionChoices{left,right,up,down}
    ActionChoices public choice; // default value is 0 i.e., left

    // NOTE: We can *not* use index to access the value but use dot notation.

    function setLeft() public {
        choice = ActionChoices.left;
    }
    function setRight() public {
        choice = ActionChoices.right;
    }
    function setUp() public {
        choice = ActionChoices.up;
    }
    function setDown() public {
        choice = ActionChoices.down;
    }

    string public myString; // deafult value is ''
    // string public myString = 'car'; // value is set to 'car'

    // function helper(string memory to)  returns (string memory){
    //     myString = to; // value send by user as argument
    //     return myString;
    // }
    
    // Learn: memory keyword below is the storage location i.e, where the value is stored ~Sahil
    // function setMyString(string memory to) public returns (string memory){
    function setMyString(string memory to) public returns (string memory){
        myString = to; // value send by user as argument
        return myString;
    }

    // Learn: Getter function can either be pure or view
    // PURE FUNCITONS
    function sumExternalPure(uint a, uint b) external pure returns (uint){
        return a+b;        
    }
    function multiplyPublicPure(uint a, uint b) public pure returns (uint){
        return a*b;        
    }
    // VIEW FUNCITONS (***can read the state***)
    string name = 'sahil';
    function namePublicView() public view returns (string memory){
        return name;        
    }
    function nameExternalView() external view returns (string memory){
        return name;        
    }


    function fn2() external view{
        // EXTERNAL is visibility like PUBLIC, view is ???
        // LERARN: We cannot modify state in a view (either directly or via some function) coz it throws compile time error: Function cannot be declared as view because this expression (potentially) modified the state. 
        // *SEE SCREENSHOT: ss-view-vs-pure-functions.png
        // helper(to);
        // myString = to; // value send by user as argument

    }

    // storage, memory and calldata for variables ~ compiler
    function fn1() public returns (uint){
        // string greet = "Hello ";
        // ^^ FROM Compiler: Data location must be "storage", "memory" or "calldata" for variable
    }
    function simpleFunction() public returns (string memory){
        myString = 'batman';
        return myString; // this return value is never returned to clients
    }
    
    function concatMyString(string memory b) public pure returns (string memory){
        string memory greet = 'hello ';
        return string.concat(greet, b); // https://dev.to/hannudaniel/concatenate-two-strings-on-the-blockchain-using-solidity-smart-contracts-new-feature-in-v0812-549g
    }

    // Learn events
    event myEvent(uint foo, uint bar, uint baz);
    event yourEvent(string buzz);
    function learnEvent(uint a) public {
        emit myEvent(a, 8, 9);
        emit yourEvent('bacardi');
    }
}