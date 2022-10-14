// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import config from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'
import {getSafeEncodedURI} from '../utils/utilityFunctions'
/* // TODO: Usin web3modal react  */
// import {ConnectButton, useAccount} from '@web3modal/react'

const {nftaddress, nftmarketaddress, networkName} = config
console.log('got addresses?', {nftaddress, nftmarketaddress})

export default function Home() {
	/* // TODO: Usin web3modal react  */
	// const {connected} = useAccount()
	const [nfts, setNFts] = useState([])
	const [loadingState, setLoadingState] = useState('not-loaded')

	useEffect(() => {
		loadNFTs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	async function loadNFTs() {
		// what we want to load:
		// ***provider, tokenContract, marketContract, data for our marketItems***
		// FROM DOCS: https://docs.ethers.io/v4/api-providers.html
		// The network will be automatically detected; if the network is
		// changed in MetaMask, it causes a page refresh.

		// const provider = new ethers.providers.JsonRpcProvider() // original from course author (only work with localhost and breaks on connecting to goerli chain when run `nr start-goerli` script)
		// let provider = new ethers.providers.Web3Provider(web3.currentProvider) // ! THIS IS LAST WORKING!!

		// Below code to connect to metamask is used by author on other pages as well i.e., `mint-token`, `dashboard`, etc by course author
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)

		const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
		const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, provider)

		//!!!!!!!! get max fees from gas station
		let maxFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
		let maxPriorityFeePerGas = ethers.BigNumber.from(40000000000) // fallback to 40 gwei
		try {
			const {data} = await axios({
				method: 'get',
				url: isProd ? 'https://gasstation-mainnet.matic.network/v2' : 'https://gasstation-mumbai.matic.today/v2',
			})
			maxFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxFee) + '', 'gwei')
			maxPriorityFeePerGas = ethers.utils.parseUnits(Math.ceil(data.fast.maxPriorityFee) + '', 'gwei')
		} catch {
			// ignore
		}
		// !!!!!!
		console.log('got here..1')

		let data = []

		try {
			// const someWhatNeeded = {
			// 	maxPriorityFeePerGas,
			// 	maxFeePerGas,
			// }
			// data = await marketContract.fetchMarketTokens(someWhatNeeded)
			data = await marketContract.fetchMarketTokens() //! ~SAhil - curiousita: Inspect how does this fetches tokens ??
		} catch (error) {
			console.log('got here..1.1')
			window.e1 = error
			throw error
		}

		if (!window.d) {
			window.d = {}
		}
		window.d.nfts = data
		console.log('got here..2')

		const items = await Promise.all(
			data.map(async (i) => {
				let tokenUri = await tokenContract.tokenURI(i.tokenId)
				// alert('got token: uri:' + tokenUri)
				//! Access ipfs file using https gateway (nft.storage): https://nft.storage/docs/concepts/gateways/#using-the-gateway ~Sahil
				//! Replacing ipfs:// with https://nftstorage.link/ipfs/ so we can access nft.storage's ipfs file on a general browser (coz 90% of browser don't support ipfs atm)

				//! Needed for nft.storage only (not* needed for infura's ipfs)
				tokenUri = tokenUri.replace('ipfs://', 'https://nftstorage.link/ipfs/')
				// we want get the token metadata - json
				const meta = await axios.get(tokenUri)
				// Example: tokenUri = https://bafyreid5elqj3kxzhiuriks44kovfh5g67wdhnbp24vofabnghvpzjpxeq.ipfs.nftstorage.link/metadata.json
				// meta.data looks like:
				// {
				// name: "zxy",
				// description: "wetgs",
				// image: "ipfs://bafybeifg6bs7eisejoxwflo6uvz3wdasa4plrbxerbg2ril7jks23hf6ny/array.png"
				// }

				//! Needed for nft.storage only (not* needed for infura's ipfs)
				meta.data.image = meta.data.image.replace('ipfs://', 'https://nftstorage.link/ipfs/')

				let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
				let item = {
					price,
					tokenId: i.tokenId.toNumber(),
					seller: i.seller,
					owner: i.owner,
					image: meta.data.image,
					name: meta.data.name,
					description: meta.data.description,
				}
				return item
			})
		)

		setNFts(items)
		window.d.items = items
		setLoadingState('loaded')
	}

	// function to buy nfts for market

	async function buyNFT(nft) {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const contract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)

		const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')
		const transaction = await contract.createMarketSale(nftaddress, nft.tokenId, {
			value: price,
		})

		await transaction.wait()
		loadNFTs()
	}
	if (loadingState === 'loaded' && !nfts.length) return <h1 className='px-20 py-7 text-4x1'>No NFts in marketplace</h1>

	// if (typeof window != 'undefined') {
	// 	window.d = nfts
	// }

	return (
		<div className='flex justify-center'>
			<div className='px-4' style={{maxWidth: '1600px'}}>
				<div className='grid grid-cols-1 items-center sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
					{nfts.map((nft, i) => {
						// Get url safe encoded url of the image (had to do this to correct the url of the images minted with file name including #), now it works good though.
						let newUrlSafeImageURI = getSafeEncodedURI(nft.image)
						console.log('IMAGE: nft.image?', nft.image)
						console.log('IMAGE: newUrlSafeImageURI?', newUrlSafeImageURI)

						return (
							<div key={i} className='border shadow rounded-x1 overflow-hidden'>
								<img alt='image here' src={newUrlSafeImageURI} />
								<div className='p-4 bg-black bg-opacity-50 text-white'>
									<p className='text-3x1 font-semibold'>{nft.name}</p>
									<div style={{overflow: 'hidden'}}>
										<p className='text-gray-400'>{nft.description}</p>
									</div>
								</div>
								<div className='p-4 bg-black'>
									<p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
									<button className='w-full bg-purple-500 text-white font-bold py-3 px-12 rounded' onClick={() => buyNFT(nft)}>
										Buy
									</button>
								</div>
							</div>
						)
					})}
				</div>
			</div>

			{/* // TODO: Use web3modal react lib  */}
			{/* {connected ? '' : <ConnectButton />} */}
		</div>
	)
}
