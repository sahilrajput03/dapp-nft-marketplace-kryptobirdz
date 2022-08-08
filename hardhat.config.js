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

const fs = require('fs')
// Private key of your account you created via metamask
const keyData = fs.readFileSync('./p-key.txt', {
	encoding: 'utf8',
	flag: 'r',
})

const projectId = 'ab3704f728034cb3ba2efbe718e72788'

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
		mumbai: {
			url: `"https://polygon-mumbai.infura.io/v3/add${projectId}`,
			accounts: [keyData], // account from metamask
		},
		//LEARN: mainnet is like production server.
		mainnet: {
			url: `https://mainnet.infura.io/v3/${projectId}`,
			accounts: [keyData], // account from metamask
		},
	},
	// Adding optimizer for solidity coz its gonna simplify complicated expressions, it can reduce gas cost and a whole bunch of good stuff.
	solidity: {
		version: '0.8.9',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
}

// module.exports = {
// 	solidity: '0.8.9',
// }
