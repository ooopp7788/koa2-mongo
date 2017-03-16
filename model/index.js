const mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost/test', {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', 'mongodb://localhost/test', err.message);
    process.exit(1);
  }
});

require('./user');

exports.User         = mongoose.model('User');