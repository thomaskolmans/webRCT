var _       = require('lodash');
var helpers = require('./_helpers');
var orm     = require('orm');

module.exports = {
  get: function (req, res, next) {
    req.models.session.find({key: req.params.key, ended: null}, function (err, session) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ error: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      if (session.length > 0){
        return res.status(200).send(session[0].serialize());
      } else {
        return res.status(404).send({ error: "No session available for" });
      }
    });
  },
  get_users: function (req, res, next) {
    req.models.session.find({key: req.params.key}, function (err, sessions) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ error: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      if (sessions.length > 0){
        req.models.session_user.find({session_id: sessions[0].id}, function (err, session_users) {
          if(err) {
            if(Array.isArray(err)) {
              return res.status(422).send({ error: helpers.formatErrors(err) });
            } else {
              return next(err);
            }
          }
          return res.status(200).send(session_users);
        });
      } else {
        return res.status(404).send({ error: "No session available" });
      }
    });

  },
  get_active_users: function (req, res, next) {
    req.models.session.find({key: req.params.key}, function (err, sessions) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ error: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      if (sessions.length > 0){
        req.models.session_user.find({session_id: sessions[0].id, left: null}, function (err, session_users) {
          if(err) {
            if(Array.isArray(err)) {
              return res.status(422).send({ error: helpers.formatErrors(err) });
            } else {
              return next(err);
            }
          }
          return res.status(200).send(session_users);
        });
      } else {
        return res.status(404).send({ error: "No session available" });
      }
    });

  },
  create: function (req, res, next) {
    var params = _.pick(req.body, 'key');
    req.models.session.create(params, function (err, session) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ errors: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      return res.status(200).send(session.serialize());
    });
  },
  end: function (req, res, next) {
    var params = _.pick(req.body, 'key');
    req.models.session.find({key: params.key}, function (err, sessions) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ errors: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      sessions.forEach((session) => {
          req.models.session_user.find({session_id: session.id}, function (err, session_users) {
            if (session_users.length > 0){
              session_users.forEach((session_user) => session_user.remove());
            }
          });
          session.remove()
      })
      return res.status(200).send({success: "Your session has ended successfully"});
    });
  },
  join: function (req, res, next) {
    var params = _.pick(req.body, 'session_id', 'key');
    req.models.session_user.create(params, function (err, session_user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ error: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      req.models.session.find({id: params.session_id, ended: null}, function (err, session) {
        if(err) {
          if(Array.isArray(err)) {
            return res.status(422).send({ error: helpers.formatErrors(err) });
          } else {
            return next(err);
          }
        }
        if (session.length > 0){
          return res.status(200).send(session[0].serialize());
        } else {
          return res.status(404).send({ error: "No session available"});
        }
      });
    });
  },
  leave: function (req, res, next) {
    var params = _.pick(req.body, 'session_id', 'key');
    req.models.session_user.find({session_id: params.session_id, key: params.key}, function (err, session_user) {
      if(err) {
        if(Array.isArray(err)) {
          return res.status(422).send({ error: helpers.formatErrors(err) });
        } else {
          return next(err);
        }
      }
      if (session_user.length > 0){
        session_user[0].left = new Date();
        session_user[0].save();
      } else {
        return res.status(404).send({ error: "No session available" });
      }
      return res.status(200).send({success: "Your have succesfully left the session"});
    });
  }
};