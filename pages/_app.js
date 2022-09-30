// @ts-nocheck
import {chains, providers} from '@web3modal/ethereum'
import {Web3ModalProvider} from '@web3modal/react'
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/app.css'
import Link from 'next/link'

// Source - Official Web3modal React Example with Nextjs: https://github.com/WalletConnect/web3modal/blob/V2/examples/react/src/pages/_app.tsx

// Get projectID at https://cloud.walletconnect.com
if (!process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID) throw new Error('You need to provide NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID env variable')

// Configure web3modal
const modalConfig = {
	projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
	theme: 'dark',
	accentColor: 'default',
	ethereum: {
		appName: 'web3Modal',
		autoConnect: true,
		// chains: [chains.mainnet], // from docs
		// So below chian will be tried to switch when person clicks on "Connect" button and the first will be preffered so keep the first as localhost in dev environment
		// TODO IMPORTANT: I can customise the auto-switching this way for development and production.
		chains: [chains.localhost, chains.mainnet, chains.goerli, chains.hardhat],
		providers: [providers.walletConnectProvider({projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID})],
	},
}

function KryptoBirdMarketplace({Component, pageProps}) {
	return (
		<div>
			<nav className='border-b-[3px] border-red-800 p-6 bg-purple-800'>
				<p className='text-4x1 font-bold text-white'>KryptoBird Marketplace</p>
				<div className='flex mt-4 justify-center'>
					<Link href='/'>
						<a className='mx-6'>Main Marketplace</a>
					</Link>
					<Link href='/mint-item'>
						<a className='mx-6'>Mint Tokens</a>
					</Link>
					<Link href='/my-nfts'>
						<a className='mx-6'>My NFts</a>
					</Link>
					<Link href='/account-dashboard'>
						<a className='mx-6'>Account Dashboard</a>
					</Link>
				</div>
			</nav>

			<Web3ModalProvider config={modalConfig}>
				<Component {...pageProps} />
			</Web3ModalProvider>
		</div>
	)
}

export default KryptoBirdMarketplace
