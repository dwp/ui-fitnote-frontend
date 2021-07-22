var logger = require(appRootDirectory + '/app/functions/bunyan');
var hasTimedOut = require(appRootDirectory + '/app/functions/timeoutRedirect');
const config = require('config');

exports.isAuthenticated = function isAuthenticated(req, res, next) {
    var redirectUrl;

    if (config.util.getEnv('NODE_ENV') !== 'test') {
        if (req.cookies.sessionId) {
            logger.info('Session Valid');
            res.locals.lang = req.language || 'en';
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
