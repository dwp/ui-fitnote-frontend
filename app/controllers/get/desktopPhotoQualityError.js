const config = require('config');
const logger = require('../../functions/bunyan');

function desktopPhotoQualityError(req, res) {
  if (config.nodeEnvironment !== 'test') {
    logger.error('422-desktop');
    res.status(422);
  }

  res.render('errors/422-desktop', {
    title: '422 : Photo quality error',
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    environment: config.util.getEnv('NODE_ENV'),
    timeStamp: Date.now(),
  });
}

module.exports.desktopPhotoQualityError = desktopPhotoQualityError;
