const config = require('config');
const logger = require('./bunyan');
const hasTimedOut = require('./timeoutRedirect');
const getLanguage = require('./getLanguage');

exports.isAuthenticated = function isAuthenticated(req, res, next) {
  let redirectUrl;

  if (config.util.getEnv('NODE_ENV') !== 'test') {
    if (req.cookies.sessionId) {
      logger.info('Session Valid');
      res.locals.lang = getLanguage(req.language);
      res.locals.exp = req.cookies.exp || false;
      return next();
    }

    logger.error('No valid session');
    redirectUrl = hasTimedOut.redirectTimeout('No Session ID');
    return res.redirect(redirectUrl);
  }

  // Test only allows you to view all pages without a session ID.
  return next();
};
