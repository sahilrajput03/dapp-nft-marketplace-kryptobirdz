require('dotenv').config()

//? ~Sahil: ALL CONFIG OPTIONS IN DOCS: https://hardhat.org/hardhat-runner/docs/config

// require('@nomicfoundation/hardhat-toolbox')
// Get Assertions, Docs: https://hardhat.org/hardhat-chai-matchers/docs/overview
// require('@nomicfoundation/hardhat-chai-matchers')
require('@nomiclabs/hardhat-waffle')

// Migration Guide from "@nomicfoundation/hardhat-waffle => @nomicfoundation/hardhat-toolbox" :https://hardhat.org/hardhat-chai-matchers/docs/migrate-from-waffle
// Why migrate: https://hardhat.org/hardhat-chai-matchers/docs/migrate-from-waffle#why-migrate?
// From tutorial
// - require('@nomicfoundation/hardhat-waffle')
// + import '@nomicfoundation/hardhat-chai-matchers'

// To add capability to run tests in watch mode ~Sahil
require('hardhat-watcher')

// const fs = require('fs')
// Private key of your account you created via metamask
// const privateKeyPolygonAccount = fs.readFileSync('./p-key.txt', {
// 	encoding: 'utf8',
// 	flag: 'r',
// })

const projectId = 'ab3704f728034cb3ba2efbe718e72788'
// This is highly sensitive and you should get this private key from server somehow though ~ Author.
const PRIVATE_KEY = process.env.PRIVATE_KEY
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY
// From alchemy's "Demo App"
const ALCHEMY_API_KEY = 'C4QURL1CGkEuSDPTR2LO7nuFLFVXQ5tD'

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
	defaultNetwork: 'hardhat',
	networks: {
		// hardhat is like local development server.
		hardhat: {
			chainId: 1337, // config standard
		},
		//! couldn't set `polygon-mumbai` in `infura` ~Sahil
		//LEARN: mumbai-testnet is live development server.
		// mumbai: {
		// 	url: `https://polygon-mumbai.infura.io/v3/add${projectId}`,
		// 	accounts: [PRIVATE_KEY], // account from metamask
		// },
		//LEARN: mainnet is like production server.
		mainnet: {
			url: `https://mainnet.infura.io/v3/${projectId}`,
			accounts: [PRIVATE_KEY], // account from metamask
		},
		// Learn: Deployment to polygontestnet (mumbai); source: https://docs.polygon.technology/docs/develop/hardhat#compiling-the-contract
		matic: {
			url: 'https://rpc-mumbai.maticvigil.com',
			accounts: [PRIVATE_KEY],
		},
		goerli: {
			url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
			accounts: [PRIVATE_KEY],
		},
	},
	// source: https://docs.polygon.technology/docs/develop/hardhat#compiling-the-contract
	etherscan: {
		apiKey: POLYGONSCAN_API_KEY,
	},
	// Adding optimizer for solidity coz its gonna simplify complicated expressions, it can reduce gas cost and a whole bunch of good stuff.
	solidity: {
		// version: '0.8.9', // from nft market course project
		version: '0.8.16', // @latest
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	// Run it via: `npx hardhat watch compilation`
	watcher: {
		'learn-contracts': {
			start: 'tmux clear-history -t $(tmux display -pt "${TMUX_PANE:?}" "#{pane_index}")', // https://github.com/sahilrajput03/flash-runner-npm/blob/main/startTesting.js#L86
			// start: 'echo Running task now..', // https://github.com/sahilrajput03/flash-runner-npm/blob/main/startTesting.js#L86
			clearOnStart: true,
			// Using Position arguments hardhat watcher: https://github.com/xanderdeseyn/hardhat-watcher#positional-arguments
			tasks: [{command: 'test', params: {testFiles: ['./test/learn-contracts.js']}}],
			files: ['./contracts', './test/learn-contracts.js'],
		},
		lock: {
			start: 'tmux clear-history -t $(tmux display -pt "${TMUX_PANE:?}" "#{pane_index}")', // https://github.com/sahilrajput03/flash-runner-npm/blob/main/startTesting.js#L86
			clearOnStart: true,
			tasks: [{command: 'test', params: {testFiles: ['./test/Lock.js']}}],
			files: ['./contracts', './test/Lock.js'],
		},
	},
}

// module.exports = {
// 	solidity: '0.8.9',
// }

/*
LEARN ~ Sahil
COMMAND
npx hardhat test --help
# OUTPUT:
# Hardhat version 2.10.1
# 
# Usage: hardhat [GLOBAL OPTIONS] test [--bail] [--grep <STRING>] [--no-compile] [--parallel] [...testFiles]
# 
# OPTIONS:
# 
#   --bail        Stop running tests after the first test failure
#   --grep        Only run tests matching the given string or regexp
#   --no-compile  Don't compile before running this task
#   --parallel    Run tests in parallel
# 
# POSITIONAL ARGUMENTS:
# 
#   testFiles     An optional list of files to test (default: [])
# 
# test: Runs mocha tests
# 
# For global options help run: hardhat help
*/
