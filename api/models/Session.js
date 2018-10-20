var moment = require('moment');

module.exports = function (orm, db) {
  var Session = db.define('session', {
    id: { type: 'integer', autoIncrement: true, unique: true },
    key: { type: 'text', required: true, unique: true },
    started: { type: 'date', required: false, time: true },
    ended: { type: 'date', required: false, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        if (this.started == null){
          this.started = new Date();
        }
      }
    },
    methods: {
      serialize: function () {
        return {
          id: this.id,
          key: this.key,
          started: this.started,
          ended: this.ended
        }
      }
    }
  });
};