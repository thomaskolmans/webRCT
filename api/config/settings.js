require('dotenv').config()
var path       = require('path');

var settings = {
  path       : path.normalize(path.join(__dirname, '..')),
  port       : process.env.PORT || 3000,
  database   : {
    protocol : process.env.DB_CONNECTION,
    query    : { pool: true },
    port     : process.env.DB_PORT,
    host     : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    user     : process.env.DB_USERNAME,
    password : process.env.DB_PASSWORD
  }
};
module.exports = settings;