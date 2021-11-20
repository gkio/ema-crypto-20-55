const listener = require('./listener')
const { request } = require('./helpers')


const { ASSETS_FROM, ASSETS_TO }  = process.env

const ASSET_CATEGORY = 'BNB'
const filterAssets = ({ q }) => q === ASSET_CATEGORY 

const getAssets = async () => {
	const URL = "https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-products?includeEtf=true"
	const { data } = await request(URL)
	return data.filter(filterAssets)
}

const main = async () => {
	const assets = await getAssets()

	for(asset of assets.slice(ASSETS_FROM, ASSETS_TO)) {
		const { s: symbol } = asset
		listener(symbol)
	}
}

(async () => {
	await main()
})()