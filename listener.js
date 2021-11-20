const WebSocket = require('ws');
const {
  EMA
} = require('trading-signals');
const {
  request
} = require('./helpers');
const {
  Telegraf
} = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)
const INTERVAL = '1m'

const getSocketUrl = (symbol, interval) => {
  return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
}

const getAssetUrl = (count, symbol, interval) => {
  return `https://www.binance.com/api/v3/klines?limit=${count}&symbol=${symbol}&interval=${interval}`
}

const normalizeAssetData = (assetData) => assetData[4]

const fetchAssets = async (asset) => {
  const COUNT_CANDLES = 500
  const URL = getAssetUrl(COUNT_CANDLES, asset, INTERVAL)
  const data = await request(URL)

  return data.map(normalizeAssetData)
}

const getEma = data => {
  const fromEma = new EMA(20)
  const toEma = new EMA(55)

  data.forEach(d => {
    fromEma.update(d)
    toEma.update(d)
  })

  const finalFromEma = fromEma.getResult().toFixed(15)
  const finalToEma = toEma.getResult().toFixed(15)
  return [finalFromEma, finalToEma]
}

const onMessageWrapper = (SYMBOL, defaultCloses) => {
  let closes = defaultCloses
  let [prevEmaFrom, prevEmaTo] = getEma(closes)
  let shoudlBuy = true
  let shoudlSell = false

  const onMessage = (message) => {
    if (!message) return;

    const msg = JSON.parse(message)

    const candle = msg.k
    const isCandleClosed = candle.x
    const close = candle.c

    closes = closes.slice(-499)
    closes.push(close)

    if (isCandleClosed) {
      const [emaFrom, emaTo] = getEma(closes)
      console.log(``)
      if (emaFrom > emaTo && prevEmaFrom && shoudlBuy) {
        if (prevEmaFrom < prevEmaTo) {
          shoudlBuy = false
          shoudlSell = true
          bot.telegram.sendMessage(process.env.CHAT_ID, `
📈 [BUY] ${SYMBOL} emaFrom: ${emaFrom} emaTo: ${emaTo} at price ${close}
Binance: https://www.binance.com/en/trade/${SYMBOL}?layout=basic
          `)
        }
      }

      prevEmaTo = emaTo
      prevEmaFrom = emaFrom
    }
  }

  return onMessage
}

const listener = async (symbol) => {
  console.log(`listening symbol: [${symbol}]`)
  const URL = getSocketUrl(symbol, INTERVAL)
  let closes = await fetchAssets(symbol)
  const ws = new WebSocket(URL)
  ws.on('message', onMessageWrapper(symbol, closes))
}

module.exports = listener