const logger = require('./bunyan');

exports.redirectTimeout = function timeout(msg) {
  logger.info(msg);
  return '/session-timeout';
};
