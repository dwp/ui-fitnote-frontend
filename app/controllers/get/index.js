import config from 'config';
import newSession from '../../functions/createSessionId.js';
import retry from '../../functions/retryCookie.js';
import logger from '../../functions/bunyan.js';

function indexPage(req, res) {
  logger.info('Creating Session ID');
  const sessionId = newSession(req, res);
  retry(req, res);

  res.render('index', {
    sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
  });
}

export default indexPage;
