const {expect} = require('chai')
const {ethers} = require('hardhat')

describe('KBMarket', function () {
	it('Should mint and trade NFTs', async function () {
		// test to receive contract addresses
		const Market = await ethers.getContractFactory('KBMarket')
		const market = await Market.deploy()
		await market.deployed()
		const marketAddress = market.address

		const NFT = await ethers.getContractFactory('NFT')
		const nft = await NFT.deploy(marketAddress) // `nft` is contract
		await nft.deployed()
		const nftContractAddress = nft.address

		// test to receive listing price and auction price
		let listingPrice = await market.getListingPrice()
		listingPrice = listingPrice.toString()

		const auctionPrice = ethers.utils.parseUnits('100', 'ether')

		// test for minting (creating tokens)
		await nft.mintToken('https-t1')
		await nft.mintToken('https-t2')

		await market.makeMarketItem(nftContractAddress, 1, auctionPrice, {value: listingPrice})
		await market.makeMarketItem(nftContractAddress, 2, auctionPrice, {value: listingPrice})

		// test for different addresses from different users - test accounts
		// return an array of however many addresses
		const [_, buyerAddress] = await ethers.getSigners()

		// create a market sale with address, id and price
		await market.connect(buyerAddress).createMarketSale(nftContractAddress, 1, {
			value: auctionPrice,
		})

		let items = await market.fetchMarketTokens() //? ~Sahil, check function `fetchMarketTokens` in `KBMarket.sol` contract.
		// console.log('items', items)
		/* OUTPUT:
		items [
		[
			BigNumber { value: "2" },
			'0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',   			<<-- 1. Marketplace address
			BigNumber { value: "2" },
			'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',				<<-- 2. nft address
			'0x0000000000000000000000000000000000000000',
			BigNumber { value: "100000000000000000000" },
			false,
			itemId: BigNumber { value: "2" },
			nftContract: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',	<<-- 3. nft contract address
			tokenId: BigNumber { value: "2" },
			seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',		<<-- 4. seller address
			owner: '0x0000000000000000000000000000000000000000',
			price: BigNumber { value: "100000000000000000000" },
			sold: false
		]
		]
		*/

		items = await Promise.all(
			items.map(async (i) => {
				// get the uri of the value

				const tokenUri = await nft.tokenURI(i.tokenId)
				let item = {
					price: i.price.toString(), // convert from hex to decimal number ~SAHIL
					tokenId: i.tokenId.toString(), // convert from hex to decimal number ~SAHIL
					seller: i.seller,
					owner: i.owner,
					tokenUri,
				}
				return item
			})
		)

		// test out all the items
		console.log('items', items)
		/*OUTPUT:
		items [
		{
			price: '100000000000000000000',								<<-- Price is 100_(18 zeroes)
			tokenId: '2',
			seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			owner: '0x0000000000000000000000000000000000000000',
			tokenUri: 'https-t2'
		}
		]
		*/
	})
})
