const poolRouter = require('express').Router()
const Summary = require('../models/summary')
const { json } = require('express')
const config = require('../utils/config')


poolRouter.get('/', async (req, res) => {

    const summaries = await Summary.find({})
    res.send(summaries.map(summary => {
        return {
            date: summary.date,
            pools: summary.pools
        }
    }))

})

module.exports = poolRouter