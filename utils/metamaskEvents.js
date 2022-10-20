const refreshPageOnEventsMetamaskEvents = () => {
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
