const {ethers, network} = require('hardhat')
const {expect} = require('chai')
const {BigNumber} = ethers

/** Passing multiple values to constructor of the contract: https://stackoverflow.com/a/69751261/10012446 */

describe('distributed wallet contract', () => {
	it('sendMoney??', async () => {
		const [acc1, acc2, acc3, _, acc5] = await ethers.getSigners()

		const Wallet = await ethers.getContractFactory('MultiSigWallet')
		const addr1 = acc1.address
		const addr2 = acc2.address
		const addr3 = acc3.address
		const addr5 = acc5.address
		const addrs = [addr1, addr2, addr3]
		const wallet = await Wallet.deploy(addrs, 2) // we're passing array of addreses and quorum (second argument) as 2 i.e., minium number of approvers for the transaction

		await wallet.deployed()

		// Sending 1000 wei to contract (using receive fn i.e., using `sendTransaction` method)
		// Learn: `sendTransaction` @ `address of the wallet`
		const INITIAL_AMOUNT = 1000
		await acc1.sendTransaction({from: addr1, to: wallet.address, value: INITIAL_AMOUNT})

		/** SHOULD HAVE 1000 WEI */
		const contractBalance = await wallet.balance()
		expect(contractBalance.eq(INITIAL_AMOUNT)).equal(true)

		/** SHOULD HAVE CORRECT APPROVERS AND QUORUM */
		const [a1, a2, a3] = await wallet.getApprovers()
		const quorum = await wallet.quorum()

		expect(quorum.eq(2)).equal(true)
		expect(a1).equal(addr1)
		expect(a2).equal(addr2)
		expect(a3).equal(addr3)

		/** SHOULD CREATE TRANSFERS */
		const TRANSFER_AMOUNT = 100
		await wallet.createTransfer(TRANSFER_AMOUNT, addr5, {
			from: addr1, // you can use it to execute this test from a particular account
		})

		const transfers = await wallet.getTransfers()
		// console.log('transfers?', transfers); // Get pretty readable output
		expect(transfers.length).equal(1)
		expect(transfers[0].to).equal(addr5) // id is `BigNumber`
		expect(transfers[0].sent).equal(false) // id is `BigNumber`
		// BIG NUMBERS
		expect(transfers[0].id.eq(0)).equal(true) // id is `BigNumber`
		expect(transfers[0].amount.eq(TRANSFER_AMOUNT)).equal(true) // id is `BigNumber`
		expect(transfers[0].approvals.eq(0)).equal(true) // id is `BigNumber`

		// Start doing vid50..
	})
})

// ==== MORE =====
// LEARN: Get signer address
// console.log(await wallet.signer.getAddress());

// LEARN: GET ALL THE METHODS OF A CONTRACT
// console.log('function?', wallet.functions)
