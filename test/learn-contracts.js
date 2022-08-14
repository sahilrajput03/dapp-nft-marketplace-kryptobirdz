const {expect} = require('chai')
const {BigNumber} = require('ethers')
const {ethers, network} = require('hardhat')
// const {ethers} = require('ethers') // from your own
// Article Writing Test for Contract: https://dev.to/jacobedawson/import-test-a-popular-nft-smart-contract-with-hardhat-ethers-12i5
// Gtihub: https://github.com/jacobedawson/import-test-contracts-hardhat
// Writing Test (Truffle): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript/
// Writing Test (Solidity): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-solidity/
// Ethers Api Docs: https://docs.ethers.io/v5/api/utils/bignumber/

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
	it('first contract', async function () {
		// Reset accounts in hardhat node // https://ethereum.stackexchange.com/a/112437/106687
		await network.provider.send('hardhat_reset')

		const [firstAcc] = await ethers.getSigners()
		const firstAccBal = await firstAcc.getBalance()
		const DEFAULT_BALANCE = BigNumber.from('10000000000000000000000')
		// Using bigInt is also works fine and docs provide example an example using big Int as well ~Sahil
		// const DEFAULT_BALANCE = BigNumber.from(10_000_000_000_000_000_000_000n) // ~Sahil: Learn to use big int in js: https://github.com/sahilrajput03#limitation-of-javascript-amazing-bigint-type
		expect(firstAccBal.eq(DEFAULT_BALANCE)).eq(true)

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
		const defBalance = await contract1.getDefBalance()
		// console.log({defBalance})
		const expectedKeys = ['_hex', '_isBigNumber']
		expect(Object.keys(defBalance)).to.have.same.members(expectedKeys)
		expect(typeof defBalance).equal('object')
		expect(defBalance).equal(0)
		expect(defBalance).equal('0')
		expect(defBalance).equal(BigNumber.from('0')) // BigNumber.from('0') // https://docs.ethers.io/v5/api/utils/bignumber/

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
		expect(fund.amt).to.equal(0)

		await contract2.change()
		const newFund = await contract2.fund()
		expect(newFund.addr).to.equal(FirstAccAddr)
		expect(newFund.amt).to.equal(25)

		// LEARN ARRAYS
		const missingArgumentArrayErr = {name: 'Error', message: 'missing argument: passed to contract (count=0, expectedCount=1, code=MISSING_ARGUMENT, version=contracts/5.6.2)'}
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
		const valueAt0 = await contract2.arr(0) // contract2.arr(0) gets value at 0 index
		expect(valueAt0).equal(5)
		expect(valueAt0).equal(BigNumber.from('5'))

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
		expect(await contract2.barr(0)).equal(0)
		expect(await contract2.barr(0)).equal('0')
		expect(await contract2.barr(0)).equal(BigNumber.from('0'))
		// Same string comparison and BigNumber comparision *works* for beloe entities at index 1 and 2 as well -
		expect(await contract2.barr(1)).equal(0)
		expect(await contract2.barr(2)).equal(0)

		await contract2.setSecondIndexValueInBarr(51)
		expect(await contract2.barr(1)).equal(51)
		expect(await contract2.barr(1)).equal('51')
		expect(await contract2.barr(1)).equal(BigNumber.from('51'))

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

		//! Learn functions
		//! VISIBILITY IDENTIFIERS:
		// 1. public: callable internally, externally and also by inherited contracts
		// 2. private callable only via contract itself not via derived contract
		// 3. external: callable only from other contracts and externally (*not* callable by contract itself)
		// 4. internal: () callable only from contract itself or from derived contracts *not* by transactions

		expect(await contract2.myString()).equal('')
		// Learn: Getter function can either be pure or view
		// PURE FUNCTIONS cannot modify/read state variables
		expect(await contract2.sumExternalPure(2, 3)).equal(5) // external pure
		expect(await contract2.multiplyPublicPure(2, 3)).equal(6) // public pure
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
		expect(foo).equal(7)
		expect(bar).equal(8)
		expect(baz).equal(9)
		const yourEvent = receipt.events.find((event) => event.event === 'yourEvent')
		const [buzz] = yourEvent.args
		expect(buzz).equal('bacardi')
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
		await contract2.deployed()

		// All functions return tx (transaction) data (*non view and *non pure functions)
		const tx = await contract2.simpleFunction()
		// console.log({tx})
		expect(typeof tx).equal('object')
		const expectedKeys = ['hash', 'type', 'accessList', 'blockHash', 'blockNumber', 'transactionIndex', 'confirmations', 'from', 'gasPrice', 'maxPriorityFeePerGas', 'maxFeePerGas', 'gasLimit', 'to', 'value', 'nonce', 'data', 'r', 's', 'v', 'creates', 'chainId', 'wait']
		// const {gasPrice, gasLimit, maxFeePerGas} = tx
		// console.log({gasPrice, gasLimit, maxFeePerGas})

		expect(Object.keys(tx)).to.have.same.members(expectedKeys)

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
// const ethValue = ethers.utils.formatEther(weiValue) //? Convert wei to ether

// Learn simple math with BigNumber (subtraction)
// console.log(BigNumber.from('33919000271350').sub(BigNumber.from('33919000271360')))

describe('Contract 3 Tests', function () {
	it('simple amount transfer', async function () {
		// Contracts are deployed using the first signer/account by default
		const [firstAcc] = await ethers.getSigners()
		const Contract3 = await ethers.getContractFactory('Contract3')
		const ONE_GWEI = 10 ** 9
		const amount = 2 * ONE_GWEI

		const contract3 = await Contract3.deploy() //! last argument will pbe msg object ~Sahil (check Lock.js file)
		await contract3.deployed()
		// console.log(contract3.address) // Address of contract. It changes on every run of the test ~Sahil
		expect(await contract3.balance()).equal(0) // initial value
		// Adding money to contract address from thin air IMO ~Sahil (=> Passing msg.value to solidity function: https://ethereum.stackexchange.com/a/102760)
		await contract3.getMoney({value: amount}) // tldr: last argument is considered as `msg` object ~Sahil
		expect(await contract3.balance()).equal(amount) // balance is returned in gwei
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

// describe('ecomm', function () {
// 	it('ecomm1', async function () {
// 		const adminAddress = 'sd'
// 		const daiAddress = ''
// 		const paymentId = ''
// 		const addressZero = ethers.constants.AddressZero

// 		const PaymentProcessor = await ethers.getContractFactory('PaymentProcessor')
// 		const paymentProcessor = await PaymentProcessor.deploy(adminAddress, daiAddress)
// 		await paymentProcessor.deployed()
// 		const paymentAddress = paymentProcessor.address

// 		const [owner, address1] = await ethers.getSigners()

// 		expect(await paymentProcessor.pay(200, paymentId))
// 			.to.emit(paymentProcessor, 'PaymentDone')
// 			.withArgs(addressZero, owner.address)

// 		// ! ??????
// 		// ! ??????
// 		// a getter is created for every public variable
// 		// let myuInt = await paymentProcessor.myuInt()
// 		// myuInt = myuInt.toString()
// 		// console.log({myuInt})
// 	})
// })
