var price = require("../models/price");
var exchange = require("../models/exchange");

module.exports.controller = function (app) {

    this.app = app;

    app.get("/calc", function(req, res) {

        app.get("logger").trace("Calc request");

        var strikePrice = req.query.strike_price || 0;          // the strike price in dollars for a single NOW share
        var shareCount = req.query.share_count || 0;            // The number of NOW shares you own
        var transactionCost = req.query.transaction_cost || 10; // The amount in dollars Fidelity charge to transfer your earnings into your bank account electronically
        var taxRate = req.query.tax_rate || 40;                 // The percentage of your earnings which will be claimed by the Tax Man

        app.get("async").parallel({
            price: new price(app).getValue,      // The current price of a NOW share
            exchange: new exchange(app).getValue // The current exchange rate between USD and GBP
        },
        function (err, results) {
            if (err) {
                res.send(JSON.stringify({"amount": -1}));
                return;
            }

            var amount = (((((results["price"] - strikePrice) * shareCount * results["exchange"]) / 100) * (100 - taxRate)) - (transactionCost * results["exchange"])).toFixed(2);
            res.send(JSON.stringify({"amount": amount}));
        });
    });

};
