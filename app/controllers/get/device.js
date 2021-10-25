const config = require('config');
const logger = require('../../functions/bunyan');
const enErrors = require('../../locales/en/errors.json');
const cyErrors = require('../../locales/cy/errors.json');

function devicePage(req, res) {
  let errorMessage;
  const validationErrors = req.language === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  if (req.query.device === '0') {
    errorMessage = {
      device: {
        message: req.i18nTranslator.t('errors:device.missing'),
        field: 'radioPhone',
      },
    };
  }

  logger.info(req.cookies.sessionId);

  res.render('device', {
    sessionId: req.cookies.sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    environment: config.util.getEnv('NODE_ENV'),
    errors: errorMessage,
    validationErrors,
  });
}

module.exports.device = devicePage;
