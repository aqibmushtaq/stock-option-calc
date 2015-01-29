function Exchange(app) {
  this.app = app;

  this.getValue = function(callback) {
      app.get("logger").trace("Getting exchange rate");
      var request = app.get("request");
      var request = require("request");
      var url = "http://rate-exchange.appspot.com/currency?from=USD&to=GBP";
      var metadata = {url: url, json: true};
      var urlHandler = function(error, response, body) {
          var exchangeRate = parseFloat(body.rate);
          app.get("logger").debug("Exchange rate is " + exchangeRate);
          callback(null, exchangeRate);
      };
      request(metadata, urlHandler);
  };
}
module.exports = Exchange;
