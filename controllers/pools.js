const poolRouter = require('express').Router()
const Summary = require('../models/summary')
const { json } = require('express')
const config = require('../utils/config')
const SummaryManager = require('../services/summary-manager').SummaryMananger
const summaryManager = new SummaryManager()


poolRouter.get('/', async (req, res) => {

    let ret = await summaryManager.getLatest()
    res.json(ret)

})


poolRouter.post('/coin', async (req, res) => {
    try {
        let result = await summaryManager.generateReport(req.body.total, req.body.interval, req.body.coin)
        res.json(result)
    } catch (err) {
        console.log(err)
    }
})




module.exports = poolRouter