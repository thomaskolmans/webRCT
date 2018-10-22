'use strict';
module.exports = function(app) {
  var session = require('../controllers/sessionController');
  var home = require('../controllers/homeController');

  app.get('/', home);

  app.get('/session/:key', session.get);
  app.get('/session/:key/users', session.get_users);
  app.get('/session/:key/active/users', session.get_active_users);

  app.post('/session/create', session.create);
  app.post('/session/join', session.join);
  app.post('/session/leave', session.leave);
  app.post('/session/end', session.end);

};