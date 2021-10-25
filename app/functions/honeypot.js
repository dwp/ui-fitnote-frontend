const logger = require('./bunyan');

exports.honeypot = function honeypot(field, message) {
  if (field) {
    logger.info(message);
    return false;
  }
  return true;
};
