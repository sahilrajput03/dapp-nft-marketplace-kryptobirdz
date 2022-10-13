const {ethers, network} = require('hardhat')
const {expect} = require('chai')
const {BigNumber} = ethers

// From swapnil course
describe('distributed wallet contract', () => {
	it('first account has 10,000 eth', async () => {
		await network.provider.send('hardhat_reset')

		const [firstAcc] = await ethers.getSigners()
		const firstAccBal = await firstAcc.getBalance()

		const DEFAULT_BALANCE = BigNumber.from('10000000000000000000000')
		expect(firstAccBal.eq(DEFAULT_BALANCE)).eq(true)
	})

	it('sendMoney', async () => {
		const DistributedWallet = await ethers.getContractFactory('DistributedWalletMinimal')
		const distributedWallet = await DistributedWallet.deploy()
		await distributedWallet.deployed()

		const balance = await distributedWallet.getBalance() // we defined `getDefBalance` this function in the contract itself
		// const balance = await distributedWallet.balance() // this works as well coz balance is public

		const ONE_GWEI = 10 ** 9

		const [firstAcc] = await ethers.getSigners()
		const initialBalofUser = await firstAcc.getBalance()
		// Send 2 gwei
		const amount = 2 * ONE_GWEI
		const balance1DistributedWallet = await distributedWallet.balance()
		expect(balance1DistributedWallet.eq(0)).equal(true)
		const tx1 = await distributedWallet.sendMoney({value: amount})
		const balance2DistributedWallet = await distributedWallet.balance()
		expect(balance2DistributedWallet.eq(amount)).equal(true)

		// @@@@ Calculate gas cost
		const rc1 = await tx1.wait()
		const gasCostForTx1 = rc1.gasUsed.mul(rc1.effectiveGasPrice)

		// @@@@ Test if user's balance is deducted correctly
		const finalBalOfUser = await firstAcc.getBalance()
		// Checking if initial - final) = netChargesToUser = amount + gasCost
		const netChargesToUser = BigNumber.from(amount).add(gasCostForTx1)
		expect(initialBalofUser.sub(finalBalOfUser).eq(netChargesToUser)).equal(true)

		// @@@ Widthdraw money
		const userBalBeforeWithdraw = await firstAcc.getBalance()
		const tx2 = await distributedWallet.withdraw(firstAcc.address, amount)
		// @Tx cost
		const rc2 = await tx2.wait()
		const gasCostForTx2 = rc2.gasUsed.mul(rc2.effectiveGasPrice)

		// @Test Contract balance
		const balance3DistributedWallet = await distributedWallet.balance()
		expect(balance3DistributedWallet.eq(0)).equal(true)

		// @Test User's balance is increased by `amount`
		const userBalAfterWithdraw = await firstAcc.getBalance()
		// Checking if final - initial = netProfitToUser = amount - gasCost
		const netProfitToUser = BigNumber.from(amount).sub(gasCostForTx2)
		expect(userBalAfterWithdraw.sub(userBalBeforeWithdraw).eq(netProfitToUser)).equal(true)

		// @@@@@@@ Destroy contract
		const tt = await distributedWallet.destructTheContract()
		// If contract is destroyed calling `balance()` method throws error as below
		const expectedError = 'call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (method="balance()", data="0x", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.6.4)'
		let error
		try {
			await distributedWallet.balance()
		} catch (e) {
			error = e
		}
		expect(error.name).equal('Error')
		expect(error.message).equal(expectedError)
	})
})
