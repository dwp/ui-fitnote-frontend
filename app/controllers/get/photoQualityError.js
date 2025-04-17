import config from 'config';
import logger from '../../functions/bunyan.js';

function photoQualityError(req, res) {
  if (config.nodeEnvironment !== 'test') {
    logger.error('422');
    res.status(422);
  }

  res.render('errors/422', {
    title: '422 : Photo quality error',
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    environment: config.util.getEnv('NODE_ENV'),
    timeStamp: Date.now(),
  });
}

export default photoQualityError;
