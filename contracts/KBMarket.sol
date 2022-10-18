// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// security against transactions for multiple requests

import "hardhat/console.sol";

// public and private are visibility modifiers

contract KBMarket is ReentrancyGuard {
	using Counters for Counters.Counter;

	/* OBJECTIVES:
	number of items minting, number of transactions, token that have not been sold
	Keep track of tokens total number - tokenId
	array need to know the length - help to keep track for arrays*/

	Counters.Counter private _tokenIds;
	Counters.Counter private _tokensSold;

	// determine who is the owner of the contract
	// charge a listing fee so the owner makes a comission

	address payable owner;
	// We are deploying to matic the API is the same so you can use ether the sameway as matic
	// they both have 18 decimal
	// with matic: 0.045 is in the cents
	uint256 listingPrice = 0.045 ether;

	constructor() {
		// set the owner
		owner = payable(msg.sender);
	}

	// structs can act as objects
	struct MarketToken {
		uint itemId;
		address nftContract;
		uint256 tokenId;
		address payable seller;
		address payable owner;
		uint256 price;
		bool sold;
	}

	// tokenId return which MarketToken - fetch which one it is

	//?~Sahil: Declaring mapping: `idToMarketToken` which when give a 'id' will provide us 'MarketToken'.
	// ```key => value``` i.e., ```uint256 => MarketToken```
	mapping(uint256 => MarketToken) private idToMarketToken;

	// listen to events from frontend applications
	event MarketTokenMinted(
		uint256 indexed itemId,
		address indexed nftContract,
		uint256 indexed tokenId,
		address seller,
		address owner,
		uint256 price,
		bool sold
	);

	// get the listing price
	function getListingPrice() public view returns (uint256) {
		return listingPrice; // our listingPrice in setup earlier in this program in ether
	}

	// two functions to interact with contract
	// 1. create a market item to put it up for sale
	// 2. create a market sale for buying and selling between parties

	// old name: function mintMarketItem(
	function makeMarketItem(
		address nftContract,
		uint tokenId,
		uint price
	) public payable nonReentrant {
		// nonReentrant is a modifier to prevent reentry attack

		require(price > 0, "Price must be at least one wei");
		require(msg.value == listingPrice, "Price must be equal to listing price");

		_tokenIds.increment();
		uint itemId = _tokenIds.current();

		// putting it up for sale
		idToMarketToken[itemId] = MarketToken(
			itemId,
			nftContract,
			tokenId,
			payable(msg.sender),
			payable(address(0)),
			price,
			false
		);

		// NFT transaction
		IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId); // learn signature: transferFrom(from, to, tokenId)

		emit MarketTokenMinted(
			tokenId,
			nftContract,
			tokenId,
			msg.sender, // person who's selling it
			address(0),
			price,
			false // coz we haven't yet sold it
		);
	}

	//! function to conduct transactions and market sales
	function createMarketSale(address nftContract, uint itemId) public payable nonReentrant {
		uint price = idToMarketToken[itemId].price;
		uint tokenId = idToMarketToken[itemId].tokenId;

		// require(msg.value == price, "Please submit the asking price in order to continue");
		// ~Sahil uint to string: src: https://stackoverflow.com/a/69860971/10012446
		// ~SahilL: string concatenation: https://ethereum.stackexchange.com/a/129025/106687
		require(msg.value == price, string.concat('You chose price as: ', Strings.toString(msg.value), ' but the actual price of item is: ', Strings.toString(price)));

		// transfer the amount to the seller
		idToMarketToken[itemId].seller.transfer(msg.value);
		// transfer the token from the contract address to buyer
		IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
		idToMarketToken[itemId].owner = payable(msg.sender);
		idToMarketToken[itemId].sold = true; // selling is done now ~Sahil
		_tokensSold.increment();

		payable(owner).transfer(listingPrice);
		// sale is finished ~Sahil
	}

	//! function to fetchMarketItems - List all the available items in the market (this is called on the home page of our frontend app)
	// return the number of unsold items
	function fetchMarketTokens() public view returns (MarketToken[] memory) {
		// here MarketToken is a struct
		uint itemCount = _tokenIds.current();
		uint unsoldItemCount = _tokenIds.current() - _tokensSold.current();
		uint currentIndex = 0;

		// looping over the number of items created (if number has not been sold populate the array)
		MarketToken[] memory items = new MarketToken[](unsoldItemCount);
		for (uint i = 0; i < itemCount; i++) {
			if (idToMarketToken[i + 1].owner == address(0)) {
				uint currentId = i + 1;
				MarketToken storage currentItem = idToMarketToken[currentId];
				//?Sahil: Adding each market token to items struct (`items` if of type `MarketToken[]`) so we can return `items` from function `fetchMarketTokens`.
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	//! return nfts that the user has purchased
	function fetchMyNFTs() public view returns (MarketToken[] memory) {
		uint totalItemCount = _tokenIds.current();
		// a second counter for each individual user
		uint itemCount = 0;
		uint currentIndex = 0;

		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketToken[i + 1].owner == msg.sender) {
				itemCount += 1;
			}
		}

		// second loop to loop through the amount you have purchased with itemcount
		// check to see if the owner address is equal to msg.sender

		MarketToken[] memory items = new MarketToken[](itemCount);
		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketToken[i + 1].owner == msg.sender) {
				uint currentId = idToMarketToken[i + 1].itemId;
				// current array
				MarketToken storage currentItem = idToMarketToken[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}

	//! function for returning an array of minted nfts
	function fetchItemsCreated() public view returns (MarketToken[] memory) {
		// instead of .owner it will be the .seller
		uint totalItemCount = _tokenIds.current();
		uint itemCount = 0;
		uint currentIndex = 0;

		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketToken[i + 1].seller == msg.sender) {
				itemCount += 1;
			}
		}

		// second loop to loop through the amount you have purchased with itemcount
		// check to see if the owner address is equal to msg.sender

		MarketToken[] memory items = new MarketToken[](itemCount);
		for (uint i = 0; i < totalItemCount; i++) {
			if (idToMarketToken[i + 1].seller == msg.sender) {
				uint currentId = idToMarketToken[i + 1].itemId;
				MarketToken storage currentItem = idToMarketToken[currentId];
				items[currentIndex] = currentItem;
				currentIndex += 1;
			}
		}
		return items;
	}
}
// We can't create objects in solidity but structs and structs can act as objects
