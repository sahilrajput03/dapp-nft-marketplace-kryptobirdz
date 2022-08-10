const {expect} = require('chai')
const {BigNumber} = require('ethers')
const {ethers} = require('hardhat')
// const {ethers} = require('ethers') // from your own
// Article Writing Test for Contract: https://dev.to/jacobedawson/import-test-a-popular-nft-smart-contract-with-hardhat-ethers-12i5
// Gtihub: https://github.com/jacobedawson/import-test-contracts-hardhat
// Writing Test (Truffle): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript/
// Writing Test (Solidity): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-solidity/
// Ethers Api Docs: https://docs.ethers.io/v5/api/utils/bignumber/

// Introduction to Simple Smart Contract: https://docs.soliditylang.org/en/develop/introduction-to-smart-contracts.html?highlight=address(0)#index-8
// zero address: https://stackoverflow.com/questions/48219716/what-is-address0-in-solidity#:~:text=Note%3A%20There%20is%20also%20the,is%20set%20to%20'0x0'.&text=address(0)%20is%20also%20the,send%20'burned'%20tokens%20to.
const zeroAddress = '0x0000000000000000000000000000000000000000'
const myAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

describe('Contract1 Tests', function () {
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
		expect(address).to.equal(myAddress)
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
		expect(await contract1.myMap(0)).equal(myAddress)
		expect(await contract1.myMap(3)).equal(zeroAddress) // bcoz key 3 is not initialized

		// init user with respective address; setting value in `myMap` in contract
		await contract1.initUser(17, myAddress)
		expect(await contract1.myMap(17)).equal(myAddress)
	})
})

describe('Contract2 Tests', function () {
	it('second contract', async function () {
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
		expect(newFund.addr).to.equal(myAddress)
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
		const value = await contract2.arr(0) // contract2.arr(0) gets value at 0 index
		expect(value).equal(5)
		expect(value).equal(BigNumber.from('5'))

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
