const Summary = require('../models/summary')

SummaryMananger = function() {

    this.getLatest = async () => {
        const summaries = await Summary.find({})
        const latest = summaries[summaries.length - 1]
        const trend = await this.sevenDayTrend()

        for (pool of latest.pools){
            pool.sevenDayTrend = trend.get(pool.name)
        }

        return latest
    }

    this.sevenDayTrend = async () => {
        
        const summaries = await Summary.find({})
        const ret = new Map()

        // Start at the latest summary, reduce by index by 24 summaries each time (one day), and do this as long as
        // we still have summaries and our array is <= 7 in length

        for (let i = summaries.length - 1; (i > 0 && ret.size <= 7); i -= 24){
            
            let summary = summaries[i]
            
            summary.pools.forEach(pool => {
                
                if (ret.has(pool.name)){                 
                    let arr = ret.get(pool.name)
                    arr.push(Number(pool.daily))
                    ret.set(pool.name, arr)
                } else {

                    ret.set(pool.name, [Number(pool.daily)])
                }
            })
        }

        return ret
    }

}

exports.SummaryMananger = SummaryMananger