const config = require('config');
const logger = require('./bunyan');

exports.retryCookie = function retryCookie(req, res) {
  logger.info('retry cookie generated');
  res.cookie('retry', '1', {
    httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
  });
  return true;
};
