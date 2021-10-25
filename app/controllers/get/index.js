const config = require('config');
const newSession = require('../../functions/createSessionId');
const retry = require('../../functions/retryCookie');
const logger = require('../../functions/bunyan');

function indexPage(req, res) {
  logger.info('Creating Session ID');
  const sessionId = newSession.createSessionId(req, res);
  retry.retryCookie(req, res);

  res.render('index', {
    sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

module.exports.indexPage = indexPage;
