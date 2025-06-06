import config from 'config';
import logger from '../../functions/bunyan.js';

function serverError(req, res) {
  if (config.nodeEnvironment !== 'test') {
    logger.error('500');
    res.status(500);
  }

  res.render('errors/500', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    environment: config.util.getEnv('NODE_ENV'),
    timeStamp: Date.now(),
  });
}

export default serverError;
