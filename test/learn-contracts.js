const {expect} = require('chai')
const {ethers} = require('hardhat')
// const {ethers} = require('ethers') // from your own
// Article Writing Test for Contract: https://dev.to/jacobedawson/import-test-a-popular-nft-smart-contract-with-hardhat-ethers-12i5
// Gtihub: https://github.com/jacobedawson/import-test-contracts-hardhat
// Writing Test (Truffle): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript/
// Writing Test (Solidity): https://trufflesuite.com/docs/truffle/testing/writing-tests-in-solidity/
// Ethers Api Docs: https://docs.ethers.io/v5/api/utils/bignumber/

// describe.skip('Lear Solidity Contracts', function () {
// 	it('first contract', async function () {
// 		const Variables = await ethers.getContractFactory('variables')
// 		const variables = await Variables.deploy()
// 		await variables.deployed()
// 		const variablesAddress = variables.address

// 		// a getter is created for every public variable
// 		let myuInt = await variables.myuInt()
// 		myuInt = myuInt.toString()
// 		console.log({myuInt})
// 	})
// })

describe('ecomm', function () {
	it('ecomm1', async function () {
		const adminAddress = 'sd'
		const daiAddress = ''
		const paymentId = ''
		const addressZero = ethers.constants.AddressZero

		const PaymentProcessor = await ethers.getContractFactory('PaymentProcessor')
		const paymentProcessor = await PaymentProcessor.deploy(adminAddress, daiAddress)
		await paymentProcessor.deployed()
		const paymentAddress = paymentProcessor.address

		const [owner, address1] = await ethers.getSigners()

		expect(await paymentProcessor.pay(200, paymentId))
			.to.emit(paymentProcessor, 'PaymentDone')
			.withArgs(addressZero, owner.address)

		// ! ??????
		// ! ??????
		// a getter is created for every public variable
		// let myuInt = await paymentProcessor.myuInt()
		// myuInt = myuInt.toString()
		// console.log({myuInt})
	})
})
