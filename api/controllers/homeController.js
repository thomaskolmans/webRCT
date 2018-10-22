var settings = require('../config/settings');
var path       = require('path');

module.exports = function (req, res, next) {
  res.sendFile(path.resolve(settings.path + '/../client/index.html'));
};