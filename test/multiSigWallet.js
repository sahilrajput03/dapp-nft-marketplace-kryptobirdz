const {ethers, network, waffle} = require('hardhat')
const {expect, assert} = require('chai')
const {BigNumber} = ethers

/** Passing multiple values to constructor of the contract: https://stackoverflow.com/a/69751261/10012446 */

// 6fig course
describe('multiSigWallet', () => {
	const {provider} = waffle
	let wallet, Wallet, acc1, acc2, acc3, _, acc5, acc6, addr1, addr2, addr3, addr5, addr6, approversAddrs
	const INITIAL_CONTRACT_BALANCE = 1000,
		TRANSFER_AMOUNT = 100,
		QUORUM = 2,
		DEFAULT_BALANCE = BigNumber.from('10000000000000000000000')

	// vid 48
	it('should have corrrect balance, approvers and quorum', async () => {
		// Reset accounts in hardhat node // https://ethereum.stackexchange.com/a/112437/106687
		await network.provider.send('hardhat_reset')

		// Assign variables
		;[acc1, acc2, acc3, _, acc5, acc6] = await ethers.getSigners()
		addr1 = acc1.address
		addr2 = acc2.address
		addr3 = acc3.address
		addr5 = acc5.address
		addr6 = acc6.address
		approversAddrs = [addr1, addr2, addr3]

		// Deploy contract
		Wallet = await ethers.getContractFactory('MultiSigWallet')
		wallet = await Wallet.deploy(approversAddrs, QUORUM) // we're passing array of addreses and quorum (second argument) as 2 i.e., minium number of approvers for the transaction
		await wallet.deployed()

		// Sending 1000 wei to contract (using receive fn i.e., using `sendTransaction` method)
		// Learn: `sendTransaction` @ `address of the wallet`
		await acc1.sendTransaction({from: addr1, to: wallet.address, value: INITIAL_CONTRACT_BALANCE})
		// In #TRUFFLE we do it like below:
		// await web3.eth.sendTransaction({from: accounts[0], to: wallet.address, value: INITIAL_CONTRACT_BALANCE}) // 10_000 wei // /* `accounts[0]` is address in truffle (string) */

		/** SHOULD HAVE 1000 WEI */ // Getting provider and balance: https://ethereum.stackexchange.com/a/123115/106687
		const balance = await provider.getBalance(wallet.address) //LEARN: // const provider = ethers.getDefaultProvider(); // This works as well but too slow, takes around 2 seconds to execute
		// In web3 (#TRUFFLE) ~Author // const balance = await web3.eth.getBalance(wallet.address)
		expect(balance.eq(1000)).to.be.true
		// SHOULD HAVE 1000 WEI - WITH MANUALLY METHOD i.e., `balance()` in contract
		const walletBalance = await wallet.balance() // balance is manullay created function so it should be avoided ~Sahil
		expect(walletBalance.eq(INITIAL_CONTRACT_BALANCE)).to.be.true

		/** SHOULD HAVE CORRECT APPROVERS AND QUORUM */
		const [a1, a2, a3] = await wallet.getApprovers()
		const quorum = await wallet.quorum()

		expect(quorum.eq(QUORUM)).to.be.true
		expect(a1).equal(addr1)
		expect(a2).equal(addr2)
		expect(a3).equal(addr3)
	})

	it('should create transfers', async () => {
		/** SHOULD CREATE TRANSFER */
		await wallet.createTransfer(TRANSFER_AMOUNT, addr5) // making txn from `firstAcc`

		// TRUFFLE:#001; In TRUFFLE when we need to execute a txn by a particular account use below syntax
		// await wallet.createTransfer(TRANSFER_AMOUNT, addr5, {
		// 	from: addr1, // you can use it to execute this test from a particular account
		// })

		const transfers = await wallet.getTransfers()
		// console.log('transfers?', transfers); // Get pretty readable output
		expect(transfers.length).equal(1)
		expect(transfers[0].to).equal(addr5) // id is `BigNumber`
		expect(transfers[0].sent).equal(false) // id is `BigNumber`
		// BIG NUMBERS
		expect(transfers[0].id.eq(0)).to.be.true // id is `BigNumber`
		expect(transfers[0].amount.eq(TRANSFER_AMOUNT)).to.be.true // amount is `BigNumber`
		expect(transfers[0].approvals.eq(0)).to.be.true // approvals is `BigNumber`
	})

	it('should NOT succeed createTransfer if sender is not approver', async () => {
		// SHOULD NOT CREATE TRANSFER FROM NON-APPROVER
		const expectedErrMessage = 'only approvers allowed'
		// To execute a txn from a particular account in truffle, consider searching TRUFFLE:#001 in this project
		await expect(wallet.connect(acc5).createTransfer(TRANSFER_AMOUNT, addr5)).to.be.revertedWith(expectedErrMessage)
	})

	it('should increment approvals', async () => {
		// **we have already created transfers** // await wallet.createTransfer(TRANSFER_AMOUNT, addr5) // making txn from `firstAcc`

		await wallet.approveTransfer(0) // id=0 becoz its the first transfer request
		const transfers = await wallet.getTransfers()
		// console.log('transfers?', transfers) // Get pretty readable output
		expect(transfers[0].approvals.eq(1)).to.be.true // APPROVALS INCREMENTED i.e., 1

		expect(transfers[0].sent).equal(false)
		// Assert contract balance
		const balance = await provider.getBalance(wallet.address) //LEARN: // const provider = ethers.getDefaultProvider(); // This works as well but too slow, takes around 2 seconds to execute
		expect(balance.eq(INITIAL_CONTRACT_BALANCE)).to.be.true
	})

	it('should send transfer if quorum reached', async () => {
		const idx = 1 // transferId coz its second transfer

		await wallet.createTransfer(TRANSFER_AMOUNT, acc6.address) // making txn from `firstAcc`

		// expect initial balance to be 10,000 eth
		const balanceInitial = await provider.getBalance(acc6.address)
		// console.log("🚀 ~ file: multiSigWallet.js ~ line 101 ~ it ~ balanceInitial", balanceInitial)

		expect(balanceInitial.eq(DEFAULT_BALANCE)).to.be.true
		await wallet.connect(acc1).approveTransfer(idx) // idx=1
		await wallet.connect(acc2).approveTransfer(idx) // idx=1

		// Since two two addresses approved (acc1 and acc2) the txn should have happened by now
		const transfers = await wallet.getTransfers()
		expect(transfers[idx].approvals.eq(2)).to.be.true // APPROVALS INCREMENTED i.e., 2
		// console.log('transfers?', transfers) // Get pretty readable output

		// Transfer amount should be withdrawn from wallet balance
		const receivedWalletBalance = await provider.getBalance(wallet.address) //LEARN: // const provider = ethers.getDefaultProvider(); // This works as well but too slow, takes around 2 seconds to execute
		const expectedWalletBalance = INITIAL_CONTRACT_BALANCE - TRANSFER_AMOUNT
		expect(receivedWalletBalance.eq(expectedWalletBalance)).to.be.true

		// Net profit of user should be equal to amount transferred
		const balanceFinal = await acc6.getBalance() // LEARN: hardhat way to get any signer's balance (works good as well)
		// const balanceFinal = await provider.getBalance(addr6) // LEARN: provider way to get any signer's balance
		const receivedProfit = balanceFinal.sub(balanceInitial)
		expect(receivedProfit.eq(TRANSFER_AMOUNT)).to.be.true
	})

	// vid 53 - Testing unhappy paths ~Author
	it('should NOT approve transfer if sender is not approved', async () => {
		const idx = 1
		const expectedErrMessage = 'only approvers allowed'
		// To execute a txn from a particular account in truffle, consider searching TRUFFLE:#001 in this project
		await expect(wallet.connect(acc5).approveTransfer(idx)).to.be.revertedWith(expectedErrMessage)
	})

	it('should NOT approve transfer if transfer is already sent', async () => {
		// const transfers = await wallet.getTransfers()
		// console.log('transfers?', transfers); // Get pretty readable output
		const idx = 1
		const expectedErrMessage = 'transfer has already been sent'
		await expect(wallet.connect(acc3).approveTransfer(idx)).to.be.revertedWith(expectedErrMessage)
	})

	it('should NOT approve transfer twice', async () => {
		const idx = 0 // using transfeId = 0 becoz 0th transfer has not been made yet (1st transfer was successful though)
		const expectedErrMessage = 'you cannot approve transfer twice'
		// LEARN: By default `firstAccount` is used to make the txn (and we have already approved the 0th transfer with firstAccount in "should increment approvals" test already.
		await expect(wallet.approveTransfer(idx)).to.be.revertedWith(expectedErrMessage)
	})
})

// ==== MORE =====
// LEARN: Get signer address
// console.log(await wallet.signer.getAddress());

// LEARN: GET ALL THE METHODS OF A CONTRACT
// console.log('function?', wallet.functions)
