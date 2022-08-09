const {expect} = require('chai')
const {ethers} = require('hardhat')

describe('Lear Solidity Contracts', function () {
	it('first contract', async function () {
		const Variables = await ethers.getContractFactory('variables')
		const variables = await Variables.deploy()
		await variables.deployed()
		const variablesAddress = variables.address

		let myuInt = await variables.myuInt()
		myuInt = myuInt.toString()
		console.log({myuInt})
	})
})
