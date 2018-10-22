require('dotenv').config()
var path        = require('path');
var settings    = require('./api/config/settings');
var environment = require('./api/config/environment');
var models      = require('./api/models/');
var home = require('./api/controllers/homeController');
var ExpressPeerServer = require('peer').ExpressPeerServer;
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000 //created model loading here
  
var routes = require('./api/routes/routes');
environment(app);
routes(app);

server = app.listen(port);

// Start peer server
var expressPeerServer = ExpressPeerServer(server, {debug: true});
app.use('/peerjs', expressPeerServer);
app.get("*", home);

console.log('RESTful api started on: ' + port);
