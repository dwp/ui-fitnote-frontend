const config = require('config');

function refreshTime(res, logType) {
  const expires = new Date(Date.now() + config.get('sessionInfo.expiryPeriod'));
  res.cookie('exp', expires.toUTCString(), {
    httpOnly: true, secure: config.get('cookieOptions.secure'), sameSite: true, expires: 0,
  });
  logType.info('Session timeout refreshed');
  return expires;
}

module.exports.refreshTime = refreshTime;
