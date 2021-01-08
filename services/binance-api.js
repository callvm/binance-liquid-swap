const fetch = require('node-fetch')
const Summary = require('../models/summary')
const config = require('../utils/config')

BinanceAPI = function () {

    this.currentReport = async () => {

        try {

            let report = await fetch(config.BINANCE_API)
            let json = await report.json()
            let pools = []

            // Reduce the verbose info provided by Binance API down to just what we want

            json.data.forEach(coin => {

                let pool = {

                    name: coin.coinPair,
                    daily: coin.yesterdayEarnRatio,
                    usdValue: coin.poolShareValue,

                    coins: ((function (list) {
                        let ret = []
                        list.forEach(item => {
                            ret.push({
                                name: item.coin,
                                amount: item.amount
                            })
                        })
                        return ret
                    }))(coin.coinList)

                }

                pools.push(pool)

            });

            // Save the summary

            let summary = new Summary(
                {
                    "date": new Date(),
                    "pools": pools
                })

            await summary.save()

        } catch (err) {

        }
    }

}

exports.BinanceAPI = BinanceAPI