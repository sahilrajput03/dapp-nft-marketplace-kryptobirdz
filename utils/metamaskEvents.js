const refreshPageOnEventsMetamaskEvents = () => {
	// Detech if metmask is not installed, src: https://ethereum.stackexchange.com/a/122761/106687
	if (typeof window.ethereum === 'undefined') {
		throw new Error('no-metamask')
	}

	window.ethereum.on('accountsChanged', function (accounts) {
		alert('Account changed in Metamask')
		window.location.href = ''
	})
	window.ethereum.on('chainChanged', (chainId) => {
		alert('Network Changed in Metamask')
		window.location.href = ''
	})
}

export {refreshPageOnEventsMetamaskEvents}
