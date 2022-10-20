function handleAppError(error, setAppErrorMessg) {
	if (error.message.startsWith('call revert exception') || error.message.startsWith('missing revert data in call exception')) {
		const eMessg1 = `Probably:
		1. You need to select goerli network in your metamask wallet.
		2. You are using wrong contract abi.`
		setAppErrorMessg(eMessg1)
	} else {
		const eMessg2 = `Unhandled Exception
		Kindly send me a screenshot of this screen to me: sahilrajput03@gmail.com.
		Thanks in advance.
		
		${error.message}
		`
		setAppErrorMessg(eMessg2)
		// alert(error.message)
	}
}
export default handleAppError
