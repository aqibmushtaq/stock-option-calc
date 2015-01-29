/**
  * Module dependencies.
  */
var express = require('express');
var http = require('http');
var https = require('https');
var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var request = require('request');
var async = require('async');
var log4js = require('log4js');
var config = require('./config')();
var app = express();


// Setup the logger
log4js.configure({
  "appenders": [
      {type: "console", category: "console"},
      {type: "file", filename: 'logs/server.log', maxLogSize: 104857600, backups: 100}
    ]
});
var logger = log4js.getLogger(config.logLevel);

// all environments
app.set('port', config.port || 3000);
app.set('async', async);
app.set('request', request);
app.set('logger', logger);
app.use(function(req, res, next) {
  logger.error("req");
  logger.info('%s %s', req.method, req.url);
  next();
});

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// Attach routes
fs.readdirSync('./controllers').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app);
    }
});

var privateKey = fs.readFileSync('./certs/key.pem').toString();
var certificate = fs.readFileSync('./certs/cert.pem').toString();
var credentials = {key: privateKey, cert: certificate};
https.createServer(credentials, app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
    logger.debug('Express server listening on port ' + app.get('port'));
});
