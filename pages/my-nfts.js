// @ts-nocheck
// we want to load the users nfts and display
import Head from 'next/head'
import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {getSafeEncodedURI} from '../utils/utilityFunctions'
import config from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'
import handleAppError from '../utils/handleAppError'
import Spinner from '../components/Spinner'
import { refreshPageOnEventsMetamaskEvents } from '../utils/metamaskEvents'

const {nftaddress, nftmarketaddress, networkName} = config

export default function MyAssets() {
	// array of nfts
	const [nfts, setNFts] = useState([])
	const [loadingState, setLoadingState] = useState('not-loaded')
	const [appErrorMessg, setAppErrorMessg] = useState('')

	useEffect(() => {
		loadNFTs()
	}, [])

	async function loadNFTs() {
		try {
			refreshPageOnEventsMetamaskEvents()

			// what we want to load:
			// we want to get the msg.sender hook up to the signer to display the owner nfts
			const web3Modal = new Web3Modal()
			const connection = await web3Modal.connect()
			const provider = new ethers.providers.Web3Provider(connection)
			const signer = provider.getSigner()

			// console.log('got signer - my-nft-page', signer);

			const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)

			const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
			const data = await marketContract.fetchMyNFTs()

			const items = await Promise.all(
				data.map(async (i) => {
					let tokenUri = await tokenContract.tokenURI(i.tokenId)
					//! Needed for nft.storage only (not* needed for infura's ipfs)
					tokenUri = tokenUri.replace('ipfs://', 'https://nftstorage.link/ipfs/')
					// we want get the token metadata - json
					const meta = await axios.get(tokenUri)
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
			setLoadingState('loaded')
		} catch (error) {
			handleAppError(error, setAppErrorMessg)
		}
	}

	const isLoading = loadingState === 'not-loaded'

	if (loadingState === 'loaded' && !nfts.length) return <h1 className='px-20 py-7 text-4x1'>You do not own any NFTs currently :(</h1>

	return (
		<div className='flex justify-center'>
			<Head>
				<title>NFT Marketplace - Kryptobirdz | My NFTs</title>
				<meta name='description' content='NFT Marketplace - Kryptobirdz | My NFTs' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='flex justify-center'>
				{isLoading && (
					<>
						{Boolean(appErrorMessg) ? (
							<div className='mt-5' style={{width: '500px'}}>
								<h5 className='bg-white rounded-lg p-3' style={{whiteSpace: 'pre-line'}}>
									{appErrorMessg}
								</h5>
							</div>
						) : (
							<div className='mt-[150px] flex items-center justify-center bg-purple-600 rounded-lg px-5 py-3'>
								{Spinner}
								<div className='text-xl text-white'>Loading</div>
							</div>
						)}
					</>
				)}
			</div>

			<div className='px-4' style={{maxWidth: '1600px'}}>
				<div className='grid grid-cols-1 items-center sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
					{nfts.map((nft, i) => {
						let newUrlSafeImageURI = getSafeEncodedURI(nft.image)
						console.log('nft.image?', nft.image)
						console.log('newUrlSafeImageURI?', newUrlSafeImageURI)

						return (
							<div key={i} className='border shadow rounded-x1 overflow-hidden'>
								<img src={newUrlSafeImageURI} alt='bird image here' />
								<div className='p-4 bg-black bg-opacity-50 text-white'>
									<p className='text-3x1 font-semibold'>{nft.name}</p>
									<div style={{overflow: 'hidden'}}>
										<p className='text-gray-400'>{nft.description}</p>
									</div>
								</div>
								<div className='p-4 bg-black'>
									<p className='text-3x-1 mb-4 font-bold text-white'>{nft.price} ETH</p>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</div>
	)
}
