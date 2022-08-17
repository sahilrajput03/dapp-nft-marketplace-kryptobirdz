// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// We will bring in the openzeppelin ERC721 NFT functionality

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// This is a contract for NFT
contract NFT is ERC721URIStorage {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;
	// Counters allows us to keep track of tokenIds
	// address of marketplace for NFTs to interact
	address contractAddress;

	// OBJ: give the NFT market the ability to transact with tokens or change ownership
	// setApprovalForAll allows us to do that with contract address

	// FYI: `ERC721URIStorage` is inheriting `ERC721` and that why we don't need to import it to use it below.

	// construct setup our address
	constructor(address marketplaceAddress) ERC721("KryptoBirdz", "KBIRDZ") {
		contractAddress = marketplaceAddress;
	}

	// mintToken = createToken ~Sahil
	function mintToken(string memory tokenURI) public returns (uint) {
		// increment tokens
		_tokenIds.increment();
		uint256 newItemId = _tokenIds.current();
		_mint(msg.sender, newItemId);
		// set the token URI: id and url
		_setTokenURI(newItemId, tokenURI); // tokenURI is a URL though
		// give the marketplace the approval to transact between different users
		setApprovalForAll(contractAddress, true); // fn signature: setApprovalForAll(operator, approved)
		// mint the token and set it for sale - return the id to do so
		return newItemId;
	}
}
