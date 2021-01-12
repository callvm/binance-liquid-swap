const fetch = require('node-fetch')
const Summary = require('../models/summary')
const config = require('../utils/config')

BinanceAPI = function () {

    this.currentReport = async () => {

        try {

            let report = await fetch(config.BINANCE_API)
            let json = await report.json()
            let pools = []
            let coinsTotal = new Map()
            let usdTotal = 0
            let volume = 0
            let fees = 0

            // Reduce the verbose info provided by Binance API down to just what we want

            json.data.forEach(coin => {

                usdTotal += Number(coin.poolShareValue)

                let pool = {

                    name: coin.coinPair,
                    daily: coin.yesterdayEarnRatio,
                    usdValue: Number(coin.poolShareValue).toFixed(2),
                    totalFees: (Number(coin.feeAmount) + Number(coin.interestAmount)).toFixed(2),
                    volume: (Number(coin.feeAmount) * 2500).toFixed(2),

                    coins: ((function (list) {
                        let ret = []
                        list.forEach(item => {

                            if (coinsTotal.has(item.coin)) {
                                let total = coinsTotal.get(item.coin) + Number(item.amount)
                                coinsTotal.set(item.coin, total)
                            } else {
                                coinsTotal.set(item.coin, Number(item.amount))
                            }


                            ret.push({
                                name: item.coin,
                                amount: Number(item.amount).toFixed(2)
                            })
                        })
                        return ret
                    }))(coin.coinList)

                }
                volume += Number(pool.volume)
                fees += Number(pool.totalFees)
                pools.push(pool)

            });

            // Save the summary

            let summary = new Summary(
                {
                    "date": new Date(),
                    "pools": pools,
                    "usdValue": usdTotal.toFixed(2),
                    "coins": coinsTotal,
                    "volume": volume.toFixed(2),
                    "fees": fees.toFixed(2)
                })

            await summary.save()

        } catch (err) {

        }
    }

}

exports.BinanceAPI = BinanceAPI