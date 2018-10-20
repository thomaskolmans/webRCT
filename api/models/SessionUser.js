var moment = require('moment');

module.exports = function (orm, db) {
  var SessionUser = db.define('session_user', {
    id: { type: 'integer', autoIncrement: true, unique: true },
    session_id: { type: 'integer', required: true },
    key: { type: 'text', required: true },
    entered: { type: 'date', required: false, time: true },
    left: { type: 'date', required: false, time: true }
  },
  {
    hooks: {
      beforeValidation: function () {
        if (this.entered == null){
          this.entered = new Date();
        }
      }
    },
    methods: {
      serialize: function () {
        return {
          id: this.id,
          session_id: this.session_id,
          key: this.key,
          entered: this.entered,
          left: this.left
        }
      }
    }
  });
};