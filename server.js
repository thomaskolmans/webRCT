var http = require('http');

var server = http.createServer(function(req, res) {
  res.end('Hello from NodeJS!\n');
})

server.listen(3000, '0.0.0.0');