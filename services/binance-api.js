const fetch = require('node-fetch')
const Summary = require('../models/summary')

BinanceAPI = function () {

    this.currentReport = async () => {

        try {

            let report = await fetch('https://www.binance.com/gateway-api/v1/public/swap-api/pool/pairList?type=STAKE')
            let json = await report.json()
            let pools = []

            // Reduce the verbose info provided by Binance API down to just what we want

            json.data.forEach(coin => {
 
                let pool = {

                    name: coin.coinPair,
                    weekly: coin.apyOneWeek,
                    daily: coin.apyOneDay,

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