const Summary = require('../models/summary')

SummaryMananger = function () {

    this.getLatest = async () => {
        const summaries = await Summary.find({})
        const latest = summaries[summaries.length - 1]
        const trend = await this.generateReport(7)
        console.log(trend)

        for (pool of latest.pools) {
            pool.sevenDayTrend = trend[pool.name]
        }

        return latest
    }

    this.generateReport = async (total, interval = 24, coin) => {

        const summaries = await Summary.find({})
        const ret = {}

        // Start at the latest summary, reduce by index by interval summaries each time, and do this as long as
        // we still have summaries and we've added less than the specified number of reports

        let added = 0
        for (let i = summaries.length - 1; (i > 0 && added < total); i -= interval) {

            let summary = summaries[i]
            let time = summary.date

            summary.pools.forEach(pool => {
                if (ret.hasOwnProperty(pool.name)) {
                    let arr = ret[pool.name]
                    arr.push({ time: time, amount: Number(pool.daily), coins: pool.coins })
                    ret[pool.name] = arr
                } else {
                    ret[pool.name] = [{ time: time, amount: Number(pool.daily), coins: pool.coins }]
                }
            })
            added++
        }

        if (coin !== undefined) {
            if (ret.hasOwnProperty(coin)) {
                return ret[coin]
            }
            return ({ error: 'Coin not found' })
        }
        return ret
    }

}

exports.SummaryMananger = SummaryMananger