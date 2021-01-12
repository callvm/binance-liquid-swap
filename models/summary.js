const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const summarySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    pools: {
        type: [Object],
        required: true
    },
    coins: {
        type: Object
    },
    usdValue: {
        type: Number
    },
    volume: {
        type: Number
    },
    fees: {
        type: Number
    }

})


module.exports = mongoose.model('Summary', summarySchema)