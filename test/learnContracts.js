const {expect} = require('chai')
const {BigNumber, logger} = require('ethers') // hh.ethers.BigNumber , also works.
const {ethers, network} = require('hardhat')
// const {ethers} = require('ethers') // from your own
// Article Writing Test for Contract: https://dev.to/jacobedawson/import-test-a-popular-nft-smart-contract-with-hardhat-ethers-12i5
// Gtihub: https://github.com/jacobedawson/import-test-contracts-hardhat
// Writing Test (Truffle): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript/
// Writing Test (Solidity): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-solidity/
// Ethers Api Docs: https://docs.ethers.io/v5/api/utils/bignumber/

// All Chai Matchers: https://hardhat.org/hardhat-chai-matchers/docs/overview

// Introduction to Simple Smart Contract: https://docs.soliditylang.org/en/develop/introduction-to-smart-contracts.html?highlight=address(0)#index-8
// zero address: https://stackoverflow.com/questions/48219716/what-is-address0-in-solidity#:~:text=Note%3A%20There%20is%20also%20the,is%20set%20to%20'0x0'.&text=address(0)%20is%20also%20the,send%20'burned'%20tokens%20to.
const zeroAddress = '0x0000000000000000000000000000000000000000'
const FirstAccAddr = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

// console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991
// console.log(String(Number.MAX_SAFE_INTEGER).length) // 16

describe('Contract1 Tests', function () {
	// Runs callback before each test below
	beforeEach(async function () {
		// await network.provider.send('hardhat_reset')
	})
	it('first account has 10,000 eth', async () => {
		// Reset accounts in hardhat node // https://ethereum.stackexchange.com/a/112437/106687
		await network.provider.send('hardhat_reset')

		const [firstAcc] = await ethers.getSigners()
		const firstAccBal = await firstAcc.getBalance()
		const DEFAULT_BALANCE = BigNumber.from('10000000000000000000000')
		// const DEFAULT_BALANCE = BigNumber.from(10_000_000_000_000_000_000_000n) // Using bigInt also works fine and docs provide example an example using big Int as well. // ~Sahil: Learn to use big int in js: https://github.com/sahilrajput03#limitation-of-javascript-amazing-bigint-type
		expect(firstAccBal.eq(DEFAULT_BALANCE)).eq(true)
	})

	it('first contract', async function () {
		const Contract1 = await ethers.getContractFactory('Contract1')
		const contract1 = await Contract1.deploy()
		await contract1.deployed()
		// const variablesAddress = variables.address

		// a getter is created for every public variable
		let myuInt = await contract1.myuInt()
		expect(myuInt).to.equal(2)

		contract1.inc()
		expect(await contract1.myuInt()).to.equal(3)

		contract1.dec()
		contract1.dec()
		contract1.dec()
		expect(await contract1.myuInt()).to.equal(0)

		contract1.dec()
		expect(await contract1.myuInt()).to.equal(0)

		expect(await contract1.myBool()).to.equal(false) // unitialized bool
		await contract1.changeVal()
		expect(await contract1.myBool()).to.equal(true)

		expect(await contract1.myString()).to.equal('')
		await contract1.changeString()
		expect(await contract1.myString()).to.equal('sahil')

		const defAddress = await contract1.defAddress()
		expect(typeof defAddress).to.equal('string')
		expect(defAddress).to.equal(zeroAddress)

		const address = await contract1.myAdd()
		expect(typeof address).to.equal('string')
		expect(address).to.equal(FirstAccAddr)
		const defBalance = await contract1.getDefBalance() // we defined `getDefBalance` this function in the contract itself
		// console.log({defBalance})
		const expectedKeys = ['_hex', '_isBigNumber']
		expect(Object.keys(defBalance)).to.have.same.members(expectedKeys)
		expect(typeof defBalance).equal('object')

		expect(defBalance.eq(0)).equal(true)

		// Where is this value coming from.. coz its chainging everytime
		const myBalance = await contract1.getMyBalance()
		// console.log({myBalance})
		expect(typeof defBalance).equal('object')
		// WARNING: Balance keeps on changing idk why ~Sahil
		// expect(defBalance).equal(BigNumber.from('99999.9999999.....'))
		expect(Object.keys(defBalance)).to.have.same.members(expectedKeys)

		// Learn: 1 Ether = 10^18 wei
		// So if user has 100 Eth as balance then balance would be 10^20 wei

		expect(await contract1.myMap(0)).equal(zeroAddress)
		await contract1.initMyMap() // initialize key 0 value as myAddress in the contract
		expect(await contract1.myMap(0)).equal(FirstAccAddr)
		expect(await contract1.myMap(3)).equal(zeroAddress) // bcoz key 3 is not initialized

		// init user with respective address; setting value in `myMap` in contract
		await contract1.initUser(17, FirstAccAddr)
		expect(await contract1.myMap(17)).equal(FirstAccAddr)
	})
})

describe('Contract2 Tests', function () {
	it('second contract - simple', async function () {
		// LEARN STRUCTS
		const Contract2 = await ethers.getContractFactory('Contract2')
		const contract2 = await Contract2.deploy()
		await contract2.deployed()
		// const variablesAddress = variables.address

		// a getter is created for every public variable
		const myuInt = await contract2.myuInt()
		expect(myuInt).to.equal(2)

		// console.log(contract2)
		const fund = await contract2.fund()
		expect(fund.addr).to.equal(zeroAddress)
		expect(fund.amt.eq(0)).equal(true)

		await contract2.change()
		const newFund = await contract2.fund()
		expect(newFund.addr).to.equal(FirstAccAddr)
		expect(newFund.amt.eq(25)).equal(true)

		// LEARN ARRAYS
		const missingArgumentArrayErr = {
			name: 'Error',
			message: 'missing argument: passed to contract (count=0, expectedCount=1, code=MISSING_ARGUMENT, version=contracts/5.6.2)',
		}
		let err0
		try {
			const arr = await contract2.arr() // we're not providing argument to arr so it throws error like above.
		} catch (error) {
			err0 = error
		}
		expect(err0.name).equal(missingArgumentArrayErr.name)
		expect(err0.message).equal(missingArgumentArrayErr.message)

		const nullPointerArrayError = {
			name: 'Error',
			message: 'call revert exception [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (method="arr(uint256)", data="0x", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.6.4)',
		}
		let err
		try {
			const arr = await contract2.arr(0) // to get value at 0 index
		} catch (error) {
			err = error
		}
		expect(err.name).equal(nullPointerArrayError.name)
		expect(err.message).equal(nullPointerArrayError.message)

		// Push item to array
		await contract2.pushArr(5)
		// `valueAt0` is a BigNumber
		const valueAt0 = await contract2.arr(0) // contract2.arr(0) gets value at 0 index
		expect(valueAt0.eq(5)).equal(true)

		// Pop and try to access now will throw err again coz no value @ 0 index again as last above error
		await contract2.popArr()
		let err2
		try {
			const value2 = await contract2.arr(0)
		} catch (error) {
			err2 = error
		}
		expect(err2.name).equal(nullPointerArrayError.name)
		expect(err2.message).equal(nullPointerArrayError.message)

		// FIXED SIZE ARRAY (i.e., see `barr` in smart contract)
		const bal = await contract2.barr(0)
		expect(bal.eq(0)).equal(true)

		// Same string comparison and BigNumber comparision *works* for beloe entities at index 1 and 2 as well -
		const bar1 = await contract2.barr(1)
		const bar2 = await contract2.barr(2)
		expect(bar1.eq(0)).equal(true)
		expect(bar2.eq(0)).equal(true)
		// expect(await contract2.barr(1)).equal(0)
		// expect(await contract2.barr(2)).equal(0)

		await contract2.setSecondIndexValueInBarr(51)

		const newBar1 = await contract2.barr(1)
		expect(newBar1.eq(51)).equal(true)

		// learn enums
		// enum ActionChoices{left,right,up,down} which means left=0, right=1, up=2, down=3
		expect(await contract2.choice()).equal(0)
		await contract2.setRight()
		expect(await contract2.choice()).equal(1)
		await contract2.setUp()
		expect(await contract2.choice()).equal(2)
		await contract2.setLeft()
		expect(await contract2.choice()).equal(0)

		// learn mappings: Mapping is associative array or key-value pairs
		// mapping(key => value) VISIBILITYIDENTIFIER(public/private) VARIABLE_NAME;
		// KEY can be (uint, string and address i.e., elementary data-types) and VALUE can be any data-type (including structs and all)

		//?@@@@ Learn functions
		//?@@@@ VISIBILITY IDENTIFIERS:
		// 1. public: callable internally, externally and also by inherited contracts
		// 2. private callable only via contract itself not via derived contract
		// 3. external: callable only from other contracts and externally (*not* callable by contract itself)
		// 4. internal: () callable only from contract itself or from derived contracts *not* by transactions

		expect(await contract2.myString()).equal('')
		// Learn: Getter function can either be pure or view
		// PURE FUNCTIONS cannot modify/read state variables
		// `sumExternalPure` is of type BigNumber
		const sumExternalPureResult = await contract2.sumExternalPure(2, 3) // external pure
		// console.log('sumExternalPure?', sumExternalPure)
		expect(sumExternalPureResult.eq(5)).equal(true)

		const multiplyPublicPureResult = await contract2.multiplyPublicPure(2, 3) // public pure
		expect(multiplyPublicPureResult.eq(6)).equal(true)

		// expect(await contract2.sumExternalPure(2, 3)).equal(5)
		// expect(await contract2.multiplyPublicPure(2, 3)).equal(6)
		// VIEW FUNCTION cannot modify state variables but can read state
		expect(await contract2.namePublicView()).equal('sahil')
		expect(await contract2.nameExternalView()).equal('sahil')

		expect(await contract2.concatMyString('world')).equal('hello world')

		// Events Implementation: https://ethereum.stackexchange.com/a/119857
		const txn = await contract2.learnEvent(7) // Docs: https://docs.ethers.io/v5/single-page/#/v5/api/providers/types/-%23-providers-TransactionResponse
		const receipt = await txn.wait()
		// console.log(rc.events.map((event) => event.event)) // Lists all emmited events from tx
		const myEvent = receipt.events.find((event) => event.event === 'myEvent')
		const [foo, bar, baz] = myEvent.args
		// `foo`, `bar`, `baz` is of type BigNumber
		// console.log('foo?', foo)
		expect(foo.eq(7)).equal(true)
		expect(bar.eq(8)).equal(true)
		expect(baz.eq(9)).equal(true)

		const yourEvent = receipt.events.find((event) => event.event === 'yourEvent')
		const [buzz] = yourEvent.args
		expect(buzz).equal('bacardi')

		// Testing event in a better way (INTUTIVE WAY)
		await expect(contract2.learnEvent(7)).to.emit(contract2, 'myEvent').withArgs(7, 8, 9)
		await expect(contract2.learnEvent(7)).to.emit(contract2, 'yourEvent').withArgs('bacardi')
	})

	it('deafult accounts in hardhat test environment', async () => {
		const DEFAULT_ACCOUNTS = ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', '0x90F79bf6EB2c4f870365E785982E1f101E93b906', '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65', '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc', '0x976EA74026E726554dB657fA54763abd0C3a0aa9', '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955', '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f', '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720', '0xBcd4042DE499D14e55001CcbB24a551F3b954096', '0x71bE63f3384f5fb98995898A86B02Fb2426c5788', '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a', '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec', '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097', '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199']

		// https://docs.ethers.io/v5/api/signer/
		const allSigners = await ethers.getSigners()
		const allSignersAddressList = allSigners.map((s) => s.address)
		expect(allSignersAddressList).to.have.same.members(DEFAULT_ACCOUNTS)
	})

	it('non-view and non-pure functions return transaction data', async () => {
		const Contract2 = await ethers.getContractFactory('Contract2')
		const contract2 = await Contract2.deploy()
		// Wait until the transaction is mined (i.e. contract is deployed) : <<<ETHERJS DOCS
		//  - returns the receipt
		//  - throws on failure (the reciept is on the error)
		const rc1 = await contract2.deployTransaction.wait()
		expect(rc1.to).equal(null) // null bcoz its the contract init transaction
		expect(rc1.from).equal(FirstAccAddr)

		const tx1 = await contract2.deployed()
		const rc2 = await tx1.deployTransaction.wait()
		expect(rc2.to).equal(null) // null bcoz its the contract init transaction
		expect(rc1.from).equal(FirstAccAddr)

		// All functions return tx (transaction) data (*non view and *non pure functions)
		const tx = await contract2.simpleFunction()
		// console.log({tx})
		expect(typeof tx).equal('object')
		const expectedKeysTx = ['hash', 'type', 'accessList', 'blockHash', 'blockNumber', 'transactionIndex', 'confirmations', 'from', 'gasPrice', 'maxPriorityFeePerGas', 'maxFeePerGas', 'gasLimit', 'to', 'value', 'nonce', 'data', 'r', 's', 'v', 'creates', 'chainId', 'wait']
		// const {gasPrice, gasLimit, maxFeePerGas} = tx
		// console.log({gasPrice, gasLimit, maxFeePerGas})
		expect(Object.keys(tx)).to.have.same.members(expectedKeysTx)
		const rc = await tx.wait()
		const expectedKeysRc = ['to', 'from', 'contractAddress', 'transactionIndex', 'gasUsed', 'logsBloom', 'blockHash', 'transactionHash', 'logs', 'blockNumber', 'confirmations', 'cumulativeGasUsed', 'effectiveGasPrice', 'status', 'type', 'byzantium', 'events']
		expect(Object.keys(rc)).to.have.same.members(expectedKeysRc)

		/* src: https://ethereum.stackexchange.com/a/88122
		- The return-value of a non-constant (neither pure nor view) function is available only when the function is called on-chain (i.e., from this contract or from another contract).
		- When you call such function from the off-chain (e.g., from an ethers.js script), you need to execute it within a transaction, and the return-value is the hash of that transaction.
		- This is because it is unknown when the transaction will be mined and added to the blockchain.

		Moreover, even when the transaction is added to the blockchain, it can be removed from it later.
		Why do I get `transactionData` instead of actual return value of the solidity function) -
		(1 *) Lovely Question and Explanation: https://stackoverflow.com/questions/72101716/calling-smart-contract-with-hardhat-can-return-either-value-or-dictionary
		(2*) Another good answer on stackoverflow:: https://ethereum.stackexchange.com/a/94873
		(3*) Obtain value from non-view function: https://ethereum.stackexchange.com/a/88122
		(4) https://ethereum.stackexchange.com/a/88122
		*/
	})
})

// FYI: 1eth = 10**9gwei = 10**18 wei). ~Sahil: ALSO: 1 gwei is gigaWei i.e., 10**9 wei
//? CONVERT WEI TO ETHER
// const ethValue = ethers.utils.formatEther(weiValue)
/**
 * DOCS: ethers.utils.formatUnits( value [ , unit = "ether" ] ) ⇒ string
 * Returns a string representation of value formatted with unit digits (if it is a number) or to the unit specified (if a string).
 * DOCS: https://docs.ethers.io/v5/api/utils/display-logic/#utils-formatEther
 */

// Learn simple math with BigNumber (subtraction)
// console.log(BigNumber.from('33919000271350').sub(BigNumber.from('33919000271360')))

describe('Contract 3 Tests', function () {
	it('simple amount transfer', async function () {
		// @@@LEARN: Contracts are deployed using the first signer/account by default ~Hardhat docs
		const [firstAcc] = await ethers.getSigners()
		const Contract3 = await ethers.getContractFactory('Contract3')
		const ONE_GWEI = 10 ** 9
		const amount = 2 * ONE_GWEI

		// Ether String and wei: https://docs.ethers.io/v4/api-utils.html#ether-strings-and-wei
		const oneEtherInWei = ethers.utils.parseEther('1') // 1 eth = 10**18 wei
		expect(oneEtherInWei.eq(BigNumber.from('1000000000000000000')))

		const contract3 = await Contract3.deploy() //? @@@@LEARN@@@: last argument will be msg object ~Sahil (check Lock.js file)
		await contract3.deployed()
		// console.log(contract3.address) // Address of contract. It changes on every run of the test ~Sahil
		const balanceContract3 = await contract3.balance()
		expect(balanceContract3.eq(0)).equal(true) // initial value
		// Adding money to contract address from first signer account ~Sahil (=> Passing msg.value to solidity function: https://ethereum.stackexchange.com/a/102760)
		// msg.value: https://ethereum.stackexchange.com/a/43382
		await contract3.getMoney({value: amount}) // tldr: last argument is considered as `msg` object ~Sahil

		const balanceUpdatedContract3 = await contract3.balance()
		expect(balanceUpdatedContract3.eq(amount)).equal(true) // balance is returned in gwei
		// Add more money
		const tx1 = await contract3.getMoney({value: amount})
		expect(tx1.from).equal(firstAcc.address) // tx.from is the address of first user in the 20 account of hardhat accounts ~Sahi
		// ALSO, `tx.to` WILL BE the addess of the contract itself (it changes on every run of the test as well) ~Sahil
		// Getting value of `balance` variable of the contract ~Sahil
		const expectedBalance = BigNumber.from(2 * amount)
		const receivedBalance = await contract3.balance()
		expect(receivedBalance.eq(expectedBalance)).equal(true) // balance is returned in gwei

		// withdraw money from contract to particular account
		const initialBal = await firstAcc.getBalance()
		const tx2 = await contract3.withdraw(firstAcc.address, amount)
		const rc2 = await tx2.wait()
		const gasCostForTxn = rc2.gasUsed.mul(rc2.effectiveGasPrice) // My own answer at stackexchange: https://ethereum.stackexchange.com/a/133587/106687
		const expectedProfit = BigNumber.from(amount).sub(gasCostForTxn)
		const finalBal = await firstAcc.getBalance()
		const profit = finalBal.sub(initialBal) // MATH.OPERATIONS ON BIGNUMBER: https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber--BigNumber--methods--math-operations
		// console.log({profit, expectedProfit})
		expect(profit.eq(expectedProfit)).equal(true)
	})
})

const genericRequireErrorMessagePrefix = 'VM Exception while processing transaction: reverted with reason string '

describe('contract 4', function () {
	it('testing msg.value', async function () {
		const Contract4 = await ethers.getContractFactory('Contract4')
		const contract4 = await Contract4.deploy()
		await contract4.deployed()

		const tx1 = await contract4.getMsgDetails()
		const rc = await tx1.wait()
		const msgDetailsEvent = rc.events.find((e) => e.event === 'msgDetails')

		const [msgSender, msgValueInWeiWithTheMessage, amount, gasLeft] = msgDetailsEvent.args
		// msg.sender in contracts is the address of the `firstAccAddr` from 20 demo accounts of the hardhat node.
		expect(msgSender).equal(FirstAccAddr)
		// msg.value in contracts (default value is 0)
		expect(msgValueInWeiWithTheMessage.eq(0)).equal(true)
		// address(this).balance: balance of contract - IMO~Sahil
		expect(amount.eq(0)).equal(true)
		// gasleft() in contracts
		// console.log(gasLeft) // (static value is passed to test manually- can be flaky test in future ~Sahil)
		expect(gasLeft._isBigNumber).equal(true)

		// require() in solidity
		const expectedErrMessage = "give number's is smaller"
		// Clean way
		await expect(contract4.isTwoDigitNumber({value: 6})).to.be.revertedWith(expectedErrMessage) // this message is actually reverted by using statement in contract ie., `require(msg.value > 9, "give number's is smaller");`
	})

	it('block.timestamp', async () => {
		const Contract4 = await ethers.getContractFactory('Contract4')
		const contract4 = await Contract4.deploy()
		await contract4.deployed()

		const ts1 = await contract4.getSomeTimeStamp()
		await contract4.isTwoDigitNumber({value: 50})
		const ts2 = await contract4.getSomeTimeStamp()

		//? @@@@@@ ##### This can be flaky test ~Sahil
		expect(ts1).not.equal(ts2)
	})
})

describe('contract 5', function () {
	it('revert, assert and require', async function () {
		// require(), assert(), revert() in SOLIDITY DOCS: https://docs.soliditylang.org/en/v0.8.9/control-structures.html#error-handling-assert-require-revert-and-exceptions

		// Choosing between `require` and `assert`
		const Contract5 = await ethers.getContractFactory('Contract5')
		const contract5 = await Contract5.deploy()
		await contract5.deployed()

		const [_, secondSigner] = await ethers.getSigners()

		// @LEARN-REVERT (errorMessage can be tested)
		const expectedErrMessage = 'Not owner'

		// calling transaction from other than owner account (i.e., 1st account) of the default accounts: https://github.com/ethers-io/ethers.js/issues/1449#issuecomment-817198604
		await expect(contract5.connect(secondSigner).getMoney({value: 6})).to.be.revertedWith(expectedErrMessage)

		/** REQUIRE vs. ASSERT? Source: https://codeforgeek.com/assert-vs-require-in-solidity/#:~:text=The%20assert()%20and%20require,It%20also%20flags%20an%20error.
		 * 1. The big difference between the two is that the assert() function when false, uses up all the remaining gas and reverts all the changes made. Meanwhile, a require() function when false, also reverts back all the changes made to the contract but does refund all the remaining gas fees we offered to pay. This is the most common Solidity function used by developers for debugging and error handling.

		 * 2. A properly running program should never reach a failing assert statement; if this occurs, there is a flaw in your contract that has to be addressed.

		=> Q. When to use require() and assert() ?
		Ans. Solidity documentation states it very clearly.

		1. The assert function should only be used to examine invariants and test for internal problems.

		2. The require function should be used to check return values from calls to external contracts or to guarantee that valid conditions, such as inputs or contract state variables, are satisfied.
		*/

		// @LEARN-ASSERT (errorMessage can *NOT* be tested because we can not pass message via `assert`)
		// LEARN: chai matchers have no direct way of testing solidity assert errors: https://hardhat.org/hardhat-chai-matchers/docs/overview
		let e1
		try {
			const tx = await contract5.withdraw(333)
		} catch (e) {
			e1 = e
		}
		expect(e1.name).equal('Error')
		expect(e1.message).equal('VM Exception while processing transaction: reverted with panic code 0x1 (Assertion error)')

		// LEARN: Below test doesn't work to test with the assert so above way of testing is the only way. (as this test pass even when assert instruction is commented)
		// await expect(contract5.withdraw(333)).to.be.revertedWith('')

		// @LEARN-REQUIRE (errorMessage can be tested - Way1)
		const expectedErrMessage2 = 'xxx - U are not the owner'
		await expect(contract5.connect(secondSigner).withdraw(1)).to.be.revertedWith(expectedErrMessage2)
		// @LEARN-REQUIRE (errorMessage can be tested - Way2: Dirty way - Using try and catch)
		const e2 = {}
		try {
			const tx = await contract5.connect(secondSigner).withdraw(1)
		} catch (error) {
			const {name, message} = error
			e2.name = name
			e2.message = message
			e2.parsedMessage = parseRequireErrorMessage(message)
		}
		expect(e2.name).equal('Error')
		expect(e2.message.startsWith(genericRequireErrorMessagePrefix)).equal(true)
		expect(e2.parsedMessage).equal(expectedErrMessage2)

		// waht does {uint public targetAmount = 7 ether} in solidity means
		const Amount = await contract5.targetAmount()
		expect(Amount.eq(ethers.utils.parseEther('7'))).equal(true) //? @@ LEARN: parseEther requires a string type only, not a number.
		const sevenEthersInWei = BigNumber.from('7000000000000000000')
		expect(Amount.eq(sevenEthersInWei)).equal(true)
	})
})

describe('contract 6', function () {
	it('simple withdraw to owner', async () => {
		// Rest all accounts
		await network.provider.send('hardhat_reset')

		const Contract6 = await ethers.getContractFactory('Contract6')
		const contract6 = await Contract6.deploy()
		await contract6.deployed()

		const [firstSigner] = await ethers.getSigners()

		// expect(firstSingerBalance.eq(BigNumber.from("9999999654043750000000"))).equal(true);

		// Add balance to contract6
		const expectedWei = ethers.utils.parseEther('40')
		await contract6.deposit({value: expectedWei})
		const bal = await contract6.getContractBalance()
		expect(bal.eq(expectedWei)).equal(true)

		// LEARN: pure/view functions do not consume gas at all: https://ethereum.stackexchange.com/a/60598/106687
		// LEARN: Pure and view functions still cost gas if they are called internally from another function. They are only free if they are called externally, from outside of the blockchain. Source: https://stackoverflow.com/a/61908281/10012446
		// Withdraw to owner of the contract (LEARN: owner of contract != contract itself) ~Sahil
		const initialBal = await firstSigner.getBalance()
		// Withdraw all balance of the contract to the owner (contract creator i.e, our firstSigner account) ~Sahil
		const tx = await contract6.withdrawToOwner()
		const rc = await tx.wait()
		const gasCostForTxn = rc.gasUsed.mul(rc.effectiveGasPrice)

		const finalBal = await firstSigner.getBalance()
		const gain = finalBal.sub(initialBal)
		// console.log({ gain });
		expect(gain.eq(expectedWei.sub(gasCostForTxn))).equal(true)
	})

	it('delete contract owner by setting owner address to zeroAddress', async () => {
		const Contract6 = await ethers.getContractFactory('Contract6')
		const contract6 = await Contract6.deploy()
		await contract6.deployed()

		const [firstSigner] = await ethers.getSigners()

		//?@@@@@ Deleting Owner
		expect(await contract6.getOwnerAddress()).equal(firstSigner.address)
		await contract6.deleteOwner()
		expect(await contract6.getOwnerAddress()).equal(zeroAddress)
	})

	it('withdraw to any user', async () => {
		const [_, secondSigner] = await ethers.getSigners()
		const Contract6 = await ethers.getContractFactory('Contract6')
		const contract6 = await Contract6.deploy()
		await contract6.deployed()

		const expectedWei = ethers.utils.parseEther('40')
		// Add balance to contract6
		await contract6.deposit({value: expectedWei})
		const contractBal = await contract6.getContractBalance()
		expect(contractBal.eq(expectedWei)).equal(true)

		const initialBalSecondSigner = await secondSigner.getBalance()
		//? @@@@@@@@@ Withdraw to any user
		const tx2 = await contract6.connect(secondSigner).withdrawToAny()
		const rc2 = await tx2.wait()
		const gasCostForTxn2 = rc2.gasUsed.mul(rc2.effectiveGasPrice)

		const finalBalSecondSigner = await secondSigner.getBalance()
		const gain2 = finalBalSecondSigner.sub(initialBalSecondSigner)
		// console.log({ gain2: gain2.add(gasCostForTxn2) }); // 40 eth i.e,. 40 * 10**18
		expect(gain2.eq(expectedWei.sub(gasCostForTxn2))).equal(true)
	})

	it('calling non payable function throws error', async () => {
		const Contract6 = await ethers.getContractFactory('Contract6')
		const contract6 = await Contract6.deploy()
		await contract6.deployed()
		// console.log(contract6.interface)

		const expectedWei = ethers.utils.parseEther('40')

		// calling a non-payable function with some ether throws error: https://solidity-by-example.org/payable/
		let e
		try {
			await contract6.notPayable({value: expectedWei})
		} catch (error) {
			e = error
		}
		expect(e.name).equal('Error')
		expect(e.message).equal('non-payable method cannot override value (operation="overrides.value", value={"type":"BigNumber","hex":"0x022b1c8c1227a00000"}, code=UNSUPPORTED_OPERATION, version=contracts/5.6.2)')
	})
})

function parseRequireErrorMessage(message) {
	return message.slice(message.indexOf("'") + 1, -1)
}

// Learn: `console.logBytes()`, `console.logBytes32()`, `abi.encode()`, `keccak()`
describe('contract 7', function () {
	it('learn more, ', async () => {
		const Contract7 = await ethers.getContractFactory('Contract7')
		const contract7 = await Contract7.deploy()
		await contract7.deployed()

		await contract7.simpleFn()

		// expect().equal()
	})
})

describe('voting', function () {
	it('voting, ', async () => {
		const OpenVoting = await ethers.getContractFactory('OpenVoting')
		const openVoting = await OpenVoting.deploy()
		await openVoting.deployed()
		const [owner, addr1, addr2] = await ethers.getSigners()

		// create a Voting
		const NAME = 'Event Activity'
		const OPTIONS = ['tennis', 'baseball', 'soccer']
		const VOTERS = [owner.address, addr1.address, addr2.address]

		let total_votings = await openVoting.votingId()
		expect(total_votings).equal(0)

		await openVoting.createVoting(NAME, OPTIONS, VOTERS)
		total_votings = await openVoting.votingId()
		expect(total_votings).equal(1)

		// Getting All `Voting`s and `allOptionsVotes` (2d array)
		let [allVotings, allOptionsVotes] = await openVoting.getAllVotings()
		// console.log('got allVotings?', allVotings)
		let vId = 0 // `votingId`
		expect(allVotings[vId].votingId).equal(0)
		expect(allVotings[vId].name).equal(NAME)
		expect(allVotings[vId].options[0]).equal(OPTIONS[0])
		expect(allVotings[vId].options[1]).equal(OPTIONS[1])
		expect(allVotings[vId].options[2]).equal(OPTIONS[2])
		// check votes for options (all zero becoz no body voted yet)
		expect(allOptionsVotes[vId][0]).equal(0)
		expect(allOptionsVotes[vId][1]).equal(0)
		expect(allOptionsVotes[vId][2]).equal(0)

		// GETTING ONLY ONE `Voting` by providing idx ar argument to get value from a `mapping` type ~Sahil
		// const firstVoting = await openVoting.votings(0)

		// Vote for a `option` (i.e., option=0) of a voting
		let optionIdx = 0
		await openVoting.vote(allVotings[0].votingId, optionIdx)
		;[allVotings, allOptionsVotes] = await openVoting.getAllVotings()
		expect(allOptionsVotes[vId][optionIdx]).equal(1)

		// Getting votes for a single `Voting`
		let votes = await openVoting.votes(vId, optionIdx)
		expect(votes.eq(1)).to.be.true
	})
})

// StackOverflow: Question:  Fallback functions. What are they needed for?
// Source: https://stackoverflow.com/questions/69178874/solidity-v0-6-0-fallback-functions-what-are-they-needed-for
describe('rarely used features of solidity', async function () {
	it('fallback function, ', async () => {
		const Contract8 = await ethers.getContractFactory('Contract8')
		const contract8 = await Contract8.deploy()
		await contract8.deployed()
		const [owner, addr1, addr2] = await ethers.getSigners()

		// LEARN: Below works exactly as below code of `owner.sendTransaction`
		// const tx = contract8.signer.sendTransaction({
		// 	to: contract8.address,
		// 	data: '0x',
		// 	value: ethers.utils.parseEther("0")
		// })
		const tx = owner.sendTransaction({
			to: contract8.address,
			data: '0x',
			value: ethers.utils.parseEther('0'), // value is redundant here though
		})

		// Test fallback function
		await expect(tx).to.emit(contract8, 'myEvent').withArgs('fallback-function-works-yoo')
	})

	it('fallback function called with ether SHOULD revert / throw error', async function () {
		const Contract8 = await ethers.getContractFactory('Contract8')
		const contract8 = await Contract8.deploy()
		await contract8.deployed()
		const [owner, addr1, addr2] = await ethers.getSigners()
		const revertMessg = `Transaction reverted: there's no receive function, fallback function is not payable and was called with value 1000000000000000000`

		const txPromise = owner.sendTransaction({
			to: contract8.address,
			data: '0x',
			value: ethers.utils.parseEther('1'), // LEARN: Since value is non-zero i.e, we are sending some ether now the contract throws error coz fallback cannot receive ether as `fallback()` cannot be payable and we haven't implemented `receive()` function either, so contract throws error.
		})

		// Test rever message
		await expect(txPromise).to.be.revertedWith(revertMessg) // this message is actually reverted by using statement in contract ie., `require(msg.value > 9, "give number's is smaller");`

		// Test error message received
		let err
		const expectedErrMessg = 'cannot estimate gas; transaction may fail or may require manual gas limit'
		try {
			await txPromise
		} catch (error) {
			err = error
		}
		expect(err?.message.startsWith(expectedErrMessg)).equal(true)
	})

	// Learning: You cannot get your fallback function called 
	it('receive function has precedence over fallback function, ', async () => {
		const Contract10 = await ethers.getContractFactory('Contract10')
		const contract10 = await Contract10.deploy()
		await contract10.deployed()
		const [owner, addr1, addr2] = await ethers.getSigners()

		const tx = owner.sendTransaction({
			to: contract10.address,
			data: '0x',
			// Learn: Even if you pass 0 ether, only receive function will be called. So, there's no way to call fallback function when you have defined receive function in your contract. ~ IMO: Sahil
			value: ethers.utils.parseEther('1'), // value is redundant here though
		})

		// Test fallback function, I answered it on StackOverflow: https://stackoverflow.com/a/74226276/10012446
		await expect(tx).to.emit(contract10, 'myEvent').withArgs('receive-function-works-too')
	})
})
