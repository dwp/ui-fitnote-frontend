const config = require('config');
const logger = require('../../functions/bunyan');
const newSession = require('../../functions/createSessionId');
const retry = require('../../functions/retryCookie');
const getLanguage = require('../../functions/getLanguage');
const enErrors = require('../../locales/en/errors.json');
const cyErrors = require('../../locales/cy/errors.json');

function esaPage(req, res) {
  const validationErrors = getLanguage(req.language) === 'en' ? JSON.stringify(enErrors) : JSON.stringify(cyErrors);
  let previousPageCYA = 0;
  const hasRefProperty = Object.prototype.hasOwnProperty.call(req.query, 'ref');

  if (hasRefProperty) {
    if (req.query.ref === 'no-esa') {
      previousPageCYA = -1;
    }
    if (req.query.ref === 'method-obtained') {
      previousPageCYA = 1;
    }
  }
  logger.info('Creating Session ID');
  const sessionId = newSession.createSessionId(req, res);
  retry.retryCookie(req, res);

  res.render('esa', {
    sessionId,
    version: process.env.npm_package_version,
    timeStamp: Date.now(),
    previousPageCYA,
    environment: config.util.getEnv('NODE_ENV'),
    validationErrors,
  });
}

module.exports.esa = esaPage;
