import * as local from './config-local'
import * as mumbai from './config-mumbai'

let config

if (process.env.MUMBAI === 'true') {
	config = mumbai
} else {
	config = local
}

export const nftmarketaddress = config.nftmarketaddress
export const nftaddress = config.nftaddress
