import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
import '../styles/app.css'
import Link from 'next/link'

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
			<Component {...pageProps} />
		</div>
	)
}

export default KryptoBirdMarketplace
