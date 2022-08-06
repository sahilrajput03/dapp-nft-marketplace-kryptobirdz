// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat')
const fs = require('fs')

async function main() {
	const NFTMarket = await hre.ethers.getContractFactory('KBMarket')
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log('nftMarket deployed to:', nftMarket.address)

	const NFT = await hre.ethers.getContractFactory('NFT')
	const nft = await NFT.deploy(nftMarket.address)
	await nft.deployed()
	console.log('NFT contract deployed to:', nft.address)

	// So when we run ``npm run deploy-local-KryptoBird`` below config stirng will be written to file `./config.js`
	let config = `
export const nftmarketaddress = '${nftMarket.address}'
export const nftaddress = '${nft.address}'`.trim()

	let data = JSON.stringify(config)
	fs.writeFileSync('config.js', JSON.parse(data))
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
