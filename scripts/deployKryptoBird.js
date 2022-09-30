// Official hardhat deployment example: https://hardhat.org/tutorial/deploying-to-a-live-network

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hh = require('hardhat')
const fs = require('fs')

let TARGET_FILE_PATH

/** Works Good */ /** src: https://ethereum.stackexchange.com/a/112947 */
// const networkName = hh.network.name
// const chainId = hh.network.config.chainId
// console.log(networkName, chainId);
// WHEN DEPLOYING TO LOCAL NODE: localhost undefined
// WHEN DEPLOYING TO MUMBAI KRYPTO: matic undefined
// process.exit() // helpful in testing above above logs

// This flag is meant to be passed via cli only; ~Sahil
if (process.env.MUMBAI === 'true') {
	TARGET_FILE_PATH = 'config-mumbai.js'
} else {
	TARGET_FILE_PATH = 'config-local.js'
}

const {formatEther, commify, formatUnits} = hh.ethers.utils

// FYI: 1eth = 10**9gwei = 10**18 wei). ~Sahil: ALSO: 1 gwei is gigaWei i.e., 10**9 wei
async function main() {
	const [deployer] = await hh.ethers.getSigners()
	console.log('Deploying contracts with the account:', deployer.address)
	const initial_balance = await deployer.getBalance()
	// console.log('Account balance (wei):', initial_balance.toString())
	console.log('Account balance (eth):', commify(formatEther(initial_balance)))

	const NFTMarket = await hh.ethers.getContractFactory('KBMarket')
	const nftMarket = await NFTMarket.deploy()
	await nftMarket.deployed()
	console.log('\t nftMarket deployed to:', nftMarket.address)

	const NFT = await hh.ethers.getContractFactory('NFT')
	const nft = await NFT.deploy(nftMarket.address)
	await nft.deployed()
	console.log('\t NFT contract deployed to:', nft.address)

	const final_balance = await deployer.getBalance()
	// console.log('FINAL: Account balance (wei):', final_balance.toString())
	console.log('FINAL: Account balance (eth):', commify(formatEther(final_balance)))

	const totalDeploymentCharges = initial_balance.sub(final_balance)
	// console.log('* Total Deployment Charges (wei):', totalDeploymentCharges.toString())
	// console.log('* Total Deployment Charges (wei, commify):', commify(totalDeploymentCharges.toString()))
	// console.log('* Total Deployment Charges (gwei):', formatUnits(totalDeploymentCharges.toString(), 'gwei'))
	// console.log('* Total Deployment Charges (gwei):', formatUnits(totalDeploymentCharges.toString(), 9)) // Using 9 here becoz gwei = 10*9 wei
	// console.log('* Total Deployment Charges (gwei, commify):', commify(formatUnits(totalDeploymentCharges.toString(), 'gwei')))
	const ethValue = formatEther(totalDeploymentCharges) // convert wei to ether
	console.log('* Total Deployment Charges (eth):', commify(ethValue))

	// So when we run ``npm run deploy-local-KryptoBird`` below config stirng will be written to file `./config.js`
	let config = `
export const nftmarketaddress = '${nftMarket.address}'
export const nftaddress = '${nft.address}'`.trim()

	let data = JSON.stringify(config)
	fs.writeFileSync(TARGET_FILE_PATH, JSON.parse(data))
}

main().catch((error) => {
	console.error(error)
	process.exitCode = 1
})
