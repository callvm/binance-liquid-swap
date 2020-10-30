const poolRouter = require('express').Router()
const Summary = require('../models/summary')
const { json } = require('express')
const config = require('../utils/config')
const SummaryManager = require('../services/summary-manager').SummaryMananger
const summaryManager = new SummaryManager()


poolRouter.get('/', async (req, res) => {

    const summaries = await Summary.find({})
    res.send(summaries.map(summary => {
        return {
            date: summary.date,
            pools: summary.pools
        }
    }))

})

poolRouter.get('/latest', async (req, res) => {

    let ret = await summaryManager.getLatest()
    res.json(ret)

})


module.exports = poolRouter