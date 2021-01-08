const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const poolRouter = require('./controllers/pools')
const BinanceAPI = require('./services/binance-api').BinanceAPI
const api = new BinanceAPI()

let dbString

// production db
if (process.env.npm_lifecycle_event === 'start') {
  dbString = 'mongodb://' + config.DB_USER;
  dbString = dbString + ':' + config.DB_PASSWORD;
  dbString = dbString + '@' + config.DB_ADDRESS;
  dbString = dbString + ':' + config.DB_PORT;
  dbString = dbString + '/' + config.DB_NAME;
} 
// local development db
else {
  dbString = config.MONGODB_URI
}

logger.info('connecting to', dbString)

mongoose.connect(dbString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/pools', poolRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

// Get the current report now, and again every 60 mins

api.currentReport()
setInterval(api.currentReport, 60000 * 60 * 1)

module.exports = app