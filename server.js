require('dotenv').config()
var path        = require('path');
var settings    = require('./api/config/settings');
var environment = require('./api/config/environment');
var models      = require('./api/models/');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000 //created model loading here

// Start peer server
var PeerServer = require('peer').PeerServer;
var server = PeerServer({port: 9000, path: '/peer-server'});

var routes = require('./api/routes/routes');
environment(app);
routes(app);

app.listen(port);

console.log('RESTful api started on: ' + port);
