const config = require('config');
const logger = require('../../functions/bunyan');

function completePage(req, res) {
  res.render('complete', {
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
    sessionId: req.cookies.sessionId,
  });

  // Make sure the cookies are cleared AFTER page render,
  // so GA can get values, but cleared for security
  res.clearCookie('sessionId');
  res.clearCookie('exp');
  res.clearCookie('retry');
  logger.info('Cleared Session ID');
  logger.info('Process Complete');
}
module.exports.completePage = completePage;
