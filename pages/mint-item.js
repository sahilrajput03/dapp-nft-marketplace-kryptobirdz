// @ts-nocheck
/* eslint-disable @next/next/no-img-element */
import {ethers} from 'ethers'
import {useState} from 'react'
import Web3Modal from 'web3modal'
import {create as ipfsHttpClient} from 'ipfs-http-client'
import {nftaddress, nftmarketaddress} from '../config'
import {useRouter} from 'next/router'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import KBMarket from '../artifacts/contracts/KBMarket.sol/KBMarket.json'
import dynamic from 'next/dynamic'

// in this component we set the ipfs up to host our nft data of
// file storage

// ~Sahil: Usage: https://docs.infura.io/infura/networks/ipfs/how-to/make-requests#ipfs-http-client
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

export default function MintItem() {
	const [fileUrl, setFileUrl] = useState(null)
	const [formInput, setFormInput] = useState({price: '', name: '', description: ''})
	const router = useRouter()
	const [isMinting, setIsMinting] = useState(false)
	// const [isMinting, setIsMinting] = useState(true) // for testing `isMinting`

	// set up a function to fireoff when we update files in our form - we can add our
	// NFT images - IPFS

	async function onFileChange(e) {
		const file = e.target.files[0]
		window.file = file
		try {
			// USING INFURA IPS: This no longer works without projectId as per their new rules and you need to enter a credit card to avail the free service now.
			// const added = await client.add(file, {
			// 	progress: (prog) => console.log(`received: ${prog}`),
			// })
			// const url = `https://ipfs.infura.io/ipfs/${added.path}`
			// setFileUrl(url)
		} catch (error) {
			console.log('Error uploading file:1:', error)
		}
	}

	// This is handler for button "Mint NFT"
	async function createMarket() {
		const {name, description, price} = formInput
		// if (!name || !description || !price || !fileUrl) return // With infura's ipfs
		if (!name || !description || !price) return // with nft.storage's ipfs

		//
		// upload to IPFS ~ with infura
		// const data = JSON.stringify({
		// 	name,
		// 	description,
		// 	image: fileUrl,
		// })
		setIsMinting(true)
		try {
			// const added = await client.add(data) // ~ with infura's ipfs
			// const url = `https://ipfs.infura.io/ipfs/${added.path}`
			//

			// ! Why nft.storage ? A. Its free but have a limitation i.e., single upload size limit to 31gb, source: https://nft.storage/faq/#how-is-nft-storage-free-to-use
			// ! Why abandoning infura's ipfs? A. Bcoz it is asking for credit card to avail its service. ~Sahil
			// Using `nft.storage's` ipfs instead of `infura's ipfs`
			const NFT_STORAGE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQwZkJCNzA3NzFjQmQ5Y0RDRjRjNDE0ZWY3OGRmY0UxMDcwQjYxRDkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDgwNjY0OTcwMCwibmFtZSI6Im15LWlwZnMtcHJvamVjdCJ9.3mif0W36dXY7sHXd7jDcx0C_aGmjsO2Vyb-TUgfpfaw'
			const {NFTStorage, File, Blob} = await import('nft.storage')
			const client = new NFTStorage({token: NFT_STORAGE_API_KEY})

			// const imageFile = new File([window.file], window.file.name, {type: 'image/png'})
			const imageFile = new File([window.file], window.file.name, {type: window.file.type})

			// Using nft.storage's ipfs ~Sahil
			const metadata = await client.store({
				name: name,
				description: description,
				// image: window.file,
				image: imageFile,
			})
			window.metadata = metadata
			// run a function that creates sale and passes in the url
			createSale(metadata.url) // using nft.storage's ipfs
			// createSale(url) // using infura's ipfs
		} catch (error) {
			console.log('Error uploading file:2:', error)
			setIsMinting(false)
		}
	}

	// This function is called on follow-up from the "Mint NFT" button call above the above createMarket() method ~Sahil
	// Create sale functionality is executed in createMarket function ~Sahil
	async function createSale(url) {
		// create the items and list them on the marketplace
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		// we want to create the token
		let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
		// alert('got url in window.url, now starting to mint')
		window.url = url
		let transaction
		try {
			transaction = await contract.mintToken(url)
		} catch (error) {
			console.log('myContractError1?', error)
			console.log('myContractError1?', error.name)
			console.log('myContractError1?', error.message)
			setIsMinting(false)
			return
		}
		let tx
		try {
			tx = await transaction.wait()
		} catch (error) {
			console.log('myContractError2?', error)
			console.log('myContractError2?', error.name)
			console.log('myContractError2?', error.message)
			setIsMinting(false)
			return
		}
		let event = tx.events[0]
		let value = event.args[2]
		let tokenId = value.toNumber()

		if (isNaN(Number(formInput.price))) {
			setIsMinting(false)
			return alert('Please input numeric cost for the item')
		}

		const price = ethers.utils.parseUnits(formInput.price, 'ether')

		// list the item for sale on the marketplace
		contract = new ethers.Contract(nftmarketaddress, KBMarket.abi, signer)
		let listingPrice
		try {
			listingPrice = await contract.getListingPrice()
		} catch (error) {
			console.log('myContractError3?', error)
			console.log('myContractError3?', error.name)
			console.log('myContractError3?', error.message)
			setIsMinting(false)
			return
		}
		listingPrice = listingPrice.toString()

		try {
			transaction = await contract.makeMarketItem(nftaddress, tokenId, price, {value: listingPrice})
		} catch (error) {
			console.log('myContractError4?', error)
			console.log('myContractError4?', error.name)
			console.log('myContractError4?', error.message)
			if (error.message.startsWith('insufficient funds for intrinsic transaction cost')) {
				alert('Sorry, you do not have enough funds to complete this transaction. Please try again to buy this item with sufficient funds in your account.')
			}
			setIsMinting(false)
			return
		}

		try {
			await transaction.wait()
		} catch (error) {
			console.log('myContractError5?', error)
			console.log('myContractError5?', error.name)
			console.log('myContractError5?', error.message)
			setIsMinting(false)
			return
		}
		window.file = null
		router.push('./')
	}

	return (
		<div className='flex justify-center'>
			<div className='w-1/2 flex flex-col pb-12'>
				<input placeholder='Asset Name' className='mt-8 border rounded p-4' onChange={(e) => setFormInput({...formInput, name: e.target.value})} />
				<textarea placeholder='Asset Description' className='mt-2 border rounded p-4' onChange={(e) => setFormInput({...formInput, description: e.target.value})} />
				<input placeholder='Asset Price in Eth' className='mt-2 border rounded p-4' onChange={(e) => setFormInput({...formInput, price: e.target.value})} />
				<input type='file' name='Asset' className='mt-4' onChange={onFileChange} /> {fileUrl && <img alt='some image here' className='rounded mt-4' width='350px' src={fileUrl} />}
				<button disabled={isMinting} onClick={createMarket} className={`font-bold mt-4 bg-purple-500 text-white rounded p-4 shadow-lg ${isMinting ? 'bg-gray-400' : ''}`}>
					{!isMinting ? 'Mint NFT': 'Please complete the transaction and wait for the minting process to complete.'}
				</button>
			</div>
		</div>
	)
}
