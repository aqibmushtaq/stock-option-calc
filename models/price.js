function Price(app) {
  this.app = app;

  this.getValue = function(callback) {
      app.get("logger").trace("Getting stock price");
      var request = app.get("request");
      var url = "http://www.google.com/finance/info?client=ig&q=NOW";
      var metadata = {url: url, json: true};
      var urlHandler = function(error, response, body, callback2) {
          var stockPriceInUSD = parseFloat(body.split(":")[4].substr(2, 5));
          app.get("logger").debug("Stock price is " + stockPriceInUSD);
          callback(null, stockPriceInUSD);
      };
      request(metadata, urlHandler);
  };
}
module.exports = Price;
