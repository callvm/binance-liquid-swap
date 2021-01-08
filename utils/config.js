require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
const BINANCE_API = process.env.BINANCE_API

module.exports = {
  BINANCE_API,
  MONGODB_URI,
  PORT
}
