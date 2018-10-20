var path     = require('path');
var express  = require('express');
var settings = require('./settings');
var models   = require('../models/');
var methodOverride = require('method-override')
var bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(express.static(path.join(settings.path, '/../client')));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(function (req, res, next) {
      models(function (err, db) {
        if (err) return next(err);

        req.models = db.models;
        req.db     = db;

        return next();
      });
    });
};