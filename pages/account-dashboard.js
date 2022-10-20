// @ts-nocheck
// we want to load the users nfts and display

import Head from 'next/head'
import {ethers} from 'ethers'
import {useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import config from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'
import {getSafeEncodedURI} from '../utils/utilityFunctions'
import Spinner from '../components/Spinner'
import handleAppError from '../utils/handleAppError'
import {refreshPageOnEventsMetamaskEvents} from '../utils/metamaskEvents'
import ErrorNotify from '../components/ErrorNotify'

const {nftaddress, nftmarketaddress, networkName} = config

export default function AccountDashBoard() {
	// array of nfts
	const [nfts, setNFts] = useState([])
	const [sold, setSold] = useState([])
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

			const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
			const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
			const data = await marketContract.fetchItemsCreated()

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

			// create a filtered aray of items that have been sold
			const soldItems = items.filter((i) => i.sold)
			setSold(soldItems)
			setNFts(items)
			setLoadingState('loaded')
		} catch (error) {
			handleAppError(error, setAppErrorMessg)
		}
	}

	const isLoading = loadingState === 'not-loaded'
	console.log('isLoading?', isLoading, loadingState)

	if (loadingState === 'loaded' && !nfts.length) return <h1 className='px-20 py-7 text-4x1'>You have not minted any NFTs!</h1>

	return (
		<div className='p-4'>
			<Head>
				<title>NFT Marketplace - Kryptobirdz | Account Dashboard</title>
				<meta name='description' content='NFT Marketplace - Kryptobirdz | Account Dashboard' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<h1 style={{fontSize: '20px', color: 'purple'}}>Tokens Minted</h1>

			<ErrorNotify {...{isLoading, appErrorMessg}} />

			<div className='px-4' style={{maxWidth: '1600px'}}>
				<div className='grid grid-cols-1 items-center sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
					{nfts.map((nft, i) => {
						let newUrlSafeImageURI = getSafeEncodedURI(nft.image)

						return (
							<div key={i} className='border shadow rounded-x1 overflow-hidden'>
								<img src={newUrlSafeImageURI} alt='image here' />
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
