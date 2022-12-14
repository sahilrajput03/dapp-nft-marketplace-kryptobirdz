// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentProcessor {
	address public admin;
	IERC20 public dai;

	event PaymentDone(address payer, uint256 amount, string paymentId, uint date);

	constructor(address adminAddress, address daiAddress) {
		admin = adminAddress;
		dai = IERC20(daiAddress);
	}

	function pay(uint256 amount, string memory paymentId) external {
		dai.transferFrom(msg.sender, admin, amount);
		emit PaymentDone(msg.sender, amount, paymentId, block.timestamp);
	}
}
