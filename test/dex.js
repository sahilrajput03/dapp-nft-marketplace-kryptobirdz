const {ethers, network, waffle} = require('hardhat')
const {expect, assert} = require('chai')
const {BigNumber} = ethers
const {parseEther, formatEther} = ethers.utils

const SIDE = {
	BUY: 0,
	SELL: 1,
}

// Refer tests suite of truffle: https://github.com/jklepatch/eattheblocks/blob/master/blockchain-masterclass/dex-2-testing/11-test-create-market-order-unhappy-path/test/dex.js
describe('decentralized exchange', () => {
	const {provider} = waffle
	let dex, Dex, acc0, acc1, acc2, acc3, acc4, acc5, addr0, addr1, addr2, addr3, addr4, addr5
	let dai, bat, rep, zrx

	// Author used `web3.utils.fromAscii` method instead of `ethers.utils.formatBytes32String`
	const [DAI, BAT, REP, ZRX, _BAD_TOKEN] = ['DAI', 'BAT', 'REP', 'ZRX', 'BAD_TOKEN'].map((t) => ethers.utils.formatBytes32String(t)) // ethers docs: https://docs.ethers.io/v5/api/utils/strings/#Bytes32String
	// console.log([DAI, BAT, REP, ZRX]); // OUTPUT: Array of values like: '0x4441490000000000000000000000000000000000000000000000000000000000'

	// convert ether to wei; in TRUFFLE (web3js) you can do: `web3.utils.toWei('1000')` to convert ether to wei
	const tkns1000 = ethers.utils.parseEther('1000') // returns(BN i.e., 1000 Ether in wei) // YOU CAN ALSO DO: // const amount = ethers.utils.parseUnits('1000', 'ether') // returns (1000 Ether in wei)
	// console.log(eth1000); // 1000 * 10**18
	const tkns100 = ethers.utils.parseEther('100')
	const tkns200 = ethers.utils.parseEther('200')
	const tkns10 = ethers.utils.parseEther('10')
	const tkns5 = ethers.utils.parseEther('5')
	// LEARN CONVERSION BETWEEN TWO UNITS i.e, wei and ether with just two fns i.e, `formatEther` and `parseEther`
	// formatEther -> used to convert wei value to ether value
	// parseEther -> user to convert ether value to wei value (parseEther functions exactly opposite to wheat usually `parseInt`, `parseFloat` does in javascript and similarly in other languages. etherjs developer were on **high** as shit when making these apis? LOL ~Sahil)

	async function deployContracts() {
		// Reset accounts in hardhat node // https://ethereum.stackexchange.com/a/112437/106687
		await network.provider.send('hardhat_reset')
		// Assign variables
		;[acc0, acc1, acc2, acc3, acc4, acc5] = await ethers.getSigners()
		addr0 = acc0.address
		addr1 = acc1.address
		addr2 = acc2.address
		addr3 = acc3.address
		addr4 = acc4.address

		// Deploy contract
		;[dai, bat, rep, zrx] = await Promise.all([deployToken('DaiT'), deployToken('Bat'), deployToken('Rep'), deployToken('Zrx')])

		// Deploy dex
		Dex = await ethers.getContractFactory('Dex')
		dex = await Dex.deploy()
		await dex.deployed()

		// Add all tokens
		await Promise.all([dex.addToken(DAI, dai.address), dex.addToken(BAT, dex.address), dex.addToken(REP, rep.address), dex.addToken(ZRX, zrx.address)])

		// ADDING INITIAL TOKEN BALANCE TO A COUPLE OF ADDRESSES
		async function seedTokenBalance(token, account) {
			// Seed/Mint balance using custom `faucet()` method defined in all the mock token contracts
			await token.faucet(account.address, tkns1000) // ! Saying .faucet function not found so avoiding it for now.
			// FROM ERC20: approve(_spender, _value) Allows _spender to withdraw from your account multiple times, up to the _value amount.
			await token.connect(account).approve(dex.address, tkns1000) // TODO: make this from particular account
		}
		await Promise.all([dai, bat, rep, zrx].map((token) => seedTokenBalance(token, acc1)))
		await Promise.all([dai, bat, rep, zrx].map((token) => seedTokenBalance(token, acc2)))
		await Promise.all([dai, bat, rep, zrx].map((token) => seedTokenBalance(token, acc3)))
	}

	// Slows down the tests coz contracts are deployed and tore down before each test which is kinda unnecessary and sounds ugly to me
	// !YOU SHOULD ACTUALLY USE `beforeEach` coz they way you need to make your tests fast is by running only individual tests via `.only` way and *NOT* even try to run a series of tests when you change a single test becoz that is very very very very bad!
	// beforeEach(async () => {
	// 	await deployContracts()
	// })

	it('deploy mock erc20 tokens: Dai, Bat, Rep, Zrx', async () => {
		await deployContracts()
	})

	it('deposit function should work', async () => {
		// deposit fn allows any trader to deposit any erc20 inside decentralized exchange // Thats the beginning of the process for anyone wanna trade using our dex
		// ```function deposit(uint amount, bytes32 ticker) external tokenExists(ticker)```
		await dex.connect(acc1).deposit(tkns100, DAI)
	})

	// Unhappy path (1): tokenExists
	it('should NOT deposit tokens if token does not exist', async () => {
		const expectedErrMessage = 'this token does not exist'
		await expect(dex.connect(acc5).deposit(tkns100, _BAD_TOKEN)).to.be.revertedWith(expectedErrMessage)
	})

	it('should withdraw', async () => {
		// Necessary to reset the accounts balances and the states of all the contract
		await deployContracts()

		// SIGNATURE: `withdraw()`
		// function withdraw(uint amount, bytes32 ticker) external tokenExists(ticker)

		// Deposit
		await dex.connect(acc1).deposit(tkns100, DAI)
		// Withdraw
		await dex.connect(acc1).withdraw(tkns100, DAI)

		// get token balance from dex
		const [balanceDex, balanceDai] = await Promise.all([
			dex.traderBalances(addr1, DAI),
			dai.balanceOf(addr1), // ERC20's method from openzeppelin contract implementation, you can check this in the imported contract file (`ERC20.sol`) in all the mock tokens.
		])

		expect(balanceDex).equal(0)
		expect(balanceDai).equal(tkns1000)
	})

	it('should NOT withdraw tokens if token does not exist', async () => {
		const expectedErrMessage = 'this token does not exist'
		await expect(dex.connect(acc1).withdraw(tkns100, _BAD_TOKEN)).to.be.revertedWith(expectedErrMessage)
	})

	it('should NOT withdraw tokens if balance is too low', async () => {
		// We
		const traderAcc = acc1
		const traderAddress = addr1 // we are using addr1 becoz we allowed allowance for acc1 and acc2 only when setting allowances initially in `deployContract` fn

		// initial balance should be zero
		const dexBalanceBefore = await dex.traderBalances(traderAddress, DAI)
		// console.log('dexBalanceBefore?', dexBalanceBefore.toString());
		expect(dexBalanceBefore.eq(0)).to.be.true

		await dex.connect(traderAcc).deposit(tkns100, DAI)
		// after deposite dex balance should be 100
		const dexBalanceAfter = await dex.traderBalances(traderAddress, DAI)
		expect(dexBalanceAfter.eq(parseEther('100'))).to.be.true

		// withdrawing 1000 from the trader's dex account should revert (becoz balance is only 100eth)
		const expectedErrMessage = 'balance too low'
		await expect(dex.withdraw(tkns1000, DAI)).to.be.revertedWith(expectedErrMessage)
	})

	// createLimitOrder() allows traders to buy/sell tokens => Total tests: 4UH+1H paths for this function
	it('should create limit order', async () => {
		const traderAcc1 = acc1

		// deposit 100 of DAI token (coz decimals - 18 i.e, 1ETH=1DAI tokens) ~Sahil
		await dex.connect(traderAcc1).deposit(tkns100, DAI)
		// Signature of createLimitOrder: function createLimitOrder(bytes32 ticker,uint amount,uint price,Side side)
		const orderPrice = 5
		await dex.connect(traderAcc1).createLimitOrder(REP, tkns10, orderPrice, SIDE.BUY)

		let buyOrdersREP = await dex.getOrders(REP, SIDE.BUY)
		let sellOrders = await dex.getOrders(REP, SIDE.SELL)

		// console.log('buyOrders?', buyOrders)
		expect(buyOrdersREP.length).equal(1)
		expect(buyOrdersREP[0].ticker).equal(REP) // need padding? NO, for web3 Author used fn i.e,. `web3.utils.padRight(REP, 64)` and then comapared it directly with a string of the `buyOrders[0].ticker`
		expect(buyOrdersREP[0].amount.eq(tkns10)).to.be.true
		expect(buyOrdersREP[0].price.eq(orderPrice)).to.be.true
		expect(buyOrdersREP[0].trader).equal(traderAcc1.address)

		expect(sellOrders.length).equal(0) // coz no SELL orders are created yet

		//! CREATING ANOTHER LIMIT_ORDER
		const traderAcc2 = acc2
		// WE NEED TO CHECK THAT A NEWER LIMITORDER SHOULD BE ADDED AT CORRECT PLACE I.E., ACCORDING TO BEST PRICE ORDER
		await dex.connect(traderAcc2).deposit(tkns200, DAI)

		// get balances?
		const dexBalanceBefore = await dex.traderBalances(traderAcc2.address, DAI)
		// console.log('dexBalanceBefore?', formatEther(dexBalanceBefore))
		const OrderPriceNew = 9
		await dex.connect(traderAcc2).createLimitOrder(REP, tkns10, OrderPriceNew, SIDE.BUY) // please keep price below 11 else the error "dai balance too low" will be thrown.

		buyOrdersREP = await dex.getOrders(REP, SIDE.BUY)
		sellOrders = await dex.getOrders(REP, SIDE.SELL)
		expect(buyOrdersREP.length).equal(2)
		// Our new order should be moved to front of array coz `newOrderPrice` is better price compared to `orderPrice`
		expect(buyOrdersREP[0].price.eq(OrderPriceNew)).to.be.true
		expect(buyOrdersREP[0].trader).equal(traderAcc2.address)
		expect(buyOrdersREP[1].trader).equal(traderAcc1.address)

		expect(sellOrders.length).equal(0) // coz no SELL orders are created yet

		//! CREATING ANOTHER LIMIT_ORDER
		const traderAcc3 = acc3
		// WE NEED TO CHECK THAT A NEWER LIMITORDER SHOULD BE ADDED AT CORRECT PLACE I.E., ACCORDING TO BEST PRICE ORDER
		await dex.connect(traderAcc3).deposit(tkns100, DAI)

		// const Acc3dexBalanceBefore = await dex.traderBalances(traderAcc3.address, DAI)
		// console.log('Acc3dexBalanceBefore?', formatEther(Acc3dexBalanceBefore))
		const OrderPriceLatest = 3
		await dex.connect(traderAcc3).createLimitOrder(REP, tkns10, OrderPriceLatest, SIDE.BUY) // please keep price below 11 else the error "dai balance too low" will be thrown.

		buyOrdersREP = await dex.getOrders(REP, SIDE.BUY)
		sellOrders = await dex.getOrders(REP, SIDE.SELL)
		expect(buyOrdersREP.length).equal(3)
		// Our latest order should be moved to front of array coz `newOrderPrice` is better price compared to `orderPrice`
		expect(buyOrdersREP[0].trader).equal(traderAcc2.address)
		expect(buyOrdersREP[1].trader).equal(traderAcc1.address)
		expect(buyOrdersREP[2].price.eq(OrderPriceLatest)).to.be.true
		expect(buyOrdersREP[2].trader).equal(traderAcc3.address)

		expect(sellOrders.length).equal(0) // coz no SELL orders are created yet
	})

	it('should NOT create limit order if token does not exist', async () => {
		const expectedErrMessage = 'this token does not exist'
		await expect(dex.connect(acc1).createLimitOrder(_BAD_TOKEN, tkns10, 3, SIDE.BUY)).to.be.revertedWith(expectedErrMessage)
	})

	it('should NOT create limit order if token is DAI', async () => {
		const expectedErrMessage = 'cannot trade DAI'
		await expect(dex.connect(acc1).createLimitOrder(DAI, tkns10, 3, SIDE.BUY)).to.be.revertedWith(expectedErrMessage)
	})

	it('Should not create limit order if dai balance is too low', async () => {
		const dexBalanceBefore = await dex.traderBalances(acc1.address, DAI)
		// console.log('dexBalanceBefore?', formatEther(dexBalanceBefore))
		expect(dexBalanceBefore.eq(tkns200)).to.be.true

		const expectedErrMessage = 'dai balance too low'
		await expect(dex.connect(acc1).createLimitOrder(REP, tkns1000, 3, SIDE.BUY)).to.be.revertedWith(expectedErrMessage)
	})

	it('Should NOT create limit order if token balance is too low (SELL ORDER)', async () => {
		const dexBalanceBefore = await dex.traderBalances(acc1.address, DAI)
		// console.log('dexBalanceBefore?', formatEther(dexBalanceBefore))
		expect(dexBalanceBefore.eq(tkns200)).to.be.true

		const expectedErrMessage = 'token balance is too low'
		await expect(dex.connect(acc1).createLimitOrder(REP, tkns100, 3, SIDE.SELL)).to.be.revertedWith(expectedErrMessage)
	})

	// `createMarketOrder` Tests
	// SIGNATURE: function createMarketOrder(bytes32 ticker,uint amount,Side side)
	// ! YOU SHOULD USE `it.only` way to test methods which needs new initializations of the contracts, YIKES! Makes testing super fastt..!
	it('Should create market order & match against existing limit order', async () => {
		// Redeploy contracts to reset everything
		await deployContracts()
		const tkns4 = parseEther('4')

		// create a limitOrder of 10 tokens
		await dex.connect(acc1).deposit(tkns100, DAI)
		await dex.connect(acc1).createLimitOrder(REP, tkns10, 10, SIDE.BUY)
		// create a marketOrder of 4 tokens (so this marketOrder should buy part of tokens of above limitOrder)
		await dex.connect(acc2).deposit(tkns100, REP)
		await dex.connect(acc2).createMarketOrder(REP, tkns4, SIDE.SELL)

		const r1 = dex.traderBalances(acc1.address, DAI)
		const r2 = dex.traderBalances(acc1.address, REP)
		const r3 = dex.traderBalances(acc2.address, DAI)
		const r4 = dex.traderBalances(acc2.address, REP)
		const [oneDAI, oneREP, twoDAI, twoREP] = await Promise.all([r1, r2, r3, r4])

		const buyOrdersREP = await dex.getOrders(REP, SIDE.BUY)
		// Learn formatEther, parseEther? Please visit the top of this file.
		// console.log(formatEther(buyOrdersREP[0].filled));
		// console.log(formatEther(b1))
		// console.log(formatEther(b2))
		// console.log(formatEther(b3))
		// console.log(formatEther(b4))
		expect(buyOrdersREP[0].filled.eq(tkns4)).to.be.true //\\ ORDER 	    |   0 =>  4
		expect(oneDAI.eq(parseEther('60'))).to.be.true //\\\\\\\ Acc1 (DAI) | 100 => 60
		expect(oneREP.eq(parseEther('4'))).to.be.true //\\\\\\\\ Acc1 (REP) |   0 =>  4
		expect(twoDAI.eq(parseEther('40'))).to.be.true //\\\\\\\ Acc2 (DAI) |   0 => 40
		expect(twoREP.eq(parseEther('96'))).to.be.true //\\\\\\\ Acc2 (REP) | 100 => 96
	})

	it('should NOT create market order if token does not exist', async () => {
		const expectedErrMessage = 'this token does not exist'
		await expect(dex.connect(acc1).createMarketOrder(_BAD_TOKEN, tkns10, SIDE.BUY)).to.be.revertedWith(expectedErrMessage)
	})

	it('should NOT create market order if token is DAI', async () => {
		const expectedErrMessage = 'cannot trade DAI'
		await expect(dex.connect(acc1).createMarketOrder(DAI, tkns10, SIDE.BUY)).to.be.revertedWith(expectedErrMessage)
	})

	it('Should NOT create market order if token balance is too low (SELL ORDER)', async () => {
		await deployContracts()
		const tkns99 = parseEther('99')
		await dex.connect(acc1).deposit(tkns99, DAI)

		const expectedErrMessage = 'token balance too low'
		await expect(dex.connect(acc1).createMarketOrder(REP, tkns100, SIDE.SELL)).to.be.revertedWith(expectedErrMessage)
	})

	it('Should not create market order if dai balance is too low', async () => {
		await deployContracts()

		await dex.connect(acc1).deposit(tkns100, REP)
		await dex.connect(acc1).createLimitOrder(REP, tkns100, 10, SIDE.SELL) // cost = 1000 DAI (10 * 100tkns)

		const expectedErrMessage = 'dai balance too low'
		await expect(dex.connect(acc2).createMarketOrder(REP, tkns100, SIDE.BUY)).to.be.revertedWith(expectedErrMessage)
	})
})

async function deployToken(contractName) {
	const Token = await ethers.getContractFactory(contractName)
	const token = await Token.deploy()
	await token.deployed()
	return token
}
