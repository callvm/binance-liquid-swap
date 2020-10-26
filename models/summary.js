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
    }

})


module.exports = mongoose.model('Summary', summarySchema)