import * as local from './config-local'
import * as mumbai from './config-mumbai'

let config

// FIX THIS USING: `hh.network.name`, please reafer file://./scripts/deployKryptoBird.js
if (process.env.MUMBAI === 'true') {
	config = mumbai
} else {
	config = local
}

export const nftmarketaddress = config.nftmarketaddress
export const nftaddress = config.nftaddress
